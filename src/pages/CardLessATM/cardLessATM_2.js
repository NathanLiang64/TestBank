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
        <ul>
          <li>本交易限時15分鐘內有效，請於交易有效時間內，至本行提供無卡提款功能之ATM完成提款。若逾時請重新申請。(實際交易有效時間以本行系統時間為準)。</li>
          <li>提醒您，ATM提款時請務必確認您的存款餘額是否足夠，避免提款失敗。 </li>
          <li>無卡提款密碼連續錯誤3次，即鎖住服務，須重新申請服務。</li>
        </ul>
      </Accordion>
      <div className="btn-fix">
        <FEIBButton
          onClick={withdrawalConfirm}
        >
          確認提款
        </FEIBButton>
      </div>
    </CardLessATMWrapper>
  );
};

export default CardLessATM2;
