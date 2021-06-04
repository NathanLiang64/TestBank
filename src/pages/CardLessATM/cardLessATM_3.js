import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';

/* Elements */
// import theme from 'themes/theme';
import {
  FEIBButton,
} from 'components/elements';
import Dialog from 'components/Dialog';
import Accordion from 'components/Accordion';
import CheckCircleOutlineRoundedIcon from '@material-ui/icons/CheckCircleOutlineRounded';

/* Styles */
// import theme from 'themes/theme';
// import theme from 'themes/theme';
import CardLessATMWrapper from './cardLessATM.style';

const CardLessATM3 = () => {
  const history = useHistory();

  const [countSec, setCountSec] = useState(15 * 60);
  const [openDialog, setOpenDialog] = useState(false);
  const dialogContent = '您已取消本次交易';

  const cancleWithdrawal = () => {
    setOpenDialog(true);
  };

  const handleToggleDialog = () => {
    setOpenDialog(false);
  };

  const formatCountSec = (count) => {
    const min = Math.floor(count / 60);
    const sec = count % 60;
    return `${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`;
  };

  useEffect(() => {
    const countDown = setInterval(() => {
      if (countSec > 0) {
        // eslint-disable-next-line no-shadow
        setCountSec((countSec) => countSec - 1);
      }
    }, 1000);
    return () => clearInterval(countDown);
  }, [countSec]);

  return (
    <CardLessATMWrapper>
      <div className="amountInfo">
        <h1 className="label">
          設定提款成功
        </h1>
        <CheckCircleOutlineRoundedIcon />
        <h1 className="label">
          剩餘提款時間&nbsp;
          <span className="countDown">
            { formatCountSec(countSec) }
          </span>
        </h1>
      </div>
      <div className="tip">
        <h1>您已完成無卡提款交易</h1>
        <h1>到任何一個 ATM 提領您的現金吧！</h1>
      </div>
      <div className="resultTable withdraw">
        <table>
          <tbody>
            <tr>
              <td>銀行代號</td>
              <td>805</td>
            </tr>
            <tr>
              <td>提款序號</td>
              <td>0710345835</td>
            </tr>
            <tr>
              <td>提款金額</td>
              <td>NT $10,000</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="withdrawalInfo">
        請您於
        <span> 2021/05/27 16:18:54 </span>
        前至本行或他行有提供無卡提款功能之ATM完成提款！
      </div>
      <div className="resultTable">
        <table>
          <tbody>
            <tr>
              <td>申請時間</td>
              <td>2021/05/27 16:03:54</td>
            </tr>
            <tr>
              <td>交易類型</td>
              <td>無卡提款</td>
            </tr>
            <tr>
              <td>提款帳號</td>
              <td>04304099001568</td>
            </tr>
          </tbody>
        </table>
      </div>
      <Accordion space="both">
        <ul>
          <li>本交易限時15分鐘內有效，請於交易有效時間內，至本行提供無卡提款功能之ATM完成提款。若逾時請重新申請。(實際交易有效時間以本行系統時間為準)。</li>
          <br />
          <li>提醒您，ATM提款時請務必確認您的存款餘額是否足夠，避免提款失敗。 </li>
          <br />
          <li>無卡提款密碼連續錯誤3次，即鎖住服務，須重新申請服務。</li>
        </ul>
      </Accordion>
      <FEIBButton
        onClick={cancleWithdrawal}
      >
        取消交易
      </FEIBButton>
      <Dialog
        isOpen={openDialog}
        onClose={() => handleToggleDialog(false)}
        content={dialogContent}
        action={(
          <FEIBButton
            onClick={() => {
              handleToggleDialog(false);
              history.push('/cardLessATM1');
            }}
          >
            確定
          </FEIBButton>
        )}
      />
    </CardLessATMWrapper>
  );
};

export default CardLessATM3;
