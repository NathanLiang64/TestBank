import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import InformationList from 'components/InformationList';
import InfoArea from 'components/InfoArea';
import { FEIBButton } from 'components/elements';
import { setIsPasswordRequired, setResult } from 'components/PasswordDrawer/stores/actions';
import TransferWrapper from './transfer.style';

const Transfer1 = () => {
  const fastLogin = useSelector(({ passwordDrawer }) => passwordDrawer.fastLogin);
  const result = useSelector(({ passwordDrawer }) => passwordDrawer.result);
  const dispatch = useDispatch();

  const handleClickTransferButton = (event) => {
    event.preventDefault();
    if (fastLogin) dispatch(setIsPasswordRequired(true));
  };

  const onSubmit = () => {
    // console.log('送資料');
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
        <h3 className="transferAmount">$300</h3>
        <h3>遠東商銀(805)</h3>
        <h3>043000990000</h3>
      </section>
      <hr />
      <section>
        <InformationList title="轉出帳號" content="04300499001234" remark="保時捷車友會" />
        <InformationList title="時間" content="2020/12/25~2021/03/05" />
        <InformationList title="週期" content="每個月20號" remark="預計轉帳3次" />
        <InformationList title="手續費" content="$0" />
        <InformationList title="備註" content="聖誕節禮物" />
      </section>
      <hr />
      <section className="transferAction">
        <InfoArea>
          提醒您，即將進行非約定轉帳，請確認網路連線，以確保行動守護精靈MOTP可正常驗證
        </InfoArea>
        <div className="transferButtonArea">
          <FEIBButton onClick={handleClickTransferButton}>確認</FEIBButton>
          <p className="notice">轉帳前多思考，避免被騙更苦惱</p>
        </div>
      </section>
    </TransferWrapper>
  );
};

export default Transfer1;
