import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';

import Loading from 'components/Loading';
import Layout from 'components/Layout/Layout';
import { getSSE } from './api';
import { AplFxProxyWrapper } from './F00000.style';

/**
 * 申請平台啟動頁面。
 * 透過 /F00000/產品代碼 啟動申請項目，例： /F00000/Ca 申請信用卡。
 */
const AplFxProxy = () => {
  const { prod } = useParams(); // 取得url所帶功能代碼
  const [targetURL, setTargetURL] = useState();

  useEffect(async () => {
    const sse = await getSSE(prod);
    const url = `${process.env.REACT_APP_APLFX_URL}prod=${prod}&sse=${sse}`;
    // NOTE 直接開啟申請平台即可，因為這個頁面是原生端獨立另開WebView載入的
    //      所以，不需要再外開一個瀏覽器。
    window.location.replace(url);
    setTargetURL(url);
  }, []);

  const renderHintMessage = () => (
    <p className="hint-message">
      若未導向，請點擊此
      <a href={targetURL} target="_self">連結</a>
      前往申請平台
    </p>
  );

  return (
    <Layout title="擁有更多Bankee金融服務">
      <AplFxProxyWrapper>
        {/* 若外開失敗 (沒有產生 opener)，則提示使用者點選連結 */}
        { targetURL ? (
          renderHintMessage()
        ) : (
          <Loading space="both" isFullscreen isCentered />
        )}
      </AplFxProxyWrapper>
    </Layout>
  );
};

export default AplFxProxy;
