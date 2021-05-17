import { useHistory } from 'react-router';

/* Elements */
// import theme from 'themes/theme';
import {
  FEIBBorderButton,
} from 'components/elements';

/* Styles */
import CardlessWithdrawalWrapper from './cardlessWithdrawal.style';

const Step2 = () => {
  const history = useHistory();

  const withdrawalConfirm = () => {
    history.push('/cardlessWithdrawal/step3');
  };

  return (
    <CardlessWithdrawalWrapper>
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
    </CardlessWithdrawalWrapper>
  );
};

export default Step2;
