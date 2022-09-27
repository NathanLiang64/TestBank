import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';

/* Elements */
import Layout from 'components/Layout/Layout';
import {
  FEIBSwitch,
} from 'components/elements';

/* API */
import { closeFunc } from 'utilities/AppScriptProxy';
import { queryPushSetting, bindPushSetting } from './api';

/* Styles */
import NoticeSettingWrapper from './noticeSetting.style';

const NoticeSetting = () => {
  const dispatch = useDispatch();

  const [model, setModel] = useState({
    communityNotice: false,
    boardNotice: false,
    securityNotice: false,
    nightMuteNotice: false,
  });

  // 更新通知設定
  const updateNotiSetting = async (modelParam) => {
    const param = {
      communityNotice: modelParam.communityNotice ? 'Y' : 'N',
      boardNotice: modelParam.boardNotice ? 'Y' : 'N',
      securityNotice: modelParam.securityNotice ? 'Y' : 'N',
      nightMuteNotice: modelParam.nightMuteNotice ? 'Y' : 'N',
    };
    const bindResponse = await bindPushSetting(param);
    if (bindResponse) {
      setModel({ ...modelParam });
    }
  };

  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    const response = await queryPushSetting();
    if (!response) {
      // 尙未完成行動裝置綁定
      // TODO 詢是否立即綁定。
      await closeFunc();
    } else {
      setModel({
        communityNotice: response.communityNotice === 'Y',
        boardNotice: response.boardNotice === 'Y',
        securityNotice: response.securityNotice === 'Y',
        nightMuteNotice: response.nightMuteNotice === 'Y',
      });
    }

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
      </NoticeSettingWrapper>
    </Layout>
  );
};

export default NoticeSetting;
