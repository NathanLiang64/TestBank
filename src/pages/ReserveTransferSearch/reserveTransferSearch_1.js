import { useHistory } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';

/* Elements */
import { FEIBButton } from 'components/elements';
import InformationList from 'components/InformationList';
import Accordion from 'components/Accordion';

/* Styles */
import ReserveTransferSearchWrapper from './reserveTransferSearch.style';

const ReserveTransferSearch1 = () => {
  const history = useHistory();

  const toResultPage = () => {
    history.push('/reserveTransferSearch2');
  };

  useCheckLocation();
  usePageInfo('/api/reserveTransferSearch1');

  return (
    <ReserveTransferSearchWrapper>
      <section className="confrimDataContainer lighterBlueLine">
        <div className="dataLabel">轉出金額與轉入帳號</div>
        <div className="balance">$300</div>
        <div className="accountInfo">遠東商銀（805）</div>
        <div className="accountInfo">043000990000</div>
      </section>
      <section className="informationListContainer">
        <InformationList title="轉出帳號" content="04300499001234" remark="保時捷車友會" />
        <InformationList title="預約轉帳日" content="2021/05/15" />
        <InformationList title="週期" content="每個月15號" remark="預計轉帳10次｜成功2次｜失敗0次" />
        <InformationList title="期間" content="2021/05 ~ 2022/02/28" />
      </section>
      <section className="accordionContainer">
        <Accordion title="詳細交易" space="bottom">
          <InformationList title="預約設定日" content="2021/03/05" />
          <InformationList title="預約轉帳總金額" content="$200,000" />
          <InformationList title="帳戶餘額" content="$20,000" remark="保時捷車友會" />
          <InformationList title="備註" content="聖誕節禮物" />
        </Accordion>
      </section>
      <section className="buttonContainer">
        <FEIBButton onClick={toResultPage}>確認取消</FEIBButton>
      </section>
    </ReserveTransferSearchWrapper>
  );
};

export default ReserveTransferSearch1;
