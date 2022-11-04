import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { closeFunc } from 'utilities/AppScriptProxy';
import { showCustomPrompt } from 'utilities/MessageModal';
import { getCardlessStatus } from 'pages/D00300_CardLessATM/api';

/* Elements */
import Layout from 'components/Layout/Layout';

/* Styles */
import CardLessATMWrapper from './cardLessATM.style';

const CardLessATM = () => {
  const history = useHistory();

  // 跳轉到無卡提款申請頁
  const toWithdrawPage = () => {
    history.push('/D003001');
  };

  // 檢查無卡提款狀態; 0=未申請, 1=已申請未開通, 2=已開通, 3=已註銷, 4=已失效, 5=其他
  const fetchCardlessStatus = async (param) => {
    const statusCodeResponse = await getCardlessStatus(param);
    if (statusCodeResponse.code === '0000') {
      const { cwdStatus } = statusCodeResponse.data;
      const statusNumber = Number(cwdStatus);
      // 未開通
      if (
        statusNumber === 0
        || statusNumber === 1
        || statusNumber === 3
        || statusNumber === 4
      ) {
        await showCustomPrompt({
          message: '很抱歉，您尚未開通無卡提款功能，無法使用此功能',
          onOk: () => closeFunc(),
        });
        return;
      }

      // 已開通
      if (statusNumber === 2) {
        toWithdrawPage();
      }
    } else {
      await showCustomPrompt({
        message: '發生錯誤，暫時無法使用此功能',
        onOk: () => closeFunc(),
      });
    }
  };

  useEffect(() => {
    fetchCardlessStatus({});
  }, []);

  return (
    <Layout title="無卡提款">
      <CardLessATMWrapper />
    </Layout>
  );
};

export default CardLessATM;
