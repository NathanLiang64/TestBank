import { accountTypeColorGenerator, currencySymbolGenerator } from 'utilities/Generator';

import AccountCardWrapper from './AccountCard.style';

/*
* ==================== AccountCard 組件說明 ====================
* 帳戶總覽組件
* ==================== AccountCard 可傳參數 ====================
* 1. accountType -> 帳戶科目別 (ex: "004")
* 2. cardName -> 卡片名稱
* 3. account -> 卡片帳號
* 4. balance -> 卡片餘額，輸入純數字即可，顯示時會自動加上貨幣符號及千分位逗點
* 5. color -> 卡片顏色，預設紫色
* 6. dollarSign -> 貨幣符號，預設為 '$'
* 7. percent -> 百分比（0~100，不含符號）
* 8. ariaLabel -> title for button，預設為 cardName
* 9. children
* */

const AccountCard = ({
  accountType = '004',
  cardName = 'Title',
  account = '000-000-99991111',
  balance = '200000',
  color,
  dollarSign = 'NTD',
  percent = '20',
  ariaLabel,
  children,
}) => (
  <AccountCardWrapper
    title={ariaLabel || cardName}
    $cardColor={color || accountTypeColorGenerator(accountType)}
  >
    <div className="justify-between">
      <div>{cardName}</div>
      <div>
        {percent}
        %
      </div>
    </div>
    <div>{account}</div>
    <div className="balance">
      {`${currencySymbolGenerator(dollarSign, balance)}`}
    </div>
    { children }
  </AccountCardWrapper>
);

export default AccountCard;
