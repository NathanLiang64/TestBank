import InformationList from 'components/InformationList';
import DialogContentWrapper from './dialogContent.style';

const DetailContent = ({ data }) => (
  <DialogContentWrapper>
    <div className="mainBlock">
      <div className="dataLabel">轉出金額與轉入帳號</div>
      <div className="balance">{data.amount}</div>
      <div className="account">
        遠東商銀(
        { data.bankCode }
        )
      </div>
      <div className="account">{ data.inActNo }</div>
    </div>
    <div className="informationListContainer">
      <InformationList title="轉出帳號" content={data.outActNo} remark="保時捷車友會" />
      <InformationList title="預約轉帳日" content={data.trnsDate} />
      <InformationList title="週期" content={data.bookType === '1' ? '單次' : '週期'} remark={data.bookType === '1' ? '' : '預計轉帳10次｜成功2次｜失敗0次'} />
      {
        data.bookType === '2' && (<InformationList title="期間" content="2021/05/01~2022/02/28" />)
      }
      <InformationList title="預約設定日" content="2021/03/05" />
      {
        data.bookType === '2' && (<InformationList title="預約轉帳總金額" content="$200,000" />)
      }
      <InformationList title="帳戶餘額" content="$20,000" />
      <InformationList title="備註" content={data.remark} />
    </div>
  </DialogContentWrapper>
);

export default DetailContent;
