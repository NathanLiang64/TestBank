import { useState } from 'react';
import { useCheckLocation, usePageInfo } from 'hooks';

/* Elements */
import {
  FEIBSwitch,
} from 'components/elements';

/* Styles */
import NoticeSettingWrapper from './noticeSetting.style';

const NoticeSetting = () => {
  const [communityNoti, setCommunityNoti] = useState(true);
  const [normalNoti, setNormalNoti] = useState(true);
  const [securityNoti, setSecurityNoti] = useState(true);
  const [foreignCurrencyNoti, setForeignCurrencyNoti] = useState(true);
  const [nightNoti, setNightNoti] = useState(true);

  const handleSwitchChange = (type) => {
    switch (type) {
      case 'community':
        setCommunityNoti(!communityNoti);
        break;
      case 'normal':
        setNormalNoti(!normalNoti);
        break;
      case 'security':
        setSecurityNoti(!securityNoti);
        break;
      case 'foreignCurrency':
        setForeignCurrencyNoti(!foreignCurrencyNoti);
        break;
      case 'nightNotify':
        setNightNoti(!nightNoti);
        break;
      default:
        break;
    }
  };

  useCheckLocation();
  usePageInfo('/api/noticeSetting');

  return (
    <NoticeSettingWrapper>
      <div className="settingItem">
        <div className="settingLabel">
          <span className="main">社群通知</span>
          <span className="sub">社群帳本/社群圈回饋</span>
        </div>
        <div className="switchItem">
          <FEIBSwitch
            checked={communityNoti}
            onChange={() => handleSwitchChange('community')}
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
            checked={normalNoti}
            onChange={() => handleSwitchChange('normal')}
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
            checked={securityNoti}
            onChange={() => handleSwitchChange('security')}
          />
        </div>
      </div>
      <div className="settingItem">
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
            checked={nightNoti}
            onChange={() => handleSwitchChange('nightNotify')}
          />
        </div>
      </div>
    </NoticeSettingWrapper>
  );
};

export default NoticeSetting;
