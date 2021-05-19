import { useEffect, useState } from 'react';
/* Elements */
import {
  FEIBButton, FEIBCheckbox, FEIBCheckboxLabel,
  FEIBInput, FEIBInputAnimationWrapper, FEIBInputLabel,
  FEIBOption,
  FEIBSelect,
} from 'components/elements';
import { RadioGroup, FormControlLabel, Radio } from '@material-ui/core';

/* Styles */
import theme from 'themes/theme';

/* Api */
import { billPayApi } from 'apis/';
import { RadioButtonChecked, RadioButtonUnchecked } from '@material-ui/icons';
import { useCheckLocation, usePageInfo } from '../../hooks';

const BillPay = () => {
  const { init } = billPayApi;
  const [initData, setinitData] = useState(null);
  useEffect(async () => {
    const data = await init();
    setinitData(data.initData);
  }, []);

  useCheckLocation();
  usePageInfo('/api/billPay');
  const cardPage = () => (
    <div>
      <p>
        存款卡
        {initData.trnAcct}
      </p>
      <p>
        可用餘額 NT $
        {initData.trnBalance}
      </p>
    </div>
  );

  const formPage = () => (
    <div style={{ marginBottom: '2.4rem' }}>
      <h2>請選擇繳費金額</h2>
      <FEIBButton
        $color={theme.colors.primary.brand}
        $bgColor={theme.colors.basic.white}
        $pressedBgColor={theme.colors.primary.dark}
        $borderColor={theme.colors.primary.brand}
      >
        申請分期
      </FEIBButton>
      <RadioGroup aria-label="gender" name="gender1">
        <FormControlLabel value="1" control={<Radio />} label={`繳全額  NT $ ${initData.ccToTrcvAmtd}`} />
        <FormControlLabel value="2" control={<Radio />} label={`繳全額  NT $ ${initData.ccMinImPayd}`} />
        <FormControlLabel value="3" control={<Radio />} label="自訂金額" />
      </RadioGroup>
      <FEIBInput
        type="number"
        $color={theme.colors.primary.dark}
        $borderColor={theme.colors.primary.brand}
      />
    </div>
  );

  const otherCCPage = () => (
    <div>
      <h2>請選擇繳費帳戶</h2>
      <FEIBInputLabel
        htmlFor="otherBankCode"
        $color={theme.colors.basic.black}
      >
        請選擇轉出行庫
      </FEIBInputLabel>
      <FEIBSelect
        defaultValue="請選擇"
        id="otherBankCode"
        name="otherBankCode"
        $color={theme.colors.primary.dark}
        $borderColor={theme.colors.primary.brand}
      >
        <FEIBOption value="請選擇">請選擇</FEIBOption>
        <FEIBOption value="bbb">BBB</FEIBOption>
      </FEIBSelect>
      <div style={{ width: '100%' }}>
        <FEIBInputAnimationWrapper>
          <FEIBInputLabel
            htmlFor="otherTrnAcct"
            $color={theme.colors.basic.black}
          >
            請輸入轉出帳號
          </FEIBInputLabel>
          <FEIBInput
            id="otherTrnAcct"
            name="otherTrnAcct"
            $color={theme.colors.basic.black}
            $borderColor={theme.colors.basic.black}
          />
        </FEIBInputAnimationWrapper>
      </div>
      <div style={{ marginBottom: '2.4rem' }}>
        <FEIBCheckboxLabel
          control={(
            <FEIBCheckbox
              color="default"
              $iconColor={theme.colors.primary.brand}
              icon={<RadioButtonUnchecked />}
              checkedIcon={<RadioButtonChecked />}
            />
                    )}
          label="當轉帳交易成功，發送簡訊通知至您的信箱"
          $color={theme.colors.primary.brand}
        />
      </div>
      <div style={{ width: '100%' }}>
        <FEIBInput
          id="e-mail"
          name="e-mail"
          placeholder="e-mail"
          $color={theme.colors.basic.black}
          $borderColor={theme.colors.basic.black}
        />
      </div>
    </div>

  );

  const buttonPage = () => (
    <div>
      <FEIBButton
        $color={theme.colors.primary.brand}
        $bgColor={theme.colors.basic.white}
        $pressedBgColor={theme.colors.primary.dark}
        $borderColor={theme.colors.primary.brand}
      >
        下一步
      </FEIBButton>
      <FEIBButton
        $color={theme.colors.primary.brand}
        $bgColor={theme.colors.basic.white}
        $pressedBgColor={theme.colors.primary.dark}
        $borderColor={theme.colors.primary.brand}
      >
        超商條碼繳費
      </FEIBButton>
    </div>
  );

  const renderPage = () => (
    <>
      {initData && initData.feib ? cardPage() : null}
      {initData && formPage()}
      {initData && !initData.feib ? otherCCPage() : null}
      {initData && buttonPage()}
    </>

  );

  return renderPage();
};

export default BillPay;
