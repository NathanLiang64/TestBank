import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Theme from 'themes/theme';
import Layout from 'components/Layout/Layout';
import { MainScrollWrapper } from 'components/Layout';
import { FEIBButton } from 'components/elements';
import { CurrencyInputField, DropdownField, TextInputField } from 'components/Fields';
import { toCurrency, dateToYMD, dateToString } from 'utilities/Generator';
import { showPrompt } from 'utilities/MessageModal';
import { getAccountsList } from 'utilities/CacheData';
import { getDurationTuple} from './utils/common';
import {
  generatebindAccountNoOptions, generateCycleModeOptions, generateCycleTimingOptions, generateMonthOptions,
} from './utils/options';
import HeroWithEdit from './components/HeroWithEdit';
import { EditPageWrapper } from './C00600.style';
import { generateEditSchema } from './validationSchema';

/**
 * C00600 存錢計畫 (新增) 編輯頁
 */
const DepositPlanEditPage = () => {
  const history = useHistory();
  const {state} = useLocation();
  const {
    program, subAccounts, hasReachedMaxSubAccounts, viewModel,
  } = state;

  const {
    control, handleSubmit, watch, reset, setValue,
  } = useForm({
    defaultValues: {
      name: '',
      cycleDuration: 4,
      cycleMode: 2,
      cycleTiming: '',
      amount: '',
      bindAccountNo: '',
      imageId: '',
      progCode: program.code,
    },
    resolver: yupResolver(generateEditSchema(program)),
  });
  const {
    cycleDuration, cycleMode, amount, bindAccountNo, imageId,
  } = watch();

  const getDefaultCycleTiming = () => {
    const date = new Date().getDate();
    return date < 28 ? date : 28;
  };

  const getGoalAmount = (cycleAmount, cycle, mode) => {
    const duration = mode === 1 ? 4 : 1;
    return parseInt(cycleAmount, 10) * cycle * duration;
  };

  const getRemainingBalance = (accountNo) => subAccounts?.find((a) => a.accountNo === accountNo)?.balance ?? 0;

  const onSubmit = async (data) => {
    if (typeof data.imageId !== 'number') {
      showPrompt(<p className="txtCenter">請選擇圖片</p>);
      return;
    }

    // 若存錢計畫屬於專案型，需要檢查「母帳戶+子帳戶的金額」是否低於「每期存錢金額」
    if (program.type) {
      const [mainAccount] = await getAccountsList('M');
      if (mainAccount.details[0].balance + getRemainingBalance(bindAccountNo) < data.amount) {
        showPrompt(<p className="txtCenter">您的帳戶餘額不足，無法建立專案型存錢計畫，請存入足夠金額，或選擇基本型存錢計畫</p>);
        return;
      }
    }

    const date = getDurationTuple(new Date(), data.cycleDuration, data.cycleMode, data.cycleTiming);
    const payload = {
      // =====建立存錢計畫所需參數=====
      progCode: data.progCode,
      imageId: data.imageId,
      name: data.name,
      startDate: dateToYMD(date.begin),
      endDate: dateToYMD(date.end),
      cycleMode: data.cycleMode,
      cycleTiming: data.cycleTiming,
      amount: data.amount,
      bindAccountNo: data.bindAccountNo === 'new' ? null : data.bindAccountNo,
      currentBalance: getRemainingBalance(data.bindAccountNo),
      // =====渲染需求參數=====
      goalAmount: getGoalAmount(data.amount, data.cycleDuration, data.cycleMode),
      extra: {
        rate: program.rate,
        period: `${dateToString(new Date())} ~ ${dateToString(date.end)}`,
        nextDeductionDate: dateToString(date.next),
      },
    };
    history.push('/C006004', {...state, payload });
  };

  useEffect(() => {
    // 如果是專案型計畫，將資料傳入 form 中
    const isProjectType = !!state.program.type;
    // 如果是從 C006004 導向回來，將 payload 帶入
    const {payload} = state;
    // eslint-disable-next-line no-nested-ternary
    const projectName = payload ? payload.name : isProjectType ? state.program.name : '';
    reset((formValues) => ({
      ...formValues,
      name: projectName,
      cycleDuration: isProjectType ? state.program.period : 4,
      cycleMode: 2,
      cycleTiming: getDefaultCycleTiming(),
      amount: payload ? payload.amount : '',
      bindAccountNo: payload ? payload.bindAccountNo ?? 'new' : '',
      imageId: payload ? payload.imageId : '',
    }));
  }, []);

  const disabled = !!program.type; // 若是專案型 (!==0)，特定欄位是固定值，不給使用者選擇
  const disabledColor = disabled ? Theme.colors.text.dark : '';

  return (
    <Layout title="新增存錢計畫" hasClearHeader goBackFunc={() => history.replace('C006002', {viewModel})}>
      <MainScrollWrapper>
        <EditPageWrapper>
          <form onSubmit={handleSubmit(onSubmit)}>
            <HeroWithEdit imageId={imageId} onChange={(id) => setValue('imageId', id)} />

            <div className="flex">

              <TextInputField
                name="name"
                control={control}
                labelName={`${program.type ? '計畫名稱' : '為你的計畫命名吧'}`}
                inputProps={{ maxLength: 7, placeholder: '請輸入7個以內的中英文字、數字或符號', disabled }}
                $color={disabledColor}
              />

              <DropdownField
                options={generateMonthOptions()}
                name="cycleDuration"
                control={control}
                labelName="預計存錢區間"
                inputProps={{disabled}}
                $color={disabledColor}
              />

              <div className="col-2">
                <div className="w-50">
                  <DropdownField
                    options={generateCycleModeOptions()}
                    name="cycleMode"
                    control={control}
                    labelName="存錢頻率"
                    inputProps={{disabled}}
                    $color={disabledColor}
                  />
                </div>
                <div className="w-50">
                  <DropdownField
                    options={generateCycleTimingOptions(cycleMode)}
                    name="cycleTiming"
                    control={control}
                    labelName="日期"
                    inputProps={{disabled}}
                    $color={disabledColor}
                    annotation={`共${cycleDuration * (cycleMode === 1 ? 4 : 1)}次`}
                  />
                </div>
              </div>
              <div>
                <CurrencyInputField
                  name="amount"
                  control={control}
                  labelName="預計每期存錢金額"
                  inputProps={{inputMode: 'numeric'}}
                  annotation={(amount > 0) && `存款目標為 ＄${toCurrency(getGoalAmount(amount, cycleDuration, cycleMode))}元`}
                />
              </div>

              <div className="amount-limit">{`金額最低＄${toCurrency(program.amountRange.month.min)} 元，最高＄${toCurrency(program.amountRange.month.max)} 元，以萬元為單位`}</div>

              <div>
                <DropdownField
                  options={generatebindAccountNoOptions(subAccounts, hasReachedMaxSubAccounts)}
                  name="bindAccountNo"
                  control={control}
                  labelName="選擇陪你存錢的帳號"
                  annotation={((bindAccountNo !== '*') && (bindAccountNo !== 'new') && !!bindAccountNo) && `存款餘額為 ${toCurrency(getRemainingBalance(bindAccountNo))}元`}
                />
              </div>

              <FEIBButton type="submit">確認</FEIBButton>
            </div>
          </form>
        </EditPageWrapper>
      </MainScrollWrapper>
    </Layout>
  );
};

export default DepositPlanEditPage;
