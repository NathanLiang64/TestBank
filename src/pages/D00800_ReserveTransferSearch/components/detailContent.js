import { DialogContentWrapper } from '../D00800.style';
import { renderHeader, renderBody, renderFooter } from '../utils';

const DetailContent = ({ reserveData, selectedAccount }) => (
  <DialogContentWrapper>
    <div className="mainBlock">{renderHeader(reserveData)}</div>
    <div className="informationListContainer">
      {renderBody(reserveData, selectedAccount)}
      {renderFooter(reserveData, selectedAccount)}
    </div>
  </DialogContentWrapper>
);

export default DetailContent;
