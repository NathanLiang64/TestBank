/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useForm } from 'react-hook-form';

import Layout from 'components/Layout/Layout';
import { MainScrollWrapper } from 'components/Layout';
import { FEIBButton, FEIBErrorMessage } from 'components/elements';
import Theme from 'themes/theme';
import {
  toCurrency,
  stringDateCodeFormatter,
  dateFormatter,
} from 'utilities/Generator';

import { DropdownField, TextInputField } from 'components/Fields';
import { yupResolver } from '@hookform/resolvers/yup';
import { AlertProgramNoFound } from './utils/prompts';
import {
  generatebindAccountNoOptions,
  generateCycleModeOptions,
  generateCycleTimingOptions, generateMonthOptions, getDurationTuple,
} from './utils/common';
import HeroWithEdit from './components/HeroWithEdit';
import EditPageWrapper from './EditPage.style';
import { generateValidationSchema } from './validationSchema';

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
      cycleDuration: 3,
      cycleMode: 2,
      cycleTiming: '',
      amount: 0,
      bindAccountNo: '',
    },
    resolver: yupResolver(generateValidationSchema(location.state?.program.amountRange.month.max)),
  });
  const [watchedDuration, watchedMode, watchedAmount, watchedAccount] = watch(['cycleDuration', 'cycleMode', 'amount', 'bindAccountNo']);

  // const [hasReachedMaxSubAccounts, setHasReachedMaxSubAccounts] = useState(false);
  const getDefaultCycleTiming = (mode) => {
    if (mode === 1) return new Date().getDay();
    const date = new Date().getDate();
    return (date < 28) ? date : 28;
  };

  const getGoalAmount = (amount, cycle, mode) => {
    const duration = mode === 1 ? 4 : 1;
    const gm = amount * cycle * duration;
    if (Number.isNaN(gm)) return 0;
    return gm;
  };

  const getRemainingBalance = (accountNo) => location.state?.subAccounts?.find((a) => a.accountNo === accountNo)?.balance ?? 0;

  const onSubmit = (data) => {
    const date = getDurationTuple(new Date(), data.cycleDuration, data.cycleMode, data.cycleTiming);
    const {code, rate} = location.state.program;
    const payload = {
      progCode: code,
      imageId: newImageId ?? 1,
      name: data.name,
      startDate: stringDateCodeFormatter(date.begin),
      endDate: stringDateCodeFormatter(date.end),
      cycleMode: data.cycleMode,
      cycleTiming: data.cycleTiming,
      amount: data.amount,
      bindAccountNo: data.bindAccountNo === 'new' ? null : data.bindAccountNo,
      currentBalance: getRemainingBalance(data.bindAccountNo),
      goalAmount: getGoalAmount(data.amount, data.cycleDuration, data.cycleMode),
      extra: {
        rate,
        period: `${dateFormatter(new Date(), true)} ~ ${dateFormatter(date.end, true)}`,
        nextDeductionDate: dateFormatter(date.next, true),
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
        cycleDuration: location.state.program?.cycleDuration ?? 4,
        cycleMode: location.state.program?.cycleMode ?? 2,
        cycleTiming: getDefaultCycleTiming(location.state.program?.cycleMode),
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

  // const renderSubAccountOptions = () => {
  //   let options = [];
  //   if (subAccounts) options = options.concat(subAccounts);
  //   if (!hasReachedMaxSubAccounts) options.push({ accountNo: 'new', balance: 0 });
  //   if (options.length === 0) return <FEIBOption value="*">無未綁定的子帳戶或已達8個子帳戶上限</FEIBOption>;
  //   return options.map((a) => (
  //     <FEIBOption key={uuid()} value={a.accountNo}>
  //       {a.accountNo === 'new' ? '加開子帳戶' : accountFormatter(a.accountNo)}
  //     </FEIBOption>
  //   ));
  // };

  const getInputColor = () => {
    if (location.state?.program.type) return Theme.colors.text.lightGray;
    return Theme.colors.primary.brand;
  };

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
                  disabled={!!location.state?.program.type}
                  $color={getInputColor()}
                />
              </div>
              <div>
                <DropdownField
                  options={generateMonthOptions()}
                  name="cycleDuration"
                  control={control}
                  labelName="預計存錢區間"
                />
              </div>
              <div className="col-2">
                <div className="w-50">
                  <DropdownField
                    options={generateCycleModeOptions()}
                    name="cycleMode"
                    control={control}
                    labelName="存錢頻率"
                  />
                </div>
                <div className="w-50">
                  <DropdownField
                    options={generateCycleTimingOptions(2)}
                    name="cycleTiming"
                    control={control}
                    labelName="週期"
                    shouldDisabled={!!location.state?.program.type}
                    $color={getInputColor()}
                  />
                  <FEIBErrorMessage $color={Theme.colors.text.lightGray}>
                    共
                    {watchedDuration * (watchedMode === 1 ? 4 : 1)}
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
                  {(watchedAmount > 0) && `存款目標為 ${toCurrency(getGoalAmount(watchedAmount, watchedDuration, watchedMode))}元`}
                </FEIBErrorMessage>
                <div>金額最低＄10,000 元，最高＄90,000,000 元，以萬元為單位</div>
              </div>

              <div>
                {/* TODO: 加開子帳戶選項，若沒有子帳戶，應出現新增加開子帳戶的選項 */}
                <DropdownField
                  options={generatebindAccountNoOptions(location.state?.subAccounts || [], location.state?.hasReachedMaxSubAccounts)}
                  name="bindAccountNo"
                  control={control}
                  labelName="選擇陪你存錢的帳號"
                />

                <FEIBErrorMessage $color={Theme.colors.text.lightGray}>
                  { ((watchedAccount !== '*') && (watchedAccount !== 'new')) && `存款餘額為${getRemainingBalance(watchedAccount)}元` }
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
