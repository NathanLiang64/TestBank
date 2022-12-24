import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import Layout from 'components/Layout/Layout';
import Accordion from 'components/Accordion';
import { FEIBSwitch } from 'components/elements';
import { startFunc, transactionAuth } from 'utilities/AppScriptProxy';
import { EditIcon } from 'assets/images/icons';

import { useDispatch } from 'react-redux';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { AuthCode } from 'utilities/TxnAuthCode';
import { FuncID } from 'utilities/FuncID';
import { showAnimationModal } from 'utilities/MessageModal';
import { getAccountsList } from 'utilities/CacheData';
import { useQLStatus } from 'hooks/useQLStatus';
import CardLessSettingWrapper from './T00400.style';

import { getStatus, activate } from './api';

const CardLessSetting = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const {QLResult, showUnbondedMsg} = useQLStatus();// 確認裝置綁定狀態
  const [cardLessStatus, setCardLessStatus] = useState();
  const [account, setAccount] = useState();
  const [isEnable, setEnable] = useState();

  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    // 確認無卡提款開通狀態
    const cardLessRes = await getStatus();
    setCardLessStatus(cardLessRes);
    setEnable(cardLessRes === '2');

    // 取得母帳戶的資訊。
    getAccountsList('M', (accounts) => setAccount(accounts[0]));

    dispatch(setWaittingVisible(false));
  }, []);

  const handleSwitchClick = async () => {
    if (QLResult) {
    // 若已經綁定
      const cwdStatus = cardLessStatus;
      if (cwdStatus === '0' || cwdStatus === '3' || cwdStatus === '4') {
      // 跳轉設定無卡提款密碼頁
        history.push('/T004001');
      } else {
      // 若是 1.已申請未開通 或是 2.已開通 狀態時需要先進行交易驗證
        dispatch(setWaittingVisible(true));
        const { result } = await transactionAuth(AuthCode.T00400);
        if (result) {
          const activateRes = await activate('');
          showAnimationModal({
            isSuccess: !!activateRes,
            successTitle: '設定成功',
            errorTitle: '設定失敗',
            errorDesc: '設定失敗',
          });

          setCardLessStatus('2');
          setEnable(true);
        }
        dispatch(setWaittingVisible(false));
      }
    } else showUnbondedMsg();
  };

  const handlePwdChange = () => (QLResult ? startFunc(FuncID.D00400) : showUnbondedMsg());

  return (
    <Layout title="無卡提款設定">
      <CardLessSettingWrapper>
        <div className="controlContainer">
          <div className="switchContainer">
            <div className="labelContainer">
              <p className="labelTxt">無卡提款</p>
              {isEnable && <p className="phoneNum">{account?.accountNo}</p>}
            </div>
            <FEIBSwitch checked={isEnable} onClick={handleSwitchClick} />
          </div>
          {isEnable && (
            <div className="mainBlock toChangePwd" onClick={handlePwdChange}>
              變更無卡提款密碼
              <EditIcon />
            </div>
          )}
        </div>
        <Accordion title="注意事項" space="both">
          <div className="dealContent">無卡提款設定服務條款</div>
        </Accordion>
      </CardLessSettingWrapper>
    </Layout>
  );
};

export default CardLessSetting;
