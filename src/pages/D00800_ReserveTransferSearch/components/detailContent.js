import { dateToString, toCurrency } from 'utilities/Generator';
import InformationList from 'components/InformationList';
import { DialogContentWrapper } from '../D00800.style';

const DetailContent = ({ contentData: { data, selectedAccount } }) => (
  <DialogContentWrapper>
    <div className="mainBlock">
      <div className="dataLabel">轉出金額與轉入帳號</div>
      <div className="balance">
        $
        {data.amount}
      </div>
      <div className="account">
        {data.inBankName}
        (
        {data.inBank}
        )
      </div>
      <div className="account">{data.inActNo}</div>
    </div>
    <div className="informationListContainer">
      <InformationList
        title="轉出帳號"
        content={selectedAccount.acctId}
        remark={selectedAccount.acctName}
      />
      <InformationList
        title="預約轉帳日"
        content={dateToString(data.payDate)}
      />
      <InformationList title="週期" content={data.payDateWording} />
      {data.chargeMode !== '1' && (
        <InformationList
          title="期間"
          content={`${dateToString(data.payDate)}~${dateToString(
            data.payDateEnd,
          )}`}
        />
      )}
      <InformationList
        title="預約設定日"
        content={dateToString(data.trnsDate)}
      />
      {/* {
        data.chargeMode !== '1' && (<InformationList title="預約轉帳總金額" content="$200,000" />)
      } */}
      <InformationList
        title="帳戶餘額"
        content={`$${toCurrency(selectedAccount.acctBalx)}`}
        remark={selectedAccount.acctName}
      />

      <InformationList title="備註" content={data.memo} />
    </div>
  </DialogContentWrapper>
);

export default DetailContent;
