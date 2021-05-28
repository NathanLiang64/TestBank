import { useState } from 'react';
import { useHistory } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { useCheckLocation, usePageInfo, useBarcodeGenerator } from 'hooks';
import DebitCard from 'components/DebitCard';
import Dialog from 'components/Dialog';
import { FEIBButton, FEIBInput, FEIBInputLabel } from 'components/elements';
import FamilyMartImage from 'assets/images/familyMartLogo.png';
import theme from 'themes/theme';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import BillPay2 from './billPay_2';
import BillPayWrapper from './billPay.style';
import { setSendType } from './stores/actions';
import e2ee from '../../utilities/E2ee';

const BillPay = () => {
  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    password: yup.string().required('請輸入您的網銀密碼').min(8, '您輸入的網銀密碼長度有誤，請重新輸入。').max(20, '您輸入的網銀密碼長度有誤，請重新輸入。'),
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
    dispatch(setSendType(true));
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
    />
  );

  const renderFormArea = () => (
    <section>
      <div>
        <FEIBInputLabel htmlFor="password">網銀密碼</FEIBInputLabel>
        <Controller
          name="password"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <FEIBInput
              {...field}
              id="password"
              name="password"
              type="password"
              placeholder="請輸入您的網銀密碼"
              $color={theme.colors.primary.dark}
              $borderColor={theme.colors.primary.brand}
            />
          )}
        />
        <p>{errors.password?.message}</p>
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
            <td>{billPayData.otherBankCode}</td>
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

  const collapse = () => (
    <div className="tip">注意事項</div>
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
            {collapse()}
            {renderNextStepButton()}
          </>
        );
      case 3:
        return (
          <>
            {renderTable3Area()}
            {renderBarcodes()}
            {collapse()}
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
