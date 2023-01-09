import { useState } from 'react';
import { useHistory } from 'react-router';

import Layout from 'components/Layout/Layout';
import { FEIBButton } from 'components/elements';
import { transactionAuth } from 'utilities/AppScriptProxy';
import { cancelReserveTransfer } from 'pages/D00800_ReserveTransferSearch/api';

import { AuthCode } from 'utilities/TxnAuthCode';
import { useDispatch } from 'react-redux';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { useNavigation } from 'hooks/useNavigation';
import SuccessFailureAnimations from 'components/SuccessFailureAnimations';
import { FuncID } from 'utilities/FuncID';
import { ReserveTransferSearchWrapper } from './D00800.style';
import { renderFooter, renderHeader, renderBody} from './utils';

const ReserveTransferSearch1 = ({ location }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const {closeFunc} = useNavigation();
  const [cancelResult, setCancelResult] = useState();
  const goBack = () => history.goBack();

  const onConfirmHandler = async () => {
    if (!cancelResult) {
      // 執行取消預約轉帳
      dispatch(setWaittingVisible(true));
      const {result} = await transactionAuth(AuthCode.D00800);
      if (result) {
        const { reserveData } = location.state;
        // 不確定沒刪除的話，API 是否會成功，先把不需帶過去的 property 刪掉
        delete reserveData.txCd;
        delete reserveData.bankName;
        delete reserveData.dscpt1;
        delete reserveData.isMulti;
        const res = await cancelReserveTransfer(reserveData);
        // 基本上若 code!=='0000' 的情況下，底層就會跳出錯誤
        setCancelResult(res);
      }
      dispatch(setWaittingVisible(false));
    } else {
      // 已經執行過取消，導向子首頁
      history.push(FuncID.D00800);
    }
  };

  if (!location.state) closeFunc();
  const {reserveData, selectedAccount} = location.state;
  return (
    <Layout title="取消預約轉帳" goBackFunc={goBack}>
      <ReserveTransferSearchWrapper>
        {!!cancelResult && (
          <SuccessFailureAnimations
            isSuccess={cancelResult.isSuccess}
            successTitle="設定成功"
            errorTitle="設定失敗"
            errorDesc={cancelResult.message}
          />
        )}
        {/* 當尚未執行取消或是取消成功的情況下才顯示 */}
        {(!cancelResult || cancelResult.isSuccess) && (
        <>
          <section className="confrimDataContainer lighterBlueLine">
            {renderHeader(reserveData)}
          </section>
          <section className="informationListContainer">
            {renderBody(reserveData, selectedAccount)}
          </section>
          <section className="accordionContainer">
            {renderFooter(reserveData, selectedAccount)}
          </section>
        </>
        )}

        <FEIBButton className="buttonContainer" onClick={onConfirmHandler}>
          { cancelResult ? '確認' : '確認取消'}
        </FEIBButton>

      </ReserveTransferSearchWrapper>
    </Layout>
  );
};

export default ReserveTransferSearch1;
