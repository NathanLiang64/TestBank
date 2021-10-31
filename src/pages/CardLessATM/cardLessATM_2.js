import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';

/* Elements */
import {
  FEIBButton,
} from 'components/elements';
import Accordion from 'components/Accordion';
import SuccessFailureAnimations from 'components/SuccessFailureAnimations';
import InformationList from 'components/InformationList';

/* Styles */
import CardLessATMWrapper from './cardLessATM.style';

const CardLessATM2 = ({ location }) => {
  const history = useHistory();

  const [resultInfo, setResultInfo] = useState({
    result: 0,
    message: '無卡提款申請成功',
    withdrawalNo: '',
    startDateTime: '',
    endDateTime: '',
    amount: 0,
    account: '',
  });

  const formatAmount = (amount) => new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', minimumFractionDigits: 0 }).format(amount);

  useEffect(() => {
    setResultInfo(location.state.data);
  }, []);

  return (
    <CardLessATMWrapper className="result-wrapper">
      <div className="section1">
        <SuccessFailureAnimations
          isSuccess={!!resultInfo.withdrawalNo}
          successTitle="設定成功"
          errorTitle="設定失敗"
        />
        <div className="accountInfo">
          <div>
            銀行代號：805
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
        <InformationList title="申請時間" content={resultInfo.startDateTime} />
        <InformationList title="交易類型" content="無卡提款" />
        <InformationList title="提款帳號" content={resultInfo.account} />
        <Accordion space="both" open>
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
