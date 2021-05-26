import { useEffect, useState } from 'react';
import DebitCard from 'components/DebitCard';
import {
  FEIBButton, FEIBBorderButton,
  FEIBCheckbox, FEIBCheckboxLabel,
  FEIBRadio, FEIBRadioLabel,
  FEIBInput, FEIBInputLabel,
  FEIBOption, FEIBSelect,
} from 'components/elements';
import { RadioGroup } from '@material-ui/core';

/* function */
import { billPayApi } from 'apis';
import { useCheckLocation, usePageInfo } from 'hooks';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';

/* Styles */
import theme from 'themes/theme';
import BillPayWrapper from './billPay.style';

import { actions } from './stores';

const { setPayType } = actions;
const { init } = billPayApi;

const BillPay = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [initData, setInitData] = useState(null);

  // 測試：取得元素高度
  // const [rect, ref] = useClientRect();
  // useEffect(() => {
  //   if (rect !== null) console.log(rect.height);
  // }, [rect]);

  const doAction = () => {
    if (initData.feib) {
      dispatch(setPayType(1));
    } else {
      dispatch(setPayType(2));
    }
    history.push('/billPay1');
  };

  const goConvenienceStores = () => {
    dispatch(setPayType(3));
    history.push('/billPay1');
  };

  useCheckLocation();
  usePageInfo('/api/billPay');

  useEffect(async () => {
    const data = await init();
    setInitData(data.initData);
  }, []);

  const renderCardArea = () => {
    const { trnAcct, trnBalance } = initData;
    return (
      <DebitCard
        cardName="存款卡"
        account={trnAcct}
        balance={trnBalance}
        hideIcon
      />
    );
  };

  const renderFormArea = () => {
    const { ccToTrcvAmtd, ccMinImPayd } = initData;
    return (
      <section>
        <div className="formAreaTitle">
          <h2>請選擇繳費金額</h2>
          <FEIBBorderButton className="customSize">
            申請分期
          </FEIBBorderButton>
        </div>
        <RadioGroup aria-label="繳費金額" name="payAmount" defaultValue="1">
          <FEIBRadioLabel value="1" control={<FEIBRadio color="default" />} label={`繳全額  NT $ ${ccToTrcvAmtd}`} />
          <FEIBRadioLabel value="2" control={<FEIBRadio color="default" />} label={`繳最低  NT $ ${ccMinImPayd}`} />
          <div>
            <FEIBRadioLabel value="3" control={<FEIBRadio color="default" />} label="自訂金額" />
            <span className="smallFontSize">$</span>
            <FEIBInput
              className="customStyles"
              type="number"
              $color={theme.colors.text.dark}
              $borderColor={theme.colors.text.dark}
            />
          </div>
        </RadioGroup>
      </section>
    );
  };

  const renderOtherCCArea = () => (
    <section>
      <h2>請選擇繳費帳戶</h2>
      <FEIBInputLabel htmlFor="otherBankCode">請選擇轉出行庫</FEIBInputLabel>
      <FEIBSelect
        defaultValue="aaa"
        id="otherBankCode"
        name="otherBankCode"
        $borderColor={theme.colors.primary.brand}
      >
        <FEIBOption value="aaa">AAA 行庫</FEIBOption>
        <FEIBOption value="bbb">BBB 行庫</FEIBOption>
      </FEIBSelect>
      <div>
        <FEIBInputLabel htmlFor="otherTrnAcct">請輸入轉出帳號</FEIBInputLabel>
        <FEIBInput
          id="otherTrnAcct"
          name="otherTrnAcct"
          placeholder="請輸入轉出帳號"
          className="customBottomSpace"
          $color={theme.colors.primary.dark}
          $borderColor={theme.colors.primary.brand}
        />
      </div>
      <div>
        <FEIBCheckboxLabel
          control={(
            <FEIBCheckbox
              className="customPadding"
              color="default"
              $iconColor={theme.colors.text.light}
            />
          )}
          label="當轉帳交易成功，發送簡訊通知至您的信箱"
        />
        <FEIBInput
          id="e-mail"
          name="e-mail"
          placeholder="請輸入E-mail"
          className="customTopSpace"
          $color={theme.colors.primary.dark}
          $borderColor={theme.colors.primary.brand}
          $bottomSpace={false}
        />
      </div>
    </section>
  );

  const renderButtons = () => (
    <div className="buttons">
      <FEIBButton
        $color={theme.colors.text.dark}
        $bgColor={theme.colors.background.cancel}
        onClick={doAction}
      >
        下一步
      </FEIBButton>
      <FEIBButton onClick={goConvenienceStores}>超商條碼繳費</FEIBButton>
    </div>
  );

  const renderPage = () => (
    <BillPayWrapper>
      {initData && initData.feib ? renderCardArea() : null}
      {initData && renderFormArea()}
      {initData && !initData.feib ? renderOtherCCArea() : null}
      {initData && renderButtons()}
    </BillPayWrapper>
  );

  return renderPage();
};

export default BillPay;
