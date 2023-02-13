/* eslint-disable no-unused-vars */
import React from 'react';

import Layout from 'components/Layout/Layout';
import SuccessFailureAnimations from 'components/SuccessFailureAnimations';
import { useHistory, useLocation } from 'react-router';
import { FEIBButton } from 'components/elements';
import ResultAnimation from 'components/SuccessFailureAnimations/ResultAnimation';
import { Func } from 'utilities/FuncID';
import { useNavigation } from 'hooks/useNavigation';
import DebitCardActiveWrapper, {SuccessDescWrapper} from './S00700.style';

const S007001 = () => {
  const history = useHistory();
  const { startFunc } = useNavigation();
  const {state} = useLocation();

  const successDesc = () => (
    // successDesc 內容是否應該由後端提供?
    <SuccessDescWrapper>
      <div className="success_title">

        預設密碼：

        <div>民國出生年月日後6位數字</div>
      </div>
      <div className="success_detail">
        您的金融卡已啟用成功!
        <br />
        為保障您的交易安全，請您盡速於全台任一ATM或Web ATM進行密碼變更。
      </div>
    </SuccessDescWrapper>
  );

  if (!state) return history.goBack();

  return (
    <Layout title="金融卡啟用結果" goBackFunc={() => startFunc(Func.B006.id)}>
      <DebitCardActiveWrapper>
        <ResultAnimation
          isSuccess={state.isSuccess}
          subject={state.isSuccess ? '設定成功' : '設定失敗'}
          description={state.isSuccess ? successDesc() : state.message}
        />
        <FEIBButton style={{ marginTop: '1rem' }} onClick={() => startFunc(Func.B006.id)}>
          確認
        </FEIBButton>
      </DebitCardActiveWrapper>
    </Layout>
  );
};

export default S007001;
