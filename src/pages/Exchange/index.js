import { useCheckLocation, usePageInfo } from 'hooks';

/* Elements */
import {
  FEIBRadio, FEIBRadioLabel, FEIBBorderButton, FEIBButton, FEIBCheckboxLabel, FEIBCheckbox,
} from 'components/elements';
import { RadioGroup } from '@material-ui/core';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import NoticeArea from 'components/NoticeArea';
import Accordion from 'components/Accordion';
import ExchangeNotice from './exchangeNotice';

/* Styles */
import ExchangeWrapper from './exchange.style';

const Exchange = () => {
  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
  });
  const {
    control,
  } = useForm({
    resolver: yupResolver(schema),
    reValidateMode: 'onBlur',
  });

  useCheckLocation();
  usePageInfo('/api/exchange');

  return (
    <ExchangeWrapper>
      <section>
        <div className="formAreaTitle">
          <h2>請選擇繳費金額</h2>
          <FEIBBorderButton className="customSize" type="button">
            外匯匯率查詢
          </FEIBBorderButton>
        </div>
        <Controller
          name="exchangeType"
          control={control}
          defaultValue="1"
          render={({ field }) => (
            <RadioGroup
              {...field}
              aria-label="換匯種類"
              id="exchangeType"
              name="exchangeType"
              defaultValue="1"
            >
              <FEIBRadioLabel value="1" control={<FEIBRadio />} label="台幣轉外幣" />
              <FEIBRadioLabel value="2" control={<FEIBRadio />} label="外幣轉台幣" />
            </RadioGroup>
          )}
        />
        <NoticeArea title=" " textAlign="left">
          以本行牌告匯率或網銀優惠匯率為成交匯率（預約交易係依據交易日上午09:30最近一盤牌告/網銀優惠匯率為成交匯率）。營業時間以外辦理外匯交易結匯金額併入次營業日累積結匯金額；為網銀優惠將視市場波動清況，適時暫時取消優惠。
        </NoticeArea>
        <FEIBCheckboxLabel
          control={(
            <FEIBCheckbox />
          )}
          label="我已閱讀並同意以上規範"
        />
        <Accordion space="both" open>
          <ExchangeNotice />
        </Accordion>
        <FEIBButton>確認</FEIBButton>
      </section>
    </ExchangeWrapper>
  );
};

export default Exchange;
