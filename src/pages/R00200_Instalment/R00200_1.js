/* eslint-disable no-unused-vars */
import { useHistory, useLocation } from 'react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Layout from 'components/Layout/Layout';
import { FEIBButton, FEIBCheckbox } from 'components/elements';
import { RadioGroupField } from 'components/Fields/radioGroupField';
import { currencySymbolGenerator } from 'utilities/Generator';

import InstalmentWrapper from './R00200.style';
import { mockLists } from './mockData/installmentItemOptions';
import { installmentItemSchema } from './validationSchema';

/**
 * R002001  晚點付 (單筆_勾選分期消費項目)
 */
const R00200_1 = () => {
  const history = useHistory();
  const location = useLocation();
  const { control, handleSubmit, watch } = useForm({
    defaultValues: { installmentItem: '' },
    resolver: yupResolver(installmentItemSchema),
  });
  const watchedValue = watch('installmentItem');

  const renderInstallmentRadioButton = (detail) => (
    <div className="checkbox">
      <FEIBCheckbox
        className="customPadding"
        name={detail.name}
        checked={detail.value === watchedValue}
      />
      <div className="left-section">
        <div className="name">{detail.name}</div>
        <div className="date">
          消費日期：
          {detail.date}
        </div>
      </div>
      <div className="right-section">
        {currencySymbolGenerator('TWD', detail.cost)}
      </div>
    </div>
  );

  const generateOptions = () => mockLists.map((item) => ({
    label: renderInstallmentRadioButton(item),
    value: item.value,
  }));

  const onSubmit = (data) => {
    console.log('R002001 handleOnSubmit() data: ', data);

    // history.push('/R002002', {sum: costSum}); // 帶 list.cost 總和到下一頁
  };

  // 註1:選擇單筆分期(可多次申請)，僅顯示尚未單筆分期且符合最低金額(3000元)的消費筆數供勾選。
  // 註2:依時間序進行顯示。
  // TODO 目前 options 是 mockData
  return (
    <Layout title="晚點付 (單筆)">
      <InstalmentWrapper className="InstalmentWrapper" small>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <RadioGroupField
              control={control}
              options={generateOptions()}
              name="installmentItem"
              hideDefaultButton
              labelName={(
                <div className="messageBox">
                  <p>勾選申請分期消費</p>
                  <p>(單筆消費限額需達3,000元以上)</p>
                </div>
              )}
            />
          </div>
          <FEIBButton style={{marginTop: '2rem'}} type="submit">下一步</FEIBButton>
        </form>
      </InstalmentWrapper>
    </Layout>
  );
};

export default R00200_1;
