import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';

import { Controller, useForm } from 'react-hook-form';
import uuid from 'react-uuid';

import Layout from 'components/Layout/Layout';
import Main from 'components/Layout';
import {
  FEIBButton, FEIBInputLabel, FEIBInput, FEIBSelect, FEIBOption, FEIBErrorMessage,
} from 'components/elements';
import Theme from 'themes/theme';
import {
  toCurrency, weekNumberToChinese,
} from 'utilities/Generator';

import { AlertProgramNoFound } from './utils/prompts';
import EditPageWrapper from './EditPage.style';

/**
 * C00600 存錢計畫 編輯頁
 */
const DepositPlanEditPage = () => {
  const history = useHistory();
  const location = useLocation();
  const {
    control, register, handleSubmit, watch, setValue, formState: { errors },
  } = useForm();
  const uid = Array.from({ length: 7}, () => uuid());
  const [program, setProgram] = useState();
  const [isRestrictedPromotion, setIsRestrictedPromotion] = useState(false);
  const [isRestrictedEdit, setIsRestrictedEdit] = useState(false);

  useEffect(() => {
    if (!location?.state) return;

    if (!('program' in location.state)) {
      AlertProgramNoFound({
        onOk: () => history.push('/C006002'),
        onCancel: () => history.goBack(),
      });
    }
    setProgram(location.state.program);

    if (location.state.program.code > 0) setIsRestrictedPromotion(true);
    if ('isRestrictedPromotion' in location.state) setIsRestrictedPromotion(location.state.isRestrictedPromotion);
    if ('isRestrictedEdit' in location.state) setIsRestrictedEdit(location.state.isRestrictedEdit);

    if (location.state.program.code > 0 || isRestrictedPromotion) {
      setValue('name', location.state.program.name, { shouldValidate: false });
    }

    // TODO
    console.log('EditPage', program, isRestrictedPromotion, isRestrictedEdit);
  }, []);

  // TODO
  const onSubmit = (data) => console.log(data);

  const getDuration = () => {
    const begin = '2022-01-01';
    const end = '2022-12-31';
    return `${begin} ~ ${end}`;
  };

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

  return (
    <Layout title="編輯存錢計畫" goBackFunc={() => history.goBack()}>
      <Main>
        <EditPageWrapper>
          <form className="flex" onSubmit={handleSubmit(onSubmit)}>

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
                    $color={errors?.name ? Theme.colors.state.danger : undefined}
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
              { isRestrictedEdit ? (
                <FEIBInput id={uid[2]} value={getDuration()} disabled />
              ) : (
                <Controller
                  name="cycleDuration"
                  control={control}
                  defaultValue={3}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <FEIBSelect id={uid[2]} {...field}>
                      { Array.from({length: 22}, (_, i) => i + 3).map((v) => (
                        <FEIBOption key={uuid()} value={v}>
                          {v}
                          個月
                        </FEIBOption>
                      ))}
                    </FEIBSelect>
                  )}
                />
              )}
              <FEIBErrorMessage />
            </div>

            <div className="col-2">
              <div className="w-50">
                <FEIBInputLabel htmlFor={uid[3]}>存錢頻率</FEIBInputLabel>
                <Controller
                  name="cycleMode"
                  control={control}
                  defaultValue={2}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <FEIBSelect id={uid[3]} disabled={true || isRestrictedPromotion || isRestrictedEdit} {...field}>
                      <FEIBOption value={1}>每週</FEIBOption>
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
                    <FEIBSelect id={uid[4]} disabled={isRestrictedEdit || isRestrictedPromotion} {...field}>
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
              <FEIBInput
                id={uid[5]}
                type="number"
                error={!!(errors?.amount)}
                $color={errors?.amount ? Theme.colors.state.danger : undefined}
                disabled={isRestrictedEdit}
                {...register('amount', { min: 10000, max: 90000000 })}
              />
              <FEIBErrorMessage $color={Theme.colors.text.lightGray}>
                {`存款目標為 ${toCurrency(getGoalAmount(watch('amount', 0), watch('cycleDuration', 3), watch('cycleMode', 2)))} 元`}
              </FEIBErrorMessage>
              <div>金額最低＄10,000 元，最高＄90,000,000 元，以萬元為單位</div>
            </div>

            <div>
              <FEIBInputLabel htmlFor={uid[6]}>選擇陪你存錢的帳號</FEIBInputLabel>
              { isRestrictedEdit ? (
                <FEIBInput id={uid[6]} value={program.bindAccountNo} disabled />
              ) : (
                <Controller
                  name="bindAccountNo"
                  control={control}
                  placeholder="請選擇子帳號且不能修改"
                  defaultValue=""
                  rules={{ required: true }}
                  render={({ field }) => (
                    <FEIBSelect id={uid[6]} {...field}>
                      <FEIBOption value="01400099990000">00011122223333</FEIBOption>
                      <FEIBOption value="">新增</FEIBOption>
                    </FEIBSelect>
                  )}
                />
              )}
              <FEIBErrorMessage />
            </div>

            <FEIBButton type="submit">確認</FEIBButton>
          </form>
        </EditPageWrapper>
      </Main>
    </Layout>
  );
};

export default DepositPlanEditPage;
