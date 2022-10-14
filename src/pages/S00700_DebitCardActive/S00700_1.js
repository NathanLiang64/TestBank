/* eslint-disable no-unused-vars */
import React from 'react';

import Layout from 'components/Layout/Layout';
import SuccessFailureAnimations from 'components/SuccessFailureAnimations';
import { useHistory, useLocation } from 'react-router';
import { FEIBButton } from 'components/elements';
import DebitCardActiveWrapper from './S00700.style';
import { successDesc } from './utils';

const S007001 = () => {
  const history = useHistory();
  const location = useLocation();
  if (!location.state) history.replace('/B00600');

  const {
    isSuccess, successTitle, errorTitle, errorDesc,
  } = location.state;

  const go2More = () => history.replace('/B00600');

  return (
    <Layout title="金融卡啟用結果" goBackFunc={go2More}>
      <DebitCardActiveWrapper>
        <SuccessFailureAnimations
          isSuccess={isSuccess}
          successTitle={successTitle}
          successDesc={successDesc()}
          errorTitle={errorTitle}
          errorDesc={errorDesc}
        />
        <FEIBButton style={{marginTop: '1rem'}} onClick={go2More}>確認</FEIBButton>
      </DebitCardActiveWrapper>
    </Layout>
  );
};

export default S007001;
