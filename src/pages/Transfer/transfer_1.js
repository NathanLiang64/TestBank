import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import InformationList from 'components/InformationList';
import InfoArea from 'components/InfoArea';
import { FEIBButton } from 'components/elements';
import { setIsPasswordRequired, setResult } from 'components/PasswordDrawer/stores/actions';
import { dateFormatter, timeFormatter } from 'utilities/Generator';
import { directTo } from 'utilities/mockWebController';
import TransferWrapper from './transfer.style';

const Transfer1 = () => {
  const fastLogin = useSelector(({ passwordDrawer }) => passwordDrawer.fastLogin);
  const result = useSelector(({ passwordDrawer }) => passwordDrawer.result);
  const transferData = useSelector(({ transfer }) => transfer.transferData);
  const history = useHistory();
  const dispatch = useDispatch();

  const {
    bankCode,
    receivingAccount,
    remark,
    transactionCycle,
    transactionDate,
    transactionFrequency,
    transferAmount,
  } = transferData;

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
    if (fastLogin) dispatch(setIsPasswordRequired(true));
  };

  const onSubmit = () => {
    // console.log(transferData);
    directTo(history, 'transfer');
  };

  useEffect(() => {
    if (result) onSubmit();
    dispatch(setResult(false));
  }, [result]);

  return (
    <TransferWrapper className="transferConfirmPage">
      <hr />
      <section className="transferMainInfo">
        <p>轉出金額與轉入帳號</p>
        <h3 className="transferAmount">{transferAmount ? `$${transferAmount}` : ''}</h3>
        <h3>{bankCode.bankCode ? `${bankCode.bankName}(${bankCode.bankCode})` : ''}</h3>
        <h3>{receivingAccount ? `${receivingAccount}` : ''}</h3>
      </section>
      <hr />
      <section>
        <InformationList title="轉出帳號" content="04300499001234" remark="保時捷車友會" />
        <InformationList
          title="時間"
          content={transactionDate ? `${dateFormatter(transactionDate)} ${timeFormatter(transactionDate)}` : ''}
        />
        {transactionFrequency && transactionCycle && (
          <InformationList
            title="週期"
            content={`${switchFrequency(transactionFrequency)}${transactionDate.getDate()}號`}
            remark={`預計轉帳${transactionCycle}次`}
          />
        )}
        <InformationList title="手續費" content="$0" />
        <InformationList title="備註" content={remark ? transferData.remark : ''} />
      </section>
      <hr />
      <section className="transferAction">
        <InfoArea>提醒您，即將進行非約定轉帳，請確認網路連線，以確保行動守護精靈MOTP可正常驗證</InfoArea>
        <div className="transferButtonArea">
          <FEIBButton onClick={handleClickTransferButton}>確認</FEIBButton>
          <p className="notice">轉帳前多思考，避免被騙更苦惱</p>
        </div>
      </section>
    </TransferWrapper>
  );
};

export default Transfer1;
