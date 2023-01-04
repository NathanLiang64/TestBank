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
  const [openingFail, setOpeningFail] = useState(false);
  const { closeFunc } = useNavigation();

  useEffect(async () => {
    const prod = search.split('=')[1];
    const { sse } = await getSSE({ prod });
    const url = `${process.env.REACT_APP_APLFX_URL}prod=${prod}&sse=${sse}`;
    setTargetURL(url);
    const opener = window.open(url, '_blank');
    if (opener) closeFunc(); // BUG 有外開瀏覽器但是沒有產生 opener
    else setOpeningFail(true);
  }, []);

  const renderHintMessage = () => (
    <p className="hint-message">
      若未導向，請點擊此
      <a
        href={targetURL}
        target="_blank"
        onClick={() => closeFunc()}
        rel="noreferrer noopener"
      >
        連結
      </a>
      前往申請平台
    </p>
  );
  // TODO title 應該改成申請類別的名稱
  return (
    <Layout title="更多">
      <AplFxProxyWrapper>
        {/* 若外開失敗 (沒有產生 opener)，則提示使用者點選連結 */}
        {openingFail && targetURL ? (
          renderHintMessage()
        ) : (
          <Loading space="both" isFullscreen isCentered />
        )}
      </AplFxProxyWrapper>
    </Layout>
  );
};

export default AplFxProxy;
