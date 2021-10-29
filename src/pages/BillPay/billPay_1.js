import { useState } from 'react';
import { useHistory } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCheckLocation, usePageInfo, useBarcodeGenerator } from 'hooks';
import DebitCard from 'components/DebitCard';
import Dialog from 'components/Dialog';
import PasswordInput from 'components/PasswordInput';
import Accordion from 'components/Accordion';
import { FEIBButton } from 'components/elements';
import FamilyMartImage from 'assets/images/familyMartLogo.png';
import theme from 'themes/theme';
import e2ee from 'utilities/E2ee';
import {
  passwordValidation,
} from 'utilities/validation';
import BillPay2 from './billPay_2';
import BillPayWrapper from './billPay.style';
import { setSendType } from './stores/actions';

const BillPay = () => {
  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    password: passwordValidation(),
  });

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const [openDialog, setOpenDialog] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [showAlert, setShowAlert] = useState(false);

  const billPayData = useSelector(((state) => state.billPay.payData));
  const initData = useSelector(((state) => state.billPay.initData));

  const { push } = useHistory();
  const dispatch = useDispatch();

  const handleToggleDialog = (boolean) => {
    setOpenDialog(boolean);
  };

  const onSubmit = async (data) => {
    data.password = await e2ee(data.password);
    // 點擊按鈕後彈窗顯示繳費結果
    handleToggleDialog(true);
    dispatch(setSendType(false));
    setShowAlert(true);
  };

  const handleClickDialogButton = () => {
    // 點擊確定申請後關閉彈窗並顯示成功申請
    handleToggleDialog(false);
    setShowAlert(false);
    push('/billPay');
  };

  useCheckLocation();
  usePageInfo('/api/billPay');

  const renderCardArea = () => (
    <DebitCard
      cardName="存款卡"
      account={initData.trnAcct}
      balance={initData.trnBalance}
      hideIcon
    />
  );

  const renderFormArea = () => (
    <section>
      <div>
        <PasswordInput
          id="password"
          control={control}
          errorMessage={errors.password?.message}
        />
      </div>
    </section>
  );

  const renderTable1Area = () => (
    <section>
      <table>
        <tbody>
          <tr>
            <td>轉出帳號</td>
            <td>{initData.trnAcct}</td>
          </tr>
          <tr>
            <td>繳款卡號</td>
            <td>本人卡款</td>
          </tr>
          <tr>
            <td>繳費金額</td>
            <td>
              NTD
              {' '}
              {billPayData.payAmount}
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );

  const renderTable2Area = () => (
    <section>
      <table>
        <tbody>
          <tr>
            <td>本期應繳金額</td>
            <td>
              NTD
              {' '}
              {initData.ccToTrcvAmtd}
            </td>
          </tr>
          <tr>
            <td>本期最低應繳金額</td>
            <td>
              NTD
              {' '}
              {initData.ccMinImPayd}
            </td>
          </tr>
          <tr>
            <td>轉出銀行代號</td>
            <td>{`${billPayData.otherBankCode.bankName} (${billPayData.otherBankCode.bankCode})`}</td>
          </tr>
          <tr>
            <td>轉出銀行帳號</td>
            <td>{billPayData.otherTrnAcct}</td>
          </tr>
          <tr>
            <td>繳費金額</td>
            <td>
              NTD
              {' '}
              {billPayData.payAmount}
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );

  const renderTable3Area = () => (
    <section>
      <h2>您設定的繳費結果</h2>
      <table>
        <tbody>
          <tr>
            <td>繳費方式</td>
            <td>超商條碼繳費</td>
          </tr>
          <tr>
            <td>繳費金額</td>
            <td>{billPayData.payAmount}</td>
          </tr>
        </tbody>
      </table>
    </section>
  );

  const renderBarcodes = () => (
    <section className="barcodeArea">
      <div className="place">
        <img src={FamilyMartImage} alt="FamilyMartImage" />
      </div>
      { useBarcodeGenerator('5566778AG2') }
      { useBarcodeGenerator('998855465566771123') }
      { useBarcodeGenerator('70558X000003851') }
    </section>
  );

  const renderCollapse = () => (
    <Accordion className="accordion">
      <p>注意事項內文</p>
    </Accordion>
  );

  const renderNextStepButton = () => (
    <div>
      <FEIBButton
        $color={theme.colors.text.dark}
        $bgColor={theme.colors.background.cancel}
        type="submit"
      >
        下一步
      </FEIBButton>
    </div>
  );

  const pageControll = () => {
    switch (billPayData.payType) {
      case 2:
        return (
          <>
            {renderTable2Area()}
            {renderFormArea()}
            {renderCollapse()}
            {renderNextStepButton()}
          </>
        );
      case 3:
        return (
          <>
            {renderTable3Area()}
            {renderBarcodes()}
            {renderCollapse()}
          </>
        );
      default:
        return (
          <>
            {renderCardArea()}
            {renderTable1Area()}
            {renderFormArea()}
            {renderNextStepButton()}
          </>
        );
    }
  };

  const renderPage = () => (
    <BillPayWrapper>
      <form onSubmit={handleSubmit(onSubmit)}>
        {pageControll()}
      </form>
      <Dialog
        isOpen={openDialog}
        onClose={() => handleToggleDialog(false)}
        content={<BillPay2 />}
        action={<FEIBButton onClick={handleClickDialogButton}>確定</FEIBButton>}
      />
    </BillPayWrapper>
  );

  return renderPage();
};

export default BillPay;
