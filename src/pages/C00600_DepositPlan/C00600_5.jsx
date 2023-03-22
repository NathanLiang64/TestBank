/* eslint-disable object-curly-newline */
import { useHistory } from 'react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Layout from 'components/Layout/Layout';
import { MainScrollWrapper } from 'components/Layout';
import { FEIBButton} from 'components/elements';
import { DropdownField, TextInputField } from 'components/Fields';
import { toCurrency, accountFormatter, dateToString } from 'utilities/Generator';

import HeroWithEdit from './components/HeroWithEdit';
import { EditPageWrapper } from './C00600.style';
import { AlertUpdateFail } from './utils/prompts';
import { generateCycleModeOptions, generateCycleTimingOptions } from './utils/options';
import { updateDepositPlan } from './api';
import { generateRestirctedEditSchema } from './validationSchema';

/**
 * C00600 存錢計畫 (已建立) 編輯頁
 */
const DepositPlanEditPage = (props) => {
  const history = useHistory();
  const {location: {state}} = props;

  // Guard
  if (!state) {
    history.goBack();
    return null;
  }
  const {viewModel, plan } = state;

  const getDuration = (startDate, endDate) => {
    const begin = dateToString(startDate);
    const end = dateToString(endDate);
    return `${begin} ~ ${end}`;
  };

  const { control, handleSubmit, setValue, watch } = useForm(
    {
      defaultValues: {
        planId: plan.planId,
        imageId: plan.imageId,
        name: plan.name,
        cycleMode: plan.cycleMode,
        cycleTiming: plan.cycleTiming,
        cycleDuration: getDuration(plan.startDate, plan.endDate),
        amount: `＄${toCurrency(plan.amount)}`,
        bindAccountNo: accountFormatter(plan.bindAccountNo, true),
      },
      resolver: yupResolver(generateRestirctedEditSchema(plan)),
    },
  );

  const onSubmit = async ({planId, name, imageId}) => {
    const image = imageId > 0 ? imageId : sessionStorage.getItem('C00600-hero');
    const payload = { planId, name, image };

    const {isSuccess} = await updateDepositPlan(payload);
    if (isSuccess) {
      // cache 的資料也要一起變更
      const {depositPlans: {plans}} = viewModel;
      const updatedIndex = plans.findIndex((p) => plan.planId === p.planId);
      plans[updatedIndex] = {...plans[updatedIndex], name, imageId};
      history.push('/C00600', {viewModel});
      sessionStorage.removeItem('C00600-hero'); // 清除暫存背景圖。
    } else AlertUpdateFail();
  };

  return (
    <Layout title="編輯存錢計畫" hasClearHeader goBackFunc={() => history.replace('C00600', {viewModel})}>
      <MainScrollWrapper>
        <EditPageWrapper>
          <form onSubmit={handleSubmit(onSubmit)}>

            <HeroWithEdit
              planId={watch('planId')}
              imageId={watch('imageId')}
              onChange={(id) => setValue('imageId', id)}
            />

            <div className="flex">

              <div>
                <TextInputField
                  name="name"
                  control={control}
                  labelName="計畫名稱"
                  inputProps={{ maxLength: 7, placeholder: '請輸入7個以內的中英文字、數字或符號', disabled: plan.progInfo.type !== 0 }}
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
