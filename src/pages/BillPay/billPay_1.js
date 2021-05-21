import { useState } from 'react';
import { useHistory } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import DebitCard from 'components/DebitCard';
import Dialog from 'components/Dialog';
import {
  FEIBButton,
  FEIBInput, FEIBInputLabel,
} from 'components/elements';

/* Api */
import { useCheckLocation, usePageInfo } from 'hooks';

/* img */
import Family from 'assets/images/Family.jpg';

/* Styles */
import theme from 'themes/theme';
import BillPay2 from './billPay_2';
import BillPayWrapper from './billPay.style';

import { actions } from './stores';

const { setSendType } = actions;

/* eslint-disable */
const BillPay = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const billPayData = useSelector(((state) => state.billPay));
  const { push } = useHistory();
  const dispatch = useDispatch();

  const handleToggleDialog = (boolean) => {
    setOpenDialog(boolean);
  };

  const handleClickShowResult = () => {
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
      account="043-040-99001568"
      balance="168,000"
    />
  );

  const renderFormArea = () => (
    <section>
      <div>
        <FEIBInputLabel htmlFor="password">網銀密碼</FEIBInputLabel>
        <FEIBInput
          id="password"
          name="password"
          placeholder="請輸入您的網銀密碼"
          className="customBottomSpace"
          $color={theme.colors.primary.dark}
          $borderColor={theme.colors.primary.brand}
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
            <td>00300466006458</td>
          </tr>
          <tr>
            <td>繳款卡號</td>
            <td>本人卡款</td>
          </tr>
          <tr>
            <td>繳費金額</td>
            <td>NTD 500</td>
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
            <td>NTD 22,567</td>
          </tr>
          <tr>
            <td>本期最低應繳金額</td>
            <td>NTD 4,865</td>
          </tr>
          <tr>
            <td>轉出銀行代號</td>
            <td>805</td>
          </tr>
          <tr>
            <td>轉出銀行帳號</td>
            <td>00200300021585</td>
          </tr>
          <tr>
            <td>繳費金額</td>
            <td>NTD 4,865</td>
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
            <td>3,800(自訂繳費金額)</td>
          </tr>
        </tbody>
      </table>
    </section>
  );

  const renderImage = () => (
    <section>
      {/* 超商logo */}
      <img src={Family} alt="Family" />
      {/* 條碼1 */}
      <img src={Family} alt="Family" />
      {/* 條碼2 */}
      <img src={Family} alt="Family" />
      {/* 條碼3 */}
      <img src={Family} alt="Family" />
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
        onClick={() => handleClickShowResult()}
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
            {renderImage()}
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
      {pageControll()}
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
