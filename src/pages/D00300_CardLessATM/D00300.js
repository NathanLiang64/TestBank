import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import { showCustomPrompt } from 'utilities/MessageModal';

import Layout from 'components/Layout/Layout';
import { FuncID } from 'utilities/FuncID';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { useNavigation } from 'hooks/useNavigation';
import { getStatus, getCardlessWdStatus } from './api';

const CardLessATM = () => {
  const dispatch = useDispatch();
  const { startFunc, closeFunc } = useNavigation();
  const history = useHistory();

  // 確認金融卡卡況以及無卡提款狀態
  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    // 確認金融卡是否已經開卡?
    const { status } = await getStatus();
    if (status !== 4) {
      await showCustomPrompt({
        message: '請先完成金融卡開卡以啟用無卡提款服務！',
        onOk: () => startFunc(FuncID.S00700),
        okContent: '立即開卡',
        onCancel: closeFunc,
        showCloseButton: true,
      });
    } else {
    // 檢查無卡提款狀態; 0=未申請, 1=已申請未開通, 2=已開通, 3=已註銷, 4=已失效, 5=其他
      const cwdStatus = await getCardlessWdStatus();
      if (cwdStatus === 2) history.push('/D003001');
      else {
        await showCustomPrompt({
          message: '愛方便的您, 怎能少了無卡提款服務, 快來啟用吧',
          onOk: () => startFunc(FuncID.T00400),
          onCancel: closeFunc,
          cancelContent: '下次再啟用',
          showCloseButton: false,
        });
      }
    }
    dispatch(setWaittingVisible(false));
  }, []);

  return <Layout title="無卡提款" />;
};

export default CardLessATM;
