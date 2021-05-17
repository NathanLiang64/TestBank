import { useHistory } from 'react-router';

/* Elements */
// import theme from 'themes/theme';
import {
  FEIBBorderButton,
} from 'components/elements';

/* Styles */
import CardLessATMWrapper from './cardLessATM.style';

const CardLessATM2 = () => {
  const history = useHistory();

  const withdrawalConfirm = () => {
    history.push('/cardLessATM/cardLessATM3');
  };

  return (
    <CardLessATMWrapper>
      <div className="account-info">
        <h1>
          活儲帳戶 04304099001568
        </h1>
        <h1>
          提款金額 NT $ 10,000
        </h1>
      </div>
      <div className="tip">注意事項</div>
      <FEIBBorderButton onClick={withdrawalConfirm}>確認提款</FEIBBorderButton>
    </CardLessATMWrapper>
  );
};

export default CardLessATM2;
