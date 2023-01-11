import { useForm } from 'react-hook-form';
import { useHistory, useLocation } from 'react-router';

import Layout from 'components/Layout/Layout';
import { FEIBButton, FEIBCheckbox } from 'components/elements';
import { currencySymbolGenerator, dateToString } from 'utilities/Generator';
import InformationTape from 'components/InformationTape';
import { CheckboxField } from 'components/Fields';
import { useNavigation } from 'hooks/useNavigation';
import { showPrompt } from 'utilities/MessageModal';
import InstalmentWrapper from './R00200.style';

// import { mockLists } from './mockData/installmentItemOptions';

/**
 * R002001  晚點付 (單筆_勾選分期消費項目)
 *  NOTE 選擇單筆分期(可多次申請)，僅顯示尚未單筆分期且符合最低金額(3000元)的消費筆數供勾選。
 *  NOTE 依時間序進行顯示。
 */
const R00200_1 = () => {
  const history = useHistory();
  const { state } = useLocation();
  const { goHome } = useNavigation();

  const { control, handleSubmit, watch } = useForm({
    defaultValues: { installmentItem: {} },
  });
  const watchedValue = watch('installmentItem');

  const renderInstallmentRadioButton = (detail) => (
    <InformationTape
      className={watchedValue[detail.authCode] ? 'checkedtape' : ''}
      customHeader={(
        <FEIBCheckbox
          className="checkbox"
          name={detail.authCode}
          checked={!!watchedValue[detail.authCode]}
        />
      )}
      topLeft={detail.storeName}
      topRight={currencySymbolGenerator('NTD', detail.purchAmount)}
      bottomLeft={` 消費日期：${dateToString(detail.purchDate)}`}
    />
  );

  // const generateOptions = () => mockLists.map((txn) => ({
  const generateOptions = () => state.availableTxns.map((txn) => ({
    label: renderInstallmentRadioButton(txn),
    value: txn.authCode,
  }));

  const onSubmit = ({ installmentItem }) => {
    // const selectedTxns = mockLists.filter((txn) => !!installmentItem[txn.authCode]);
    const selectedTxns = state.availableTxns.filter((txn) => !!installmentItem[txn.authCode]);
    if (!selectedTxns.length) showPrompt('請選擇要分期的項目');
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
