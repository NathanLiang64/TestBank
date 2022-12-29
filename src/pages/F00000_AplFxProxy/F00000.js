import React, { useEffect } from 'react';
import { useLocation } from 'react-router';

import Loading from 'components/Loading';
import Layout from 'components/Layout/Layout';
import { useNavigation } from 'hooks/useNavigation';
import { getSSE } from './api';

// NOTE 這邊作為申請平台導向用途，完成連結外開後隨即返回前一個服務
const AplFxProxy = () => {
  const {search} = useLocation();
  const { closeFunc } = useNavigation();

  useEffect(async () => {
    const prod = search.split('=')[1];
    const { sse } = await getSSE({ prod });
    const URL = `${process.env.REACT_APP_APLFX_URL}prod=${prod}&sse=${sse}`;
    window.open(URL, '_blank');
    closeFunc();
  }, []);

  return (
    <Layout title="更多">
      <Loading space="both" isFullscreen isCentered />
    </Layout>
  );
};

export default AplFxProxy;
