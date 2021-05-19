import { useState } from 'react';
import { FEIBIconButton } from 'components/elements';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import theme from 'themes/theme';
import DebitCardWrapper from './debitCard.style';

const DebitCard = ({
  cardName,
  account,
  balance,
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

  return (
    <DebitCardWrapper>
      <div className="cardTitle">
        <h2 className="cardName">{cardName}</h2>
        <p className="account">{account}</p>
      </div>
      <div className="cardBalance">
        <FEIBIconButton
          $fontSize={1.6}
          $iconColor={theme.colors.text.dark}
          onClick={handleClickShowBalance}
        >
          {showBalance ? <Visibility /> : <VisibilityOff />}
        </FEIBIconButton>
        <h3 className="balance">
          {showBalance ? `$${toCurrency(balance)}` : '＊＊＊＊＊'}
        </h3>
      </div>
    </DebitCardWrapper>
  );
};

export default DebitCard;
