/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';

import Loading from 'components/Loading';
import Layout from 'components/Layout/Layout';
import { useNavigation } from 'hooks/useNavigation';
import { getSSE } from './api';
import { AplFxProxyWrapper } from './F00000.style';

// NOTE 這邊作為申請平台導向用途，完成連結外開後隨即返回前一個服務
const AplFxProxy = () => {
  const {search} = useLocation();
  const [targetURL, setTargetURL] = useState();
  const [SSEToken, setSSEToken] = useState();

  const fetchSSE = async () => {
    const prod = search.split('=')[1];
    const { sse } = await getSSE({ prod });
    setSSEToken(sse);
    const url = `${process.env.REACT_APP_APLFX_URL}prod=${prod}&sse=${sse}`;
    const windowOpener = window.open(url, '_self');
    if (!windowOpener) setTargetURL(url);
  };

  useEffect(() => {
    fetchSSE();
  }, []);

  const renderHintMessage = () => (
    <p className="hint-message">
      若未導向，請點擊此
      <a href={targetURL} target="_self">連結</a>
      前往申請平台
    </p>
  );

  return (
    <AplFxProxyWrapper>
      {/* 若外開失敗 (沒有產生 opener)，則提示使用者點選連結 */}
      { targetURL ? (
        renderHintMessage()
      ) : (
        <Loading space="both" isFullscreen isCentered />
      )}
      <div className="token">
        SSETOKEN:
        {SSEToken}
      </div>
    </AplFxProxyWrapper>
  );
};

export default AplFxProxy;
