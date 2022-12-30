import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useHistory, useLocation } from 'react-router';

import Layout from 'components/Layout/Layout';
import { FEIBButton, FEIBCheckbox } from 'components/elements';
import { currencySymbolGenerator, dateToString } from 'utilities/Generator';

import InformationTape from 'components/InformationTape';
import { CheckboxField } from 'components/Fields';
import theme from 'themes/theme';
import { useNavigation } from 'hooks/useNavigation';
import InstalmentWrapper from './R00200.style';

/**
 * R002001  晚點付 (單筆_勾選分期消費項目)
 *  NOTE 選擇單筆分期(可多次申請)，僅顯示尚未單筆分期且符合最低金額(3000元)的消費筆數供勾選。
 *  NOTE 依時間序進行顯示。
 */
const R00200_1 = () => {
  const history = useHistory();
  const { state } = useLocation();
  const { goHome } = useNavigation();
  const schema = yup.object().shape({
    applType: yup.string().required('請選擇欲申請之晚點付項目'),
  });

  const { control, handleSubmit, watch } = useForm({
    defaultValues: { installmentItem: {} },
    resolver: yupResolver(schema),
  });
  const watchedValue = watch('installmentItem');

  const renderInstallmentRadioButton = (txn) => (
    <InformationTape
      className={`${watchedValue[txn.authCode] ? 'checkedtape' : ''}`}
      topLeft={txn.storeName}
      bottomLeft={`消費日期:${dateToString(txn.purchDate)}`}
      topRight={currencySymbolGenerator('TWD', txn.purchAmount)}
      checked={!!watchedValue[txn.authCode]}
      customHeader={(
        <FEIBCheckbox
          $iconColor={theme.colors.text.light}
          className="checkbox"
          checked={!!watchedValue[txn.authCode]}
        />
      )}
    />
  );

  const generateOptions = () => state.availableTxns.map((txn) => ({
    label: renderInstallmentRadioButton(txn),
    value: txn.authCode,
  }));

  const onSubmit = ({ installmentItem }) => {
    const selectedTxns = state.availableTxns.filter((txn) => !!installmentItem[txn.authCode]);

    history.push('/R002002', {
      applType: 'G',
      selectedTxns,
      newInstRestraintFlag: state.newInstRestraintFlag,
    });
  };

  if (!state) goHome();
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
          <FEIBButton style={{ marginTop: '2rem' }} type="submit">
            下一步
          </FEIBButton>
        </form>
      </InstalmentWrapper>
    </Layout>
  );
};

export default R00200_1;
