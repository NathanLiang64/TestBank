/* eslint-disable no-unused-vars */
import { useHistory, useLocation } from 'react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Layout from 'components/Layout/Layout';
import { FEIBButton, FEIBCheckbox } from 'components/elements';
import { currencySymbolGenerator } from 'utilities/Generator';

import InformationTape from 'components/InformationTape';
import { CheckboxField } from 'components/Fields';
import theme from 'themes/theme';
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
    defaultValues: { installmentItem: {} },
    resolver: yupResolver(installmentItemSchema),
  });
  const watchedValue = watch('installmentItem');

  const renderInstallmentRadioButton = (detail) => (
    <InformationTape
      className={`${watchedValue[detail.value] ? 'checkedtape' : ''}`}
      topLeft={detail.name}
      bottomLeft={`消費日期:${detail.date}`}
      topRight={currencySymbolGenerator('TWD', detail.cost)}
      checked={!!watchedValue[detail.value]}
      customHeader={(
        <FEIBCheckbox
          $iconColor={theme.colors.text.light}
          className="checkbox"
          checked={!!watchedValue[detail.value]}
        />
      )}
    />
  );

  const generateOptions = () => mockLists.map((item) => ({
    label: renderInstallmentRadioButton(item),
    value: item.value,
  }));

  const onSubmit = (data) => {
    console.log('R002001 handleOnSubmit() data: ', data);

    // history.push('/R002002', {sum: costSum}); // 帶 list.cost 總和到下一頁
  };

  // NOTE 選擇單筆分期(可多次申請)，僅顯示尚未單筆分期且符合最低金額(3000元)的消費筆數供勾選。
  // Note 依時間序進行顯示。
  // TODO 目前 options 是 mockData，需串接 API

  return (
    <Layout title="晚點付 (單筆)">
      <InstalmentWrapper className="InstalmentWrapper" small>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className="messageBox">
              <p>勾選申請分期消費</p>
              <p>(單筆消費限額需達3,000元以上)</p>
            </div>
            {generateOptions().map(({ label, value }) => (
              <CheckboxField
                key={value}
                control={control}
                name={`installmentItem.${value}`}
                labelName={label}
                hideDefaultCheckbox
              />
            ))}
          </div>
          <FEIBButton style={{marginTop: '2rem'}} type="submit">下一步</FEIBButton>
        </form>
      </InstalmentWrapper>
    </Layout>
  );
};

export default R00200_1;
