import React, { useEffect } from 'react';

import Loading from 'components/Loading';

import Layout from 'components/Layout/Layout';
import { useLocation } from 'react-router';
import { useNavigation } from 'hooks/useNavigation';
import { getSSE } from './api';

const AplFxProxy = () => {
  const {search} = useLocation();
  const { closeFunc } = useNavigation();

  useEffect(async () => {
    const prod = search.split('=')[1];
    const { sse } = await getSSE({ prod });

    const destUrl = `${process.env.REACT_APP_APLFX_URL}prod=${prod}&sse=${sse}`;

    window.open(destUrl, '_blank');

    closeFunc();
  }, []);

  return (
    <Layout title="更多">
      <Loading space="both" isFullscreen isCentered />
    </Layout>
  );
};

export default AplFxProxy;
