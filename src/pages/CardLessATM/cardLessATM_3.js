import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';

/* Elements */
// import theme from 'themes/theme';
import {
  FEIBButton,
} from 'components/elements';
import Dialog from 'components/Dialog';

/* Styles */
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
      <div className="accountInfo">
        <h1>
          設定提款成功
        </h1>
        <h1>
          剩餘提款時間&nbsp;
          { formatCountSec(countSec) }
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
      <div className="tip">注意事項</div>
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
