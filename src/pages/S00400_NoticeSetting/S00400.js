import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { setModalVisible, setWaittingVisible } from 'stores/reducers/ModalReducer';

/* Elements */
import Layout from 'components/Layout/Layout';
import {
  FEIBButton,
  FEIBSwitch,
} from 'components/elements';
import Accordion from 'components/Accordion';

/* API */
import { closeFunc, transactionAuth } from 'utilities/AppScriptProxy';
import { showCustomPrompt, showError } from 'utilities/MessageModal';
import store from 'stores/store';
import {
  queryPushSetting, bindPushSetting, queryPushBindMock, updatePushBindMock,
} from './api';

/* Styles */
import NoticeSettingWrapper from './S00400.style';
import S00400AccordionContent from './S00400_accordionContent';

/**
 * S00400 訊息通知設定
 */
const S00400 = () => {
  const dispatch = useDispatch();

  const [isPushBind, setIsPushBind] = useState(false);
  const [model, setModel] = useState({
    communityNotice: false,
    boardNotice: false,
    securityNotice: false,
    nightMuteNotice: false,
  });

  const authCode = 0x30;

  // 更新通知設定
  const updateNotiSetting = async (modelParam) => {
    const param = {
      communityNotice: modelParam.communityNotice ? 'Y' : 'N',
      boardNotice: modelParam.boardNotice ? 'Y' : 'N',
      securityNotice: modelParam.securityNotice ? 'Y' : 'N',
      nightMuteNotice: modelParam.nightMuteNotice ? 'Y' : 'N',
    };

    if (!isPushBind) {
      console.log('S00400 updateNotiSetting !isPushBind');
      const bindResponse = await bindPushSetting(param);
      if (bindResponse) {
        setModel({ ...modelParam });
      }

      return;
    }

    setModel({ ...modelParam });
  };

  // 同意開啟通知設定
  const handlePushBind = async () => {
    console.log('S00400 handleTurnOnNotice');

    // 網銀密碼／雙因子驗證
    const verifyResult = await transactionAuth(authCode);
    console.log('S00400 handlePushBind() verifyPWD/2FA', verifyResult);

    if (!verifyResult.result) {
      console.log('S00400 handlePushBind() verifyPWD/2FA failed message: ', verifyResult);
      await showError(verifyResult.message);
      return;
    }

    console.log('S00400 handlePushBind() verifyPWD/2FA succeed');
    const updatePushBindResult = await updatePushBindMock(); // DEBUG: mock回傳判斷
    if (updatePushBindResult.code !== '0000') {
      await showError(updatePushBindResult.message);
      return;
    }
    setIsPushBind(true);
  };

  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    /* 檢查有無同意過推播 */
    const queryIsOnResponse = await queryPushBindMock(); // DEBUG: 回傳為mock
    if (queryIsOnResponse === false) {
      showCustomPrompt({
        title: '系統訊息',
        message: '您尚未設定「訊息通知」功能，是否立即設定？',
        onOk: () => store.dispatch(setModalVisible(false)),
        onCancel: () => closeFunc(),
      });
    }

    setIsPushBind(queryIsOnResponse);

    const response = await queryPushSetting();
    setModel({
      communityNotice: response.communityNotice === 'Y',
      boardNotice: response.boardNotice === 'Y',
      securityNotice: response.securityNotice === 'Y',
      nightMuteNotice: response.nightMuteNotice === 'Y',
    });
    // if (!response) {
    //   // 尙未完成行動裝置綁定
    //   // TODO 詢是否立即綁定。
    //   await closeFunc();
    // } else {
    //   setModel({
    //     communityNotice: response.communityNotice === 'Y',
    //     boardNotice: response.boardNotice === 'Y',
    //     securityNotice: response.securityNotice === 'Y',
    //     nightMuteNotice: response.nightMuteNotice === 'Y',
    //   });
    // }

    dispatch(setWaittingVisible(false));
  }, []);

  return (
    <Layout title="訊息通知設定">
      <NoticeSettingWrapper>
        <div className="settingItem">
          <div className="settingLabel">
            <span className="main">社群通知</span>
            <span className="sub">社群帳本/社群圈回饋</span>
          </div>
          <div className="switchItem">
            <FEIBSwitch
              checked={model.communityNotice}
              onChange={(e, checked) => {
                const modelParam = {
                  ...model,
                  communityNotice: checked,
                };
                updateNotiSetting(modelParam);
              }}
            />
          </div>
        </div>
        <div className="settingItem">
          <div className="settingLabel">
            <span className="main">公告通知</span>
            <span className="sub">活動優惠/權益變更/新服務/系統停機</span>
          </div>
          <div className="switchItem">
            <FEIBSwitch
              checked={model.boardNotice}
              onChange={(e, checked) => {
                const modelParam = {
                  ...model,
                  boardNotice: checked,
                };
                updateNotiSetting(modelParam);
              }}
            />
          </div>
        </div>
        <div className="settingItem">
          <div className="settingLabel">
            <span className="main">安全通知</span>
            <span className="sub">登入</span>
          </div>
          <div className="switchItem">
            <FEIBSwitch
              checked={model.securityNotice}
              onChange={(e, checked) => {
                const modelParam = {
                  ...model,
                  securityNotice: checked,
                };
                updateNotiSetting(modelParam);
              }}
            />
          </div>
        </div>
        {/* <div className="settingItem">
          <div className="settingLabel">
            <span className="main">外幣到價通知</span>
            <span className="sub">美金/澳幣/日圓</span>
          </div>
          <div className="switchItem">
            <FEIBSwitch
              checked={foreignCurrencyNoti}
              onChange={() => handleSwitchChange('foreignCurrency')}
            />
          </div>
        </div> */}
        <div className="settingItem">
          <div className="settingLabel">
            <span className="main">夜間通知靜音</span>
            <span className="sub">
              夜間21:00~隔日9:00
              <br />
              為確保交易安全，帳務相關通知不受此限
            </span>
          </div>
          <div className="switchItem">
            <FEIBSwitch
              checked={model.nightMuteNotice}
              onChange={(e, checked) => {
                const modelParam = {
                  ...model,
                  nightMuteNotice: checked,
                };
                updateNotiSetting(modelParam);
              }}
            />
          </div>
        </div>
        {!isPushBind && (
        <div className="term_container">
          <Accordion className="accordion">
            <S00400AccordionContent className="accordion_content" />
          </Accordion>
          <FEIBButton onClick={() => handlePushBind()}>
            同意條款並送出
          </FEIBButton>
        </div>
        )}

      </NoticeSettingWrapper>
    </Layout>
  );
};

export default S00400;
