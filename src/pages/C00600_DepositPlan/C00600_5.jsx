import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Layout from 'components/Layout/Layout';
import { MainScrollWrapper } from 'components/Layout';
import { FEIBButton} from 'components/elements';
import { DropdownField, TextInputField } from 'components/Fields';
import { toCurrency, accountFormatter, dateToString } from 'utilities/Generator';

import { useNavigation } from 'hooks/useNavigation';
import HeroWithEdit from './components/HeroWithEdit';
import { EditPageWrapper } from './C00600.style';
import { AlertInvalidEntry, AlertUpdateFail } from './utils/prompts';
import { generateCycleModeOptions, generateCycleTimingOptions } from './utils/options';
import { updateDepositPlan } from './api';
import { generateRestirctedEditSchema } from './validationSchema';

/**
 * C00600 存錢計畫 (已建立) 編輯頁
 */
const DepositPlanEditPage = () => {
  const history = useHistory();
  const { goHome } = useNavigation();
  const {state} = useLocation();
  const {control, handleSubmit, reset } = useForm(
    {
      defaultValues: {
        name: '',
        cycleDuration: '',
        cycleMode: '',
        cycleTiming: '',
        amount: '',
        bindAccountNo: '',
      },
      resolver: yupResolver(generateRestirctedEditSchema(state?.plan)),
    },
  );

  const [plan, setPlan] = useState();

  const getDuration = (startDate, endDate) => {
    const begin = dateToString(startDate);
    const end = dateToString(endDate);
    return `${begin} ~ ${end}`;
  };

  useEffect(() => {
    if (state && ('plan' in state)) {
      setPlan(state.plan);

      // 重置表單各欄位 value
      reset({
        name: state.plan.name,
        cycleDuration: getDuration(state.plan.startDate, state.plan.endDate),
        cycleMode: state.plan.cycleMode,
        cycleTiming: state.plan.cycleTiming,
        amount: `＄${toCurrency(state.plan.amount)}`,
        bindAccountNo: accountFormatter(state.plan.bindAccountNo, true),
      });
    } else {
      // Guard: 此頁面接續上一頁的操作，意指若未在該情況下進入此頁為不正常操作。
      AlertInvalidEntry({ goBack: () => history.goBack(), goHome });
    }
  }, []);

  const onSubmit = async (data) => {
    const payload = {
      planId: plan.planId,
      name: data.name,
      image: plan.imageId > 0 ? plan.imageId : sessionStorage.getItem('C00600-hero'),
    };
    const {isSuccess} = await updateDepositPlan(payload);
    if (isSuccess) {
      // cache 的資料也要一起變更
      const {depositPlans: {plans}} = state;
      const updatedIndex = plans.findIndex(({planId}) => plan.planId === planId);
      plans[updatedIndex].name = data.name;
      plans[updatedIndex].imageId = plan.imageId;

      history.push('/C00600', state);
    } else AlertUpdateFail();
    sessionStorage.removeItem('C00600-hero'); // 清除暫存背景圖。
  };

  return (
    <Layout title="編輯存錢計畫" hasClearHeader goBackFunc={() => history.replace('C00600', state)}>
      <MainScrollWrapper>
        <EditPageWrapper>
          <form onSubmit={handleSubmit(onSubmit)}>

            <HeroWithEdit
              planId={plan?.planId}
              imageId={plan?.imageId}
              onChange={(id) => setPlan((prevPlan) => ({...prevPlan, imageId: id}))}
            />

            <div className="flex">

              <div>
                <TextInputField
                  name="name"
                  control={control}
                  labelName="計畫名稱"
                  inputProps={{ maxLength: 7, placeholder: '請輸入7個以內的中英文字、數字或符號', disabled: state.plan.progInfo.type !== 0 }}
                />
              </div>

              <div>
                <TextInputField
                  name="cycleDuration"
                  control={control}
                  labelName="預計存錢區間"
                  inputProps={{disabled: true}}
                />
              </div>

              <div className="col-2">
                <div className="w-50">
                  <DropdownField
                    options={generateCycleModeOptions()}
                    name="cycleMode"
                    control={control}
                    labelName="存錢頻率"
                    inputProps={{disabled: true}}
                  />
                </div>

                <div className="w-50">
                  <DropdownField
                    options={generateCycleTimingOptions(2)}
                    name="cycleTiming"
                    control={control}
                    labelName="日期"
                    inputProps={{disabled: true}}
                  />
                </div>
              </div>

              <div>
                <TextInputField
                  name="amount"
                  control={control}
                  labelName="預計每期存錢金額"
                  inputProps={{disabled: true}}
                />
              </div>

              <div>
                <TextInputField
                  name="bindAccountNo"
                  control={control}
                  labelName="選擇陪你存錢的帳號"
                  inputProps={{disabled: true}}
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
