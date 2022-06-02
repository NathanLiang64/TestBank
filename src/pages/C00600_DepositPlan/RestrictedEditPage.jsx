import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';

import { Controller, useForm } from 'react-hook-form';
import uuid from 'react-uuid';

import Layout from 'components/Layout/Layout';
import { MainScrollWrapper } from 'components/Layout';
import {
  FEIBButton, FEIBInputLabel, FEIBInput, FEIBErrorMessage,
} from 'components/elements';
import Theme from 'themes/theme';
import {
  toCurrency, accountFormatter, dateFormatter, stringToDate,
} from 'utilities/Generator';

import { AlertInvalidEntry, AlertUpdateFail } from './utils/prompts';
import { updateDepositPlan } from './api';
import HeroWithEdit from './components/HeroWithEdit';
import EditPageWrapper from './EditPage.style';

/**
 * C00600 存錢計畫 (已建立) 編輯頁
 */
const DepositPlanEditPage = () => {
  const history = useHistory();
  const location = useLocation();
  const {
    control, handleSubmit, setValue, formState: { errors },
  } = useForm();
  const uid = Array.from({ length: 7}, () => uuid());
  const [plan, setPlan] = useState();
  const [newImageId, setNewImageId] = useState();
  const [isRestrictedPromotion, setIsRestrictedPromotion] = useState(false);

  useEffect(() => {
    if (location.state && ('plan' in location.state)) {
      setPlan(location.state.plan);
      setIsRestrictedPromotion(location.state.plan.type > 0);
      if ('isRestrictedPromotion' in location.state) setIsRestrictedPromotion(location.state.isRestrictedPromotion);

      setValue('name', location.state.plan.name, { shouldValidate: false });
    } else {
      AlertInvalidEntry({ onBack: () => history.goBack() });
    }
  }, []);

  const getDuration = () => {
    const begin = dateFormatter(stringToDate(plan.startDate), true);
    const end = dateFormatter(stringToDate(plan.endDate), true);
    return `${begin} ~ ${end}`;
  };

  const onSubmit = async (data) => {
    const payload = {
      planId: plan.planId,
      name: data.name !== plan.name ? data.name : null,
      image: newImageId > 0 ? newImageId : sessionStorage.getItem('C00600-hero'),
      authorizedKey: plan.planId, // TODO
    };

    const response = await updateDepositPlan(payload);

    if (response.result) history.push('/C00600');
    else AlertUpdateFail();
    sessionStorage.removeItem('C00600-hero');
  };

  return (
    <Layout title="編輯存錢計畫" hasClearHeader goBackFunc={() => history.goBack()}>
      <MainScrollWrapper>
        <EditPageWrapper>
          <form onSubmit={handleSubmit(onSubmit)}>

            <HeroWithEdit
              planId={plan?.planId}
              imageId={plan?.imageId}
              onChange={(id) => setNewImageId(id)}
            />

            <div className="flex">

              <div>
                <FEIBInputLabel htmlFor={uid[1]}>為你的計畫命名吧</FEIBInputLabel>
                <Controller
                  name="name"
                  control={control}
                  defaultValue={isRestrictedPromotion ? plan.name : ''}
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
                <FEIBInput id={uid[2]} value={plan ? getDuration() : ''} disabled />
                <FEIBErrorMessage />
              </div>

              <div className="col-2">
                <div className="w-50">
                  <FEIBInputLabel htmlFor={uid[3]}>存錢頻率</FEIBInputLabel>
                  <FEIBInput id={uid[3]} value={plan?.cycleMode === 1 ? '每週' : '每月'} disabled />
                  <FEIBErrorMessage />
                </div>

                <div className="w-50">
                  <FEIBInputLabel htmlFor={uid[4]}>週期</FEIBInputLabel>
                  <FEIBInput id={uid[4]} value={`${plan?.cycleTiming}日`} disabled />
                  <FEIBErrorMessage />
                </div>
              </div>

              <div>
                <FEIBInputLabel htmlFor={uid[5]}>預計每期存錢金額</FEIBInputLabel>
                <FEIBInput id={uid[5]} value={toCurrency(plan?.goalAmount ?? 0)} disabled />
                <FEIBErrorMessage />
              </div>

              <div>
                <FEIBInputLabel htmlFor={uid[6]}>選擇陪你存錢的帳號</FEIBInputLabel>
                <FEIBInput id={uid[6]} value={accountFormatter(plan?.bindAccountNo)} disabled />
                <FEIBErrorMessage />
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
