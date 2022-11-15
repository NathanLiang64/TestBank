import {
  accountOverviewCardVarient,
  currencySymbolGenerator,
} from 'utilities/Generator';
import FEIBIconButton from 'components/elements/FEIBIconButton';
import { MoreIcon } from 'assets/images/icons';
import AccountCardWrapper from './CreditCard.style';

/*
* ==================== AccountCard 組件說明 ====================
* 帳戶總覽組件
* ==================== AccountCard 可傳參數 ====================
* 1. type -> 帳戶科目別 (ex: "004")
* 2. cardName -> 卡片名稱
* 3. accountNo -> 卡片帳號
* 4. balance -> 卡片餘額，輸入純數字即可，顯示時會自動加上貨幣符號及千分位逗點
* 5. color -> 卡片顏色，預設紫色
* 6. dollarSign -> 貨幣符號，預設為 '$'
* 8. annotation -> 金額旁的備註，如：以使用額度
* 9. ariaLabel -> title for button，預設為 cardName
* 10.onClick -> 點即時呼叫。
* 11.children
* 12.moreList -> 點擊更多圖標後彈出的更多功能清單，型別為陣列，組件 type 為 original 的卡片 (完整內容) 才需要傳入
* 13. functionList -> 卡片功能清單，型別為陣列，組件 type 為 original 的卡片 (完整內容) 才需要傳入
* */

const creditFormatter = (account) => (
  account ? `${account.slice(0, 4)}-****-****-${account.slice(12, 16)}` : '-'
);

const AccountCard = ({
  type = 'M',
  cardName,
  accountNo,
  balance,
  color,
  dollarSign = 'NTD',
  annotation,
  ariaLabel,
  onClick,
  children,
  onMoreClicked,
  functionList,
}) => (
  <AccountCardWrapper
    title={ariaLabel || cardName}
    $cardColor={color || accountOverviewCardVarient(type).color}
    onClick={onClick}
  >
    { children ?? (
      <>
        <div className="justify-between">
          <div>{cardName}</div>
          {
            onMoreClicked && (<div className="moreIconButton"><FEIBIconButton aria-label="展開下拉式選單" onClick={onMoreClicked}><MoreIcon /></FEIBIconButton></div>)
          }
        </div>
        <p>{accountNo ? creditFormatter(accountNo) : '\u00A0' }</p>
        <div className="justify-between items-center">
          <div>{annotation}</div>
          <div className="balance">

            {`${currencySymbolGenerator(dollarSign, Math.abs(balance))}`}
          </div>
        </div>
        <div className="w-full">{functionList}</div>
      </>
    ) }
  </AccountCardWrapper>
);

export default AccountCard;
