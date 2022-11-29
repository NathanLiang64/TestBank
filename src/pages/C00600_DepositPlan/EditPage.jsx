import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Theme from 'themes/theme';
import Layout from 'components/Layout/Layout';
import { MainScrollWrapper } from 'components/Layout';
import { FEIBButton, FEIBErrorMessage } from 'components/elements';
import { DropdownField, TextInputField } from 'components/Fields';
import {
  toCurrency,
  dateToYMD,
  dateToString,
} from 'utilities/Generator';

import { AlertProgramNoFound } from './utils/prompts';
import { getDurationTuple} from './utils/common';
import {
  generatebindAccountNoOptions,
  generateCycleModeOptions,
  generateCycleTimingOptions, generateMonthOptions,
} from './utils/options';
import HeroWithEdit from './components/HeroWithEdit';
import EditPageWrapper from './EditPage.style';
import { generateEditSchema } from './validationSchema';

/**
 * C00600 存錢計畫 (新增) 編輯頁
 */
const DepositPlanEditPage = () => {
  const history = useHistory();
  const location = useLocation();
  const [newImageId, setNewImageId] = useState();
  const {
    control, handleSubmit, watch, reset,
  } = useForm({
    defaultValues: {
      name: '',
      cycleDuration: 4,
      cycleMode: 2,
      cycleTiming: '',
      amount: '',
      bindAccountNo: '',
    },
    resolver: yupResolver(generateEditSchema(location.state?.program)),
  });
  const {
    cycleDuration, cycleMode, amount, bindAccountNo,
  } = watch();

  const getDefaultCycleTiming = () => {
    const date = new Date().getDate();
    return date < 28 ? date : 28;
  };

  const getGoalAmount = (cycleAmount, cycle, mode) => {
    const duration = mode === 1 ? 4 : 1;
    return parseInt(cycleAmount, 10) * cycle * duration;
  };

  const getRemainingBalance = (accountNo) => location.state?.subAccounts?.find((a) => a.accountNo === accountNo)?.balance ?? 0;
  const getInputColor = (type) => (type ? Theme.colors.text.lightGray : Theme.colors.primary.brand);

  const onSubmit = (data) => {
    const date = getDurationTuple(new Date(), data.cycleDuration, data.cycleMode, data.cycleTiming);
    const {code, rate} = location.state.program;

    const payload = {
      // createDepositPlan API Param
      progCode: code,
      imageId: newImageId ?? 1, // TODO 應改為提醒使用者尚未選取圖片。
      name: data.name,
      startDate: dateToYMD(date.begin),
      endDate: dateToYMD(date.end),
      cycleMode: data.cycleMode,
      cycleTiming: data.cycleTiming,
      amount: data.amount,
      bindAccountNo: data.bindAccountNo === 'new' ? null : data.bindAccountNo,
      currentBalance: getRemainingBalance(data.bindAccountNo),
      // 渲染需求
      goalAmount: getGoalAmount(data.amount, data.cycleDuration, data.cycleMode),
      extra: {
        rate,
        period: `${dateToString(new Date())} ~ ${dateToString(date.end)}`,
        nextDeductionDate: dateToString(date.next),
      },
    };
    sessionStorage.setItem('C006003', JSON.stringify(data));
    history.push('/C006004', { isConfirmMode: true, payload });
  };

  useEffect(() => {
    if (!location.state || !('program' in location.state)) {
      AlertProgramNoFound({
        onOk: () => history.push('/C006002'),
        onCancel: () => history.goBack(),
        onClose: () => history.goBack(),
      });
    } else if (location.state.program.type) {
      reset({
        name: location.state.program.name,
        // TODO: location.state.program 應該包含 cycleDuration
        cycleDuration: 4,
        cycleMode: 2,
        cycleTiming: getDefaultCycleTiming(),
      });
    }

    // 當跳回此頁面時，填入先前的資訊
    let backlog = sessionStorage.getItem('C006003');
    if (backlog) {
      backlog = JSON.parse(backlog);
      setNewImageId(backlog.imageId);
      reset({...backlog});
    }
  }, []);

  if (!location.state || !('program' in location.state)) {
    return <Layout title="新增存錢計畫" hasClearHeader goBackFunc={() => history.goBack()} />;
  }

  const {program, subAccounts, hasReachedMaxSubAccounts} = location.state;

  return (
    <Layout title="新增存錢計畫" hasClearHeader goBackFunc={() => history.goBack()}>
      <MainScrollWrapper>
        <EditPageWrapper>
          <form onSubmit={handleSubmit(onSubmit)}>
            <HeroWithEdit onChange={(id) => setNewImageId(id)} />

            <div className="flex">
              <div>
                <TextInputField
                  name="name"
                  control={control}
                  labelName="為你的計畫命名吧"
                  placeholder="請輸入7個以內的中英文字、數字或符號"
                  disabled={!!program.type}
                  $color={getInputColor(program.type)}
                />
              </div>
              <div>
                <DropdownField
                  options={generateMonthOptions()}
                  name="cycleDuration"
                  control={control}
                  labelName="預計存錢區間"
                  disabled={!!program.type}
                  $color={getInputColor(!!program.type)}
                />
              </div>
              <div className="col-2">
                <div className="w-50">
                  <DropdownField
                    options={generateCycleModeOptions()}
                    name="cycleMode"
                    control={control}
                    labelName="存錢頻率"
                    disabled={!!program.type}
                    $color={getInputColor(!!program.type)}
                  />
                </div>
                <div className="w-50">
                  <DropdownField
                    options={generateCycleTimingOptions(cycleMode)}
                    name="cycleTiming"
                    control={control}
                    labelName="週期"
                    disabled={!!program.type}
                    $color={getInputColor(!!program.type)}
                  />
                  <FEIBErrorMessage $color={Theme.colors.text.lightGray}>
                    共
                    {cycleDuration * (cycleMode === 1 ? 4 : 1)}
                    次
                  </FEIBErrorMessage>
                </div>
              </div>
              <div>
                <TextInputField
                  name="amount"
                  control={control}
                  labelName="預計每期存錢金額"
                  type="number"
                />
                <FEIBErrorMessage $color={Theme.colors.text.lightGray}>
                  {(amount > 0) && `存款目標為 ${toCurrency(getGoalAmount(amount, cycleDuration, cycleMode))}元`}
                </FEIBErrorMessage>
                <div>{`金額最低＄${toCurrency(program.amountRange.month.min)} 元，最高＄${toCurrency(program.amountRange.month.max)} 元，以萬元為單位`}</div>
              </div>

              <div>
                <DropdownField
                  options={generatebindAccountNoOptions(subAccounts, hasReachedMaxSubAccounts)}
                  name="bindAccountNo"
                  control={control}
                  labelName="選擇陪你存錢的帳號"
                />
                <FEIBErrorMessage $color={Theme.colors.text.lightGray}>
                  { ((bindAccountNo !== '*') && (bindAccountNo !== 'new')) && `存款餘額為${getRemainingBalance(bindAccountNo)}元` }
                </FEIBErrorMessage>
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
