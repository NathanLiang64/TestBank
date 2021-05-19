import { useEffect, useState } from 'react';
/* Elements */
import {
  FEIBButton,
  FEIBInput,
  // FEIBInputLabel,
} from 'components/elements';
import { RadioGroup, FormControlLabel, Radio } from '@material-ui/core';

/* Styles */
import theme from 'themes/theme';

/* Api */
import { init } from 'apis/billPay/billPayApi';

const BillPay = () => {
  const [initData, setinitData] = useState(null);
  useEffect(async () => {
    const data = await init();
    setinitData(data);
    console.log(initData);
  }, []);

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
      {initData && buttonPage()}

    </>

  );

  return renderPage();
};

export default BillPay;
