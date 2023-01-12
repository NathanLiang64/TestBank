/* eslint-disable no-unused-vars */
/* Elements */
import {
  FEIBButton,
} from 'components/elements';
import Accordion from 'components/Accordion';
import SuccessFailureAnimations from 'components/SuccessFailureAnimations';
import InformationList from 'components/InformationList';
import Layout from 'components/Layout/Layout';
import { useNavigation } from 'hooks/useNavigation';
import { accountFormatter, dateToString, timeToString } from 'utilities/Generator';

/* Styles */
import CardLessATMWrapper from './D00300.style';

const CardLessATM2 = ({ location }) => {
  const { closeFunc } = useNavigation();
  const formatAmount = (amount) => new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'NTD', minimumFractionDigits: 0 }).format(amount);

  // Guard: 若導向過來的 param 不包含 data 則關閉該服務 (正常操作程序下不容易發生，但仍應防止)
  if (!location.state?.data) return closeFunc();

  const {
    seqNo, startDateTime, endDateTime, withdrawAmount, account,
  } = location.state.data;

  // 將 'YYYYMMDD hhmmss' 字串轉為 'YYYY/MM/DD hh:mm:ss' 格式
  const dateTimeFormat = (dateTimeString) => {
    const dateStr = dateTimeString.split(' ')[0];
    const timeStr = dateTimeString.split(' ')[1];

    return `${dateToString(dateStr)} ${timeToString(timeStr)}`;
  };

  return (
    <Layout title="無卡提款結果">
      <CardLessATMWrapper className="result-wrapper">
        <div className="section1">
          <SuccessFailureAnimations
            isSuccess={!!seqNo}
            successTitle="設定成功"
            errorTitle="設定失敗"
          />
          <div className="accountInfo">
            <div>銀行代號：805</div>
            <div className="withdrawNo">
              提款序號：
              {seqNo}
            </div>
            <div>
              提款金額：
              {formatAmount(withdrawAmount)}
            </div>
          </div>
          <div className="withdrawalInfo">
            請您於
            <span>{dateTimeFormat(endDateTime)}</span>
            前至本行或他行有提供無卡提款功能之 ATM 完成提款！
          </div>
        </div>
        <div className="section2">
          <InformationList title="申請時間" content={dateTimeFormat(startDateTime)} />
          <InformationList title="交易類型" content="無卡提款" />
          <InformationList title="提款帳號" content={accountFormatter(account)} />
          <Accordion space="both">
            <ul>
              <li>本交易限時15分鐘內有效，請於交易有效時間內，至本行提供無卡提款功能之ATM完成提款。若逾時請重新申請。(實際交易有效時間以本行系統時間為準)。</li>
              <li>
                提醒您，ATM提款時請務必確認您的存款餘額是否足夠，避免提款失敗。
                {' '}
              </li>
              <li>無卡提款密碼連續錯誤3次，即鎖住服務，須重新申請服務。</li>
            </ul>
          </Accordion>
          <FEIBButton onClick={() => closeFunc()}>
            確認
          </FEIBButton>
        </div>
      </CardLessATMWrapper>
    </Layout>
  );
};

export default CardLessATM2;
