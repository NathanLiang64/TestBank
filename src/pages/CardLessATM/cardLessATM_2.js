import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';

/* Elements */
import {
  FEIBButton,
} from 'components/elements';
import Accordion from 'components/Accordion';
import SuccessImage from 'assets/images/stateSuccess.svg';
import InformationList from 'components/InformationList';

/* Styles */
import CardLessATMWrapper from './cardLessATM.style';

const CardLessATM2 = ({ location }) => {
  const history = useHistory();

  const [countSec, setCountSec] = useState(15 * 60);
  const [resultInfo, setResultInfo] = useState({
    result: 0,
    message: '無卡提款申請成功',
    bankNo: '',
    withdrawalNo: '',
    startDateTime: '',
    endDateTime: '',
    amount: 0,
  });

  const formatAmount = (amount) => new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', minimumFractionDigits: 0 }).format(amount);

  // const formatCountSec = (count) => {
  //   const min = Math.floor(count / 60);
  //   const sec = count % 60;
  //   return `${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`;
  // };

  useEffect(() => {
    setResultInfo(location.state.data);
    const countDown = setInterval(() => {
      if (countSec > 0) {
        // eslint-disable-next-line no-shadow
        setCountSec((countSec) => countSec - 1);
      }
    }, 1000);
    return () => clearInterval(countDown);
  }, [countSec]);

  return (
    <CardLessATMWrapper className="result-wrapper">
      <div className="section1">
        <div className="successImg">
          <img src={SuccessImage} alt="Success" />
          <div className="successTxt">設定成功</div>
        </div>
        <div className="accountInfo">
          <div>
            銀行代號：
            {resultInfo.bankNo}
          </div>
          <div className="withdrawNo">
            提款序號：
            {resultInfo.withdrawalNo}
          </div>
          <div>
            提款金額：
            {formatAmount(resultInfo.amount)}
          </div>
        </div>
        <div className="withdrawalInfo">
          請您於
          <span>
            {resultInfo.endDateTime}
          </span>
          前至本行或他行有提供無卡提款功能之 ATM 完成提款！
        </div>
      </div>
      <div className="section2">
        <Accordion title="詳細交易" space="bottom" open>
          <InformationList title="申請時間" content={resultInfo.startDateTime} />
          <InformationList title="交易類型" content="無卡提款" />
          <InformationList title="提款帳號" content={resultInfo.startDateTime} />
        </Accordion>
        <Accordion space="bottom" open>
          <ul>
            <li>本交易限時15分鐘內有效，請於交易有效時間內，至本行提供無卡提款功能之ATM完成提款。若逾時請重新申請。(實際交易有效時間以本行系統時間為準)。</li>
            <li>提醒您，ATM提款時請務必確認您的存款餘額是否足夠，避免提款失敗。 </li>
            <li>無卡提款密碼連續錯誤3次，即鎖住服務，須重新申請服務。</li>
          </ul>
        </Accordion>
        <FEIBButton
          onClick={() => {
            history.push('/more');
          }}
        >
          確認
        </FEIBButton>
      </div>
    </CardLessATMWrapper>
  );
};

export default CardLessATM2;
