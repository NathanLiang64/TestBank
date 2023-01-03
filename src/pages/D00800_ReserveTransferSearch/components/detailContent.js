import { dateToString, toCurrency } from 'utilities/Generator';
import InformationList from 'components/InformationList';
import { DialogContentWrapper } from '../D00800.style';
import {
  renderHeader, renderBody,
} from '../utils';

const DetailContent = ({ reserveData, selectedAccount }) => (
  <DialogContentWrapper>
    <div className="mainBlock">{renderHeader(reserveData)}</div>
    <div className="informationListContainer">
      {renderBody(reserveData, selectedAccount)}
      <InformationList
        title="預約設定日"
        content={dateToString(reserveData.rgDay)}
      />
      {reserveData.cycle !== 'D' && (
        <InformationList title="預約轉帳總金額" content="待提供" />
      )}

      <InformationList
        title="帳戶餘額"
        content={`$${toCurrency(selectedAccount.balance)}`}
        remark={selectedAccount.alias}
      />

      <InformationList title="備註" content={reserveData.remark} />
    </div>
  </DialogContentWrapper>
);

export default DetailContent;
