import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';

import { Controller, useForm } from 'react-hook-form';
import uuid from 'react-uuid';

import Layout from 'components/Layout/Layout';
import { MainScrollWrapper } from 'components/Layout';
import {
  FEIBButton, FEIBInputLabel, FEIBInput, FEIBSelect, FEIBOption, FEIBErrorMessage,
} from 'components/elements';
import Theme from 'themes/theme';
import {
  toCurrency,
  accountFormatter,
  stringDateCodeFormatter,
  weekNumberToChinese,
  dateFormatter,
} from 'utilities/Generator';

import { AlertProgramNoFound } from './utils/prompts';
import { getDurationTuple } from './utils/common';
import HeroWithEdit from './components/HeroWithEdit';
import EditPageWrapper from './EditPage.style';

/**
 * C00600 存錢計畫 (新增) 編輯頁
 */
const DepositPlanEditPage = () => {
  const history = useHistory();
  const location = useLocation();
  const {
    control, handleSubmit, watch, setValue, formState: { errors },
  } = useForm();

  const uid = Array.from({ length: 7}, () => uuid());
  const [program, setProgram] = useState();
  const [isRestrictedPromotion, setIsRestrictedPromotion] = useState(false);
  const [subAccounts, setSubAccounts] = useState();
  const [hasReachedMaxSubAccounts, setHasReachedMaxSubAccounts] = useState(false);
  const [newImageId, setNewImageId] = useState();

  useEffect(() => {
    if (location.state && ('program' in location.state)) {
      setProgram(location.state.program);
      setSubAccounts(location.state.subAccounts);
      setHasReachedMaxSubAccounts(location.state.hasReachedMaxSubAccounts);

      if (location.state.program.type > 0) setIsRestrictedPromotion(true);
      if ('isRestrictedPromotion' in location.state) setIsRestrictedPromotion(location.state.isRestrictedPromotion);

      // useState is async, isRestrictedPromotion may be unavaliable.
      if (location.state.program.type > 0 || 'isRestrictedPromotion' in location.state) {
        setValue('name', location.state.program.name, { shouldValidate: false });
        setValue('cycleDuration', location.state.program?.cycleDuration ?? 4, { shouldValidate: false });
        setValue('cycleMode', location.state.program?.cycleMode ?? 2, { shouldValidate: false });
      }
    } else {
      // Guard: 此頁面接續上一頁的操作，意指若未在該情況下進入此頁為不正常操作。
      AlertProgramNoFound({
        onOk: () => history.push('/C006002'),
        onCancel: () => history.goBack(),
      });
    }

    // 當跳回此頁面時，填入先前的資訊
    let backlog = sessionStorage.getItem('C006003');
    if (backlog) {
      backlog = JSON.parse(backlog);
      setNewImageId(backlog.image);
      setValue('name', backlog.name);
      setValue('cycleDuration', backlog.cycleDuration);
      setValue('cycleMode', backlog.cycleMode);
      setValue('cycleTiming', backlog.cycleTiming);
      setValue('amount', backlog.amount);
      setValue('bindAccountNo', backlog.bindAccountNo);
    }
  }, []);

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

  const getRemainingBalance = (accountNo) => subAccounts?.find((a) => a.accountNo === accountNo)?.balance ?? 0;

  const onSubmit = (data) => {
    const date = getDurationTuple(new Date(), data.cycleDuration, data.cycleMode, data.cycleTiming);
    const payload = {
      progCode: program.code,
      image: newImageId ?? 1,
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
        rate: program.rate,
        period: `${dateFormatter(new Date(), true)} ~ ${dateFormatter(date.end, true)}`,
        nextDeductionDate: dateFormatter(date.next, true),
      },
    };
    sessionStorage.setItem('C006003', JSON.stringify(data));
    history.push('/C006004', { isConfirmMode: true, payload });
  };

  const renderSubAccountOptions = () => {
    let options = [];
    if (subAccounts) options = options.concat(subAccounts);
    if (!hasReachedMaxSubAccounts) options.push({ accountNo: 'new', balance: 0 });
    if (options.length === 0) return <FEIBOption value="*">無未綁定的子帳戶或已達8個子帳戶上限</FEIBOption>;
    return options.map((a) => (
      <FEIBOption key={uuid()} value={a.accountNo}>
        {a.accountNo === 'new' ? '加開子帳戶' : accountFormatter(a.accountNo)}
      </FEIBOption>
    ));
  };

  const getInputColor = (e) => {
    if (isRestrictedPromotion) return Theme.colors.text.lightGray;
    if (e?.name) return Theme.colors.state.danger;
    return Theme.colors.primary.brand;
  };

  return (
    <Layout title="新增存錢計畫" hasClearHeader goBackFunc={() => history.goBack()}>
      <MainScrollWrapper>
        <EditPageWrapper>
          <form onSubmit={handleSubmit(onSubmit)}>

            <HeroWithEdit
              onChange={(id) => setNewImageId(id)}
            />

            <div className="flex">

              <div>
                <FEIBInputLabel htmlFor={uid[1]}>為你的計畫命名吧</FEIBInputLabel>
                <Controller
                  name="name"
                  control={control}
                  defaultValue={isRestrictedPromotion ? program.name : ''}
                  rules={{ maxLength: 7, required: true }}
                  render={({ field }) => (
                    <FEIBInput
                      id={uid[1]}
                      error={!!(errors?.name)}
                      $color={() => getInputColor(errors)}
                      placeholder="請輸入7個以內的中英文字、數字或符號"
                      disabled={isRestrictedPromotion}
                      {...field}
                    />
                  )}
                />
                <FEIBErrorMessage>
                  {errors.name && <span>請輸入7個以內的中英文字、數字或符號</span>}
                </FEIBErrorMessage>
              </div>

              <div>
                <FEIBInputLabel htmlFor={uid[2]}>預計存錢區間</FEIBInputLabel>
                <Controller
                  name="cycleDuration"
                  control={control}
                  defaultValue={program?.cycleDuration ?? 3}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <FEIBSelect
                      id={uid[2]}
                      disabled={isRestrictedPromotion}
                      $color={isRestrictedPromotion ? Theme.colors.text.lightGray : Theme.colors.primary.brand}
                      $iconColor={isRestrictedPromotion ? Theme.colors.text.placeholder : Theme.colors.primary.brand}
                      {...field}
                    >
                      { Array.from({length: 22}, (_, i) => i + 3).map((v) => (
                        <FEIBOption key={uuid()} value={v}>
                          {v}
                          個月
                        </FEIBOption>
                      ))}
                    </FEIBSelect>
                  )}
                />
                <FEIBErrorMessage />
              </div>

              <div className="col-2">
                <div className="w-50">
                  <FEIBInputLabel htmlFor={uid[3]}>存錢頻率</FEIBInputLabel>
                  <Controller
                    name="cycleMode"
                    control={control}
                    defaultValue={program?.cycleMode ?? 2}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <FEIBSelect
                        id={uid[3]}
                        disabled={isRestrictedPromotion}
                        $color={isRestrictedPromotion ? Theme.colors.text.lightGray : Theme.colors.primary.brand}
                        $iconColor={isRestrictedPromotion ? Theme.colors.text.placeholder : Theme.colors.primary.brand}
                        {...field}
                      >
                        <FEIBOption value={1} disabled>每週</FEIBOption>
                        <FEIBOption value={2}>每月</FEIBOption>
                      </FEIBSelect>
                    )}
                  />
                  <FEIBErrorMessage />
                </div>

                <div className="w-50">
                  <FEIBInputLabel htmlFor={uid[4]}>週期</FEIBInputLabel>
                  <Controller
                    name="cycleTiming"
                    control={control}
                    defaultValue={getDefaultCycleTiming(watch('cycleMode', 2))}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <FEIBSelect id={uid[4]} disabled={isRestrictedPromotion} {...field}>
                        { watch('cycleMode', 2) === 1
                          ? Array.from({length: 7}, (_, i) => i).map((v) => (
                            <FEIBOption key={uuid()} value={v}>{`周${weekNumberToChinese(v === 0 ? 7 : v)}`}</FEIBOption>
                          ))
                          : Array.from({length: 28}, (_, i) => i + 1).map((v) => (
                            <FEIBOption key={uuid()} value={v}>{`${v}號`}</FEIBOption>
                          ))}
                      </FEIBSelect>
                    )}
                  />
                  <FEIBErrorMessage $color={Theme.colors.text.lightGray}>
                    共
                    {watch('cycleDuration', 3) * (watch('cycleMode', 2) === 1 ? 4 : 1)}
                    次
                  </FEIBErrorMessage>
                </div>
              </div>

              <div>
                <FEIBInputLabel htmlFor={uid[5]}>預計每期存錢金額</FEIBInputLabel>
                <Controller
                  name="amount"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: true,
                    validate: (v) => {
                      const amountRange = program.amountRange[watch('cycleMode', 2) === 1 ? 'week' : 'month'];
                      return (v >= amountRange?.min ?? 10_000) && (v <= amountRange?.max ?? 9_000_000);
                    },
                  }}
                  render={({ field }) => (
                    <FEIBInput
                      id={uid[5]}
                      type="number"
                      error={!!(errors?.amount)}
                      $color={errors?.amount ? Theme.colors.state.danger : undefined}
                      {...field}
                    />
                  )}
                />
                <FEIBErrorMessage $color={Theme.colors.text.lightGray}>
                  {(watch('amount', 0) > 0) && `存款目標為 ${toCurrency(getGoalAmount(watch('amount', 0), watch('cycleDuration', 3), watch('cycleMode', 2)))}元`}
                </FEIBErrorMessage>
                <div>金額最低＄10,000 元，最高＄90,000,000 元，以萬元為單位</div>
              </div>

              <div>
                <FEIBInputLabel htmlFor={uid[6]}>選擇陪你存錢的帳號</FEIBInputLabel>
                <Controller
                  name="bindAccountNo"
                  control={control}
                  defaultValue="*"
                  rules={{ required: true, validate: (i) => i !== '*' }}
                  render={({ field }) => (
                    <FEIBSelect
                      id={uid[6]}
                      error={!!(errors?.bindAccountNo)}
                      $color={watch('bindAccountNo') === '*' ? Theme.colors.text.placeholder : undefined}
                      {...field}
                    >
                      <FEIBOption value="*" disabled>請選擇子帳號且不能修改</FEIBOption>
                      { renderSubAccountOptions() }
                    </FEIBSelect>
                  )}
                />
                <FEIBErrorMessage $color={Theme.colors.text.lightGray}>
                  { ((watch('bindAccountNo') !== '*') && (watch('bindAccountNo') !== 'new')) && `存款餘額為${getRemainingBalance(watch('bindAccountNo'))}元` }
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
