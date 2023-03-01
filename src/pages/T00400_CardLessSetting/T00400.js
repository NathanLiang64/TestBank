import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import Layout from 'components/Layout/Layout';
import Accordion from 'components/Accordion';
import { FEIBSwitch } from 'components/elements';
import { transactionAuth } from 'utilities/AppScriptProxy';
import { EditIcon } from 'assets/images/icons';

import { useDispatch } from 'react-redux';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { Func } from 'utilities/FuncID';
import { showAnimationModal } from 'utilities/MessageModal';
import { getAccountsList } from 'utilities/CacheData';
import { useQLStatus } from 'hooks/useQLStatus';
import { useNavigation } from 'hooks/useNavigation';
import { accountFormatter } from 'utilities/Generator';
import CardLessSettingWrapper from './T00400.style';

import { getStatus, activate } from './api';

/**
 * T00400 無卡提款設定
 */
const CardLessSetting = () => {
  const dispatch = useDispatch();
  const { startFunc } = useNavigation();
  const history = useHistory();

  const {QLResult, showUnbondedMsg} = useQLStatus();// 確認裝置綁定狀態
  const [cardLessStatus, setCardLessStatus] = useState();
  const [account, setAccount] = useState();
  const [isEnable, setEnable] = useState(false);

  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    // 確認無卡提款開通狀態
    const cardLessRes = await getStatus();
    setCardLessStatus(cardLessRes);
    setEnable(cardLessRes === 2);

    // 取得母帳戶的資訊。
    getAccountsList('M', (accounts) => setAccount(accounts[0]));

    dispatch(setWaittingVisible(false));
  }, []);

  const handleSwitchClick = async () => {
    if (QLResult) {
    // 若已經綁定
      const cwdStatus = cardLessStatus;
      if (cwdStatus !== 2) {
        // 非已開通狀態，跳轉設定無卡提款密碼頁
        history.push('/T004001');
      } else {
        // 已開通狀態
        const { result } = await transactionAuth(Func.T004.authCode);
        if (result) {
          dispatch(setWaittingVisible(true));
          const apiRs = await activate('');
          dispatch(setWaittingVisible(false));
          showAnimationModal({
            isSuccess: apiRs.isSuccess,
            successTitle: '設定成功',
            errorTitle: '設定失敗',
            errorDesc: '設定失敗',
          });
          setCardLessStatus(3); // 註銷成功後狀態代碼為 3-已註銷
          setEnable(false);
        }
      }
    } else showUnbondedMsg();
  };

  const handlePwdChange = () => (QLResult ? startFunc(Func.D004.id) : showUnbondedMsg());

  return (
    <Layout fid={Func.T004} title="無卡提款設定">
      <CardLessSettingWrapper>
        <div className="controlContainer">
          <div className="switchContainer">
            <div className="labelContainer">
              <p className="labelTxt">無卡提款</p>
              {isEnable && <p className="phoneNum">{accountFormatter(account?.accountNo, true)}</p>}
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
          <ol className="dealContent">
            <li>無卡提款交易限時15分鐘內有效，請於交易有效時間內，至本行提供無卡提款功能之ATM完成提款。若逾時請重新申請。(實際交易有效時間以本行系統時間為準)。</li>
            <li>提醒您，ATM提款時請務必確認您的存款餘額是否足夠，避免提款失敗。</li>
            <li>無卡提款密碼連續錯誤3次，即鎖住服務，須重新申請服務。</li>
          </ol>
        </Accordion>
      </CardLessSettingWrapper>
    </Layout>
  );
};

export default CardLessSetting;
