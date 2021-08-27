import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import InformationList from 'components/InformationList';
import InfoArea from 'components/InfoArea';
import Dialog from 'components/Dialog';
import Loading from 'components/Loading';
import { FEIBButton } from 'components/elements';
import { setIsPasswordRequired, setResult } from 'components/PasswordDrawer/stores/actions';
import { dateFormatter, timeFormatter, weekNumberToChinese } from 'utilities/Generator';
import { directTo } from 'utilities/mockWebController';
import TransferWrapper, { TransferMOTPDialogWrapper } from './transfer.style';

const Transfer1 = () => {
  const [openMOTPDialog, setOpenMOTPDialog] = useState(false);
  const fastLogin = useSelector(({ passwordDrawer }) => passwordDrawer.fastLogin);
  const motp = useSelector(({ passwordDrawer }) => passwordDrawer.motp);
  const result = useSelector(({ passwordDrawer }) => passwordDrawer.result);
  const history = useHistory();
  const dispatch = useDispatch();
  const { state } = useLocation();

  const {
    debitAccount, debitName, bankCode, receivingAccount, remark, transactionCycle, transactionDate, transactionFrequency, transferAmount,
  } = state;

  // TODO: 補預計轉帳次數計算邏輯 (非 transactionCycle 數字)

  const switchFrequency = (frequency) => {
    switch (frequency) {
      case 'weekly':
        return '每週';
      case 'monthly':
        return '每個月';
      default:
        return '';
    }
  };

  const handleClickTransferButton = () => {
    if (fastLogin || !motp) dispatch(setIsPasswordRequired(true));
  };

  const onSubmit = () => setOpenMOTPDialog(true);

  const renderMOTPNotice = () => (
    <InfoArea className="infoArea">
      提醒您，即將進行非約定轉帳，請確認網路連線，以確保行動守護精靈MOTP可正常驗證
    </InfoArea>
  );

  const renderMOTPLoadingDialog = () => (
    <Dialog
      title="行動守護精靈 MOTP"
      isOpen={openMOTPDialog}
      content={(
        <TransferMOTPDialogWrapper>
          <Loading />
          <p>驗證中</p>
        </TransferMOTPDialogWrapper>
      )}
    />
  );

  useEffect(() => {
    if (result) onSubmit();
    dispatch(setResult(false));
  }, [result]);

  useEffect(() => {
    if (openMOTPDialog) {
      // 模擬 MOTP 驗證所需時間
      const delay = (interval) => new Promise((resolve) => setTimeout(resolve, interval));

      // 模擬 MOTP 驗證所需時間 2 秒
      const waitMOTP = async () => await delay(2000);

      // 驗證成功後關閉 MOTP 驗證彈窗並跳轉至成功頁
      waitMOTP().then(() => {
        setOpenMOTPDialog(false);
        directTo(history, 'transfer2', state);
      });
    }
  }, [openMOTPDialog]);

  return (
    <TransferWrapper className="transferConfirmPage">
      <hr />
      <section className="transferMainInfo">
        <p>轉出金額與轉入帳號</p>
        <h3 className="transferAmount">{transferAmount ? `$${transferAmount}` : ''}</h3>
        <h3>{bankCode.bankNo ? `${bankCode.bankName}(${bankCode.bankNo})` : ''}</h3>
        <h3>{receivingAccount ? `${receivingAccount}` : ''}</h3>
      </section>
      <hr />
      <section>
        <InformationList title="轉出帳號" content={debitAccount} remark={debitName} />
        <InformationList
          title="時間"
          content={transactionDate ? `${dateFormatter(transactionDate)} ${timeFormatter(transactionDate)}` : ''}
        />
        {transactionFrequency && transactionCycle && (
          <InformationList
            title="週期"
            // content={`${switchFrequency(transactionFrequency)}${transactionDate.getDate()}號`}
            content={
              transactionFrequency === 'monthly'
                ? `${switchFrequency(transactionFrequency)}${transactionCycle}號`
                : `${switchFrequency(transactionFrequency)}${weekNumberToChinese(transactionCycle)}`
            }
            remark={`預計轉帳${transactionCycle}次`}
          />
        )}
        <InformationList title="手續費" content="$0" />
        <InformationList title="備註" content={remark || ''} />
      </section>
      <hr />
      <section className="transferAction">
        { motp && renderMOTPNotice() }
        <div className="transferButtonArea">
          <FEIBButton onClick={handleClickTransferButton}>確認</FEIBButton>
          <p className="notice">轉帳前多思考，避免被騙更苦惱</p>
        </div>
      </section>
      { motp && renderMOTPLoadingDialog() }
    </TransferWrapper>
  );
};

export default Transfer1;
