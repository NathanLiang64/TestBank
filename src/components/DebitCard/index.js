import { useState } from 'react';
import { FEIBIconButton } from 'components/elements';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import theme from 'themes/theme';
import DebitCardWrapper from './debitCard.style';

/*
* ==================== DebitCard 組件說明 ====================
* 存款卡組件
* ==================== DebitCard 可傳參數 ====================
* 1. cardName -> 卡片名稱
* 2. account -> 卡片帳號
* 3. balance -> 卡片餘額，輸入純數字即可，顯示時會自動加上貨幣符號及千分位逗點
* 4. hideIcon -> 此組件預設會在餘額前顯示眼睛圖示的 Icon Button
*    點擊 Icon 後可隱藏餘額，倘若不需要此功能請在組件加上 hideIcon 屬性
* */

const DebitCard = ({
  cardName,
  account,
  balance,
  hideIcon,
}) => {
  const [showBalance, setShowBalance] = useState(true);

  const handleClickShowBalance = () => {
    setShowBalance(!showBalance);
  };

  // 將餘額加上千分位符號顯示
  const toCurrency = (number) => {
    const parts = number.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  const renderIconButton = () => (
    <FEIBIconButton
      $fontSize={1.6}
      $iconColor={theme.colors.text.dark}
      onClick={handleClickShowBalance}
    >
      {showBalance ? <Visibility /> : <VisibilityOff />}
    </FEIBIconButton>
  );

  return (
    <DebitCardWrapper>
      <div className="cardTitle">
        <h2 className="cardName">{cardName}</h2>
        <p className="account">{account}</p>
      </div>
      <div className="cardBalance">
        { !hideIcon && renderIconButton }
        <h3 className="balance">
          {showBalance ? `$${toCurrency(balance)}` : '＊＊＊＊＊'}
        </h3>
      </div>
    </DebitCardWrapper>
  );
};

export default DebitCard;
