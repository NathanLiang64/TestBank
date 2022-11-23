/* eslint-disable no-unused-vars */
import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { closeFunc, startFunc } from 'utilities/AppScriptProxy';
import { showCustomPrompt } from 'utilities/MessageModal';
import { getCardlessStatus } from 'pages/D00300_CardLessATM/api';

/* Elements */
import Layout from 'components/Layout/Layout';

/* Styles */
import { getStatus } from 'pages/S00800_LossReissue/api';
import { FuncID } from 'utilities/FuncID';
import { useDispatch } from 'react-redux';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import CardLessATMWrapper from './D00300.style';

const CardLessATM = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  // 跳轉到無卡提款申請頁
  const toWithdrawPage = () => {
    history.push('/D003001');
  };

  // 檢查無卡提款狀態; 0=未申請, 1=已申請未開通, 2=已開通, 3=已註銷, 4=已失效, 5=其他
  const fetchCardlessStatus = async () => {
    dispatch(setWaittingVisible(true));

    try {
      // 確認金融卡是否已經開卡?
      const {status} = await getStatus();
      if (status !== 4) {
        await showCustomPrompt({
          message: '請先完成金融卡開卡以啟用無卡提款服務！',
          onOk: () => startFunc(FuncID.S00700),
          okContent: '立即開卡',
          onCancel: closeFunc,
          onClose: closeFunc,
        });
      } else {
        // 確認無卡提款服務是否已開通?
        const { cwdStatus } = await getCardlessStatus();
        const statusNumber = Number(cwdStatus);

        if (statusNumber === 2) {
        // 已開通
          toWithdrawPage();
        } else {
        // 未開通
          await showCustomPrompt({
            message: '愛方便的您, 怎能少了無卡提款服務, 快來啟用吧',
            onOk: () => startFunc(FuncID.T00400),
            onClose: () => startFunc(FuncID.T00400),
          });
        }
      }
    } catch (err) {
      await showCustomPrompt({
        message: '發生錯誤，暫時無法使用此功能',
        onOk: closeFunc,
        onClose: closeFunc,
      });
    }
    dispatch(setWaittingVisible(false));
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
