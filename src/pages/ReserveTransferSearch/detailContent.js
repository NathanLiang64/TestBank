import InformationList from 'components/InformationList';
import DialogContentWrapper from './dialogContent.style';

const DetailContent = () => {
  const type = '週期';
  return (
    <DialogContentWrapper>
      <div className="mainBlock">
        <div className="dataLabel">轉出金額與轉入帳號</div>
        <div className="balance">$300</div>
        <div className="account">遠東商銀(805)</div>
        <div className="account">043000990000</div>
      </div>
      <div className="informationListContainer">
        <InformationList title="轉出帳號" content="0430099001234" remark="保時捷車友會" />
        <InformationList title="預約轉帳日" content="2021/08/31" />
        <InformationList title="週期" content="每個月15號" remark="預計轉帳10次｜成功2次｜失敗0次" />
        {
          type === '週期' && (<InformationList title="期間" content="2021/05/01~2022/02/28" />)
        }
        <InformationList title="預約設定日" content="2021/03/05" />
        {
          type === '週期' && (<InformationList title="預約轉帳總金額" content="$200,000" />)
        }
        <InformationList title="帳戶餘額" content="$20,000" />
        <InformationList title="備註" content="聖誕節禮物" />
      </div>
    </DialogContentWrapper>
  );
};

export default DetailContent;
