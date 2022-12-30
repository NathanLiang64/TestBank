import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Theme from 'themes/theme';
import Layout from 'components/Layout/Layout';
import { MainScrollWrapper } from 'components/Layout';
import { FEIBButton} from 'components/elements';
import { DropdownField, TextInputField } from 'components/Fields';
import {
  toCurrency, accountFormatter, dateToString,
} from 'utilities/Generator';

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
  const location = useLocation();
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
      resolver: yupResolver(generateRestirctedEditSchema(location.state?.plan)),
    },
  );

  const [plan, setPlan] = useState();
  const [newImageId, setNewImageId] = useState();
  const [isRestrictedPromotion, setIsRestrictedPromotion] = useState(false);

  const getDuration = (startDate, endDate) => {
    const begin = dateToString(startDate);
    const end = dateToString(endDate);
    return `${begin} ~ ${end}`;
  };

  useEffect(() => {
    if (location.state && ('plan' in location.state)) {
      setPlan(location.state.plan);
      setIsRestrictedPromotion(location.state.plan.progInfo.type !== 0);

      // 重置表單各欄位 value
      reset({
        name: location.state.plan.name,
        cycleDuration: getDuration(location.state.plan.startDate, location.state.plan.endDate),
        cycleMode: location.state.plan.cycleMode,
        cycleTiming: location.state.plan.cycleTiming,
        amount: `＄${toCurrency(location.state.plan.amount)}`,
        bindAccountNo: accountFormatter(location.state.plan.bindAccountNo),
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
      image: newImageId > 0 ? newImageId : sessionStorage.getItem('C00600-hero'),
    };
    // TODO: updateDepositPlan API 尚無法處理帶有 base64 的 image (會回傳錯誤訊息)，僅能先以預設圖片進行測試
    const response = await updateDepositPlan(payload);
    if (response.result) history.push('/C00600');
    else AlertUpdateFail();
    sessionStorage.removeItem('C00600-hero'); // 清除暫存背景圖。
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
                <TextInputField
                  name="name"
                  control={control}
                  labelName="為你的計畫命名吧"
                  inputProps={{ maxLength: 7, placeholder: '請輸入7個以內的中英文字、數字或符號', disabled: isRestrictedPromotion }}
                  $color={isRestrictedPromotion ? Theme.colors.text.lightGray : Theme.colors.primary.brand}
                />
              </div>

              <div>
                <TextInputField
                  name="cycleDuration"
                  control={control}
                  labelName="預計存錢區間"
                  $color={Theme.colors.text.lightGray}
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
                    $color={Theme.colors.text.lightGray}
                  />
                </div>

                <div className="w-50">
                  <DropdownField
                    options={generateCycleTimingOptions(2)}
                    name="cycleTiming"
                    control={control}
                    labelName="週期"
                    inputProps={{disabled: true}}
                    $color={Theme.colors.text.lightGray}
                  />
                </div>
              </div>

              <div>
                <TextInputField
                  name="amount"
                  control={control}
                  labelName="預計每期存錢金額"
                  $color={Theme.colors.text.lightGray}
                  inputProps={{disabled: true}}
                />
              </div>

              <div>
                <TextInputField
                  name="bindAccountNo"
                  control={control}
                  labelName="選擇陪你存錢的帳號"
                  $color={Theme.colors.text.lightGray}
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
