import InformationList from 'components/InformationList';
import { dateToString } from 'utilities/Generator';
import SuccessFailureAnimations from 'components/SuccessFailureAnimations';
import { DialogContentWrapper } from '../D00800.style';
import { renderHeader } from '../utils';

const DialogContent = ({ resultData, selectedAccount }) => (
  <DialogContentWrapper>
    <div className="resultContainer">
      <div className="stateContainer">
        <SuccessFailureAnimations
          isSuccess={resultData.result === 'ok'}
          successTitle={resultData.result === 'ok' ? '轉帳成功' : '轉帳失敗'}
          errorDesc={resultData.result}
        />
      </div>
    </div>
    <div className="mainBlock">{renderHeader(resultData)}</div>
    <div className="informationListContainer">
      <InformationList
        title="轉出帳號"
        content={selectedAccount.accountNo}
        remark={selectedAccount.alias}
      />
      <InformationList title="時間" content={dateToString(resultData.runday)} />
    </div>
  </DialogContentWrapper>
);

export default DialogContent;
