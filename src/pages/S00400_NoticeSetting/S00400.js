import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';

/* Elements */
import Layout from 'components/Layout/Layout';
import { FEIBButton, FEIBSwitch} from 'components/elements';
import Accordion from 'components/Accordion';

/* API */
import { queryPushBind, transactionAuth, updatePushBind } from 'utilities/AppScriptProxy';
import { showCustomPrompt } from 'utilities/MessageModal';

import { Func } from 'utilities/FuncID';
import { queryPushSetting, bindPushSetting } from './api';

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
    communityNotice: true,
    boardNotice: true,
    securityNotice: true,
    nightMuteNotice: true,
  });

  useEffect(async () => {
    // 檢查有無同意過推播
    const { PushBindStatus } = await queryPushBind();
    setIsPushBind(PushBindStatus);

    if (!PushBindStatus) {
      await showCustomPrompt({
        message:
          '您尚未同意「訊息通知使用條款」，請於設定完成後點選「同意」，立即開啟訊息通知功能。',
        okContent: '確認',
        showCloseButton: false,
      });
    } else {
      dispatch(setWaittingVisible(true));
      const settingResponse = await queryPushSetting();
      dispatch(setWaittingVisible(false));
      setModel(settingResponse);
    }
  }, []);

  // 同意開啟通知設定
  const handlePushBind = async () => {
    const { result } = await transactionAuth(Func.S004.authCode); // 網銀密碼／雙因子驗證
    if (!result) return;

    dispatch(setWaittingVisible(true));
    await updatePushBind();
    const { isSuccess, setting } = await bindPushSetting({
      communityNotice: 'Y',
      boardNotice: 'Y',
      securityNotice: 'Y',
      nightMuteNotice: 'Y',
    });
    dispatch(setWaittingVisible(false));

    if (!isSuccess) return;
    setModel(setting);
    setIsPushBind(true);
  };

  // 更新推播設定
  const onSwitchChange = (propertyName) => async (_, checked) => {
    if (!isPushBind) return;
    const modelParam = { ...model, [propertyName]: checked };
    const param = Object.keys(modelParam).reduce((acc, cur) => {
      acc[cur] = modelParam[cur] ? 'Y' : 'N';
      return acc;
    }, {});

    dispatch(setWaittingVisible(true));
    const { isSuccess, setting } = await bindPushSetting(param);
    dispatch(setWaittingVisible(false));
    if (isSuccess) setModel(setting);
  };

  return (
    <Layout fid={Func.S004} title="訊息通知設定">
      <NoticeSettingWrapper isPushBind={isPushBind}>
        <div className="settingItem">
          <div className="settingLabel">
            <span className="main">社群通知</span>
            <span className="sub">社群帳本/社群圈回饋</span>
          </div>
          <div className="switchItem">
            <FEIBSwitch
              checked={model.communityNotice}
              onChange={onSwitchChange('communityNotice')}
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
              onChange={onSwitchChange('boardNotice')}
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
              onChange={onSwitchChange('securityNotice')}
            />
          </div>
        </div>
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
              onChange={onSwitchChange('nightMuteNotice')}
            />
          </div>
        </div>
        {!isPushBind && (
          <div className="term_container">
            <Accordion
              className="accordion"
              space="both"
              title="訊息通知使用條款"
            >
              <S00400AccordionContent className="accordion_content" />
            </Accordion>
            <FEIBButton onClick={handlePushBind}>同意條款並送出</FEIBButton>
          </div>
        )}
      </NoticeSettingWrapper>
    </Layout>
  );
};

export default S00400;
