import { useHistory } from 'react-router';

/* Elements */
import {
  FEIBButton,
} from 'components/elements';
import DebitCard from 'components/DebitCard';
import Accordion from 'components/Accordion';

/* Styles */
// import theme from 'themes/theme';
import CardLessATMWrapper from './cardLessATM.style';

const CardLessATM2 = () => {
  const history = useHistory();

  const withdrawalConfirm = () => {
    history.push('/cardLessATM3');
  };

  return (
    <CardLessATMWrapper>
      <DebitCard
        cardName="存款卡"
        account="04304099001568"
        balance="168,000"
      />
      <div className="withdrawTimesInfo tip">
        免費跨提次數
        <span> 6 </span>
        次 / 免費跨轉次數
        <span> 6 </span>
        次
      </div>
      <div className="amountInfo">
        <div className="label">提款金額</div>
        <div className="amount">NT $10,000</div>
      </div>
      <Accordion space="both">
        一些注意事項
      </Accordion>
      <FEIBButton
        onClick={withdrawalConfirm}
      >
        確認提款
      </FEIBButton>
    </CardLessATMWrapper>
  );
};

export default CardLessATM2;
