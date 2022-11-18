import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { closeFunc } from 'utilities/AppScriptProxy';
import { showCustomPrompt } from 'utilities/MessageModal';
import { getCardlessStatus } from 'pages/D00300_CardLessATM/api';

/* Elements */
import Layout from 'components/Layout/Layout';

/* Styles */
import CardLessATMWrapper from './D00300.style';

const CardLessATM = () => {
  const history = useHistory();

  // 跳轉到無卡提款申請頁
  const toWithdrawPage = () => {
    history.push('/D003001');
  };

  // 檢查無卡提款狀態; 0=未申請, 1=已申請未開通, 2=已開通, 3=已註銷, 4=已失效, 5=其他
  const fetchCardlessStatus = async () => {
    const {code, data} = await getCardlessStatus();
    if (code === '0000') {
      const { cwdStatus } = data;
      const statusNumber = Number(cwdStatus);

      if (statusNumber === 2) {
        // 已開通
        toWithdrawPage();
      } else {
        // 未開通
        await showCustomPrompt({
          message: '很抱歉，您尚未開通無卡提款功能，無法使用此功能',
          onOk: () => closeFunc(),
          onClose: () => closeFunc(),
        });
      }
    } else {
      await showCustomPrompt({
        message: '發生錯誤，暫時無法使用此功能',
        onOk: () => closeFunc(),
      });
    }
  };

  useEffect(() => {
    fetchCardlessStatus();
  }, []);

  return (
    <Layout title="無卡提款">
      <CardLessATMWrapper />
    </Layout>
  );
};

export default CardLessATM;
