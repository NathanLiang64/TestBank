/* eslint-disable no-unused-vars */
import React from 'react';

import Layout from 'components/Layout/Layout';
import SuccessFailureAnimations from 'components/SuccessFailureAnimations';
import { useHistory, useLocation } from 'react-router';
import { FEIBButton } from 'components/elements';
import DebitCardActiveWrapper, {SuccessDescWrapper} from './S00700.style';

const S007001 = () => {
  const history = useHistory();
  const {state} = useLocation();
  const go2More = () => history.replace('/B00600');
  const successDesc = () => (
    <SuccessDescWrapper>
      <div className="success_title">
        <h3>
          預設密碼：
        </h3>
        <div>民國出生年月日後6位數字</div>
      </div>
      <div className="success_detail">
        您的金融卡已啟用成功!
        <br />
        為保障您的交易安全，請您盡速於全台任一ATM或Web ATM進行密碼變更。
      </div>

    </SuccessDescWrapper>
  );

  if (!state || !state.apiResponse) return history.goBack();

  return (
    <Layout title="金融卡啟用結果" goBackFunc={go2More}>
      <DebitCardActiveWrapper>
        <SuccessFailureAnimations
          isSuccess={!!state.apiResponse.result}
          successTitle="設定成功"
          successDesc={successDesc()}
          errorTitle="設定失敗"
          errorDesc={state.apiResponse.message}
        />
        <FEIBButton style={{marginTop: '1rem'}} onClick={go2More}>確認</FEIBButton>
      </DebitCardActiveWrapper>
    </Layout>
  );
};

export default S007001;
