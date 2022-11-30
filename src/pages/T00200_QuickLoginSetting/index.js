/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';

/* Elements */
import Layout from 'components/Layout/Layout';
import {
  FEIBSwitch,
  FEIBSwitchLabel,
} from 'components/elements';
import Accordion from 'components/Accordion';
import InformationList from 'components/InformationList';
import { EditRounded } from '@material-ui/icons';
import {
  getQLStatus,
  regQLfeature,
  regQL,
  delQL,
  closeFunc,
  transactionAuth,
} from 'utilities/AppScriptProxy';
import {
  customPopup, showAnimationModal, showDrawer, showCustomPrompt,
} from 'utilities/MessageModal';
import { setDrawerVisible } from 'stores/reducers/ModalReducer';
import { AuthCode } from 'utilities/TxnAuthCode';
import { getQuickLoginInfo } from './api';
import DrawerContent from './drawerContent';

/* Styles */
import QuickLoginSettingWrapper from './quickLoginSetting.style';

const QuickLoginSetting = () => {
  const [isBioActive, setIsBioActive] = useState(false);
  const [isPatternActive, setIsPatternActive] = useState(false);
  const [bindingDate, setBindingDate] = useState('');
  const [bindingDevice, setBindingDevice] = useState('');
  const [midPhone, setMidPhone] = useState('');

  // 取得綁定資訊
  const fetchLoginBindingInfo = async () => {
    const { boundDate, boundDevice, midPhoneNo } = await getQuickLoginInfo();
    if (boundDate) {
      setBindingDate(boundDate);
    }
    if (boundDevice) {
      setBindingDevice(boundDevice);
    }
    if (midPhoneNo) {
      setMidPhone(midPhoneNo);
    }
  };

  // 解除快登綁定
  const callAppDelQL = async (type) => {
    const rs = await transactionAuth(AuthCode.T00200.UNSET);
    console.log('交易驗證結果:', JSON.stringify(rs));
    // customPopup(
    //   '系統訊息',
    //   `解除快速綁定交易驗證測試結果：${JSON.stringify(rs)}`,
    // );
    if (rs.result) {
      const { result, message } = await delQL();
      const isSuccess = result === 'true';
      // 顯示解除綁定結果
      showAnimationModal({
        isSuccess,
        successTitle: '解除成功',
        successDesc: '',
        errorTitle: '解除失敗',
        errorCode: '',
        errorDesc: message,
      });
      if (type === '1' && isSuccess) {
        setIsBioActive(false);
      }
      if (type === '2' && isSuccess) {
        setIsPatternActive(false);
      }
    }
    // else {
    //   await showCustomPrompt({
    //     message: `解除快速綁定交易驗證測試結果：${JSON.stringify(rs)}`,
    //     onOk: () => closeFunc(),
    //     onCancel: () => closeFunc(),
    //     onClose: () => closeFunc(),
    //   });
    // }
  };

  // 檢查綁定狀態
  const checkSettingStatus = () => {
    if (isBioActive && !isPatternActive) {
      customPopup(
        '系統訊息',
        '生物辨識與圖形辨識僅能擇一使用，如欲使用圖形辨識服務，請先解除生物綁定',
      );
      return true;
    }
    if (!isBioActive && isPatternActive) {
      customPopup(
        '系統訊息',
        '生物辨識與圖形辨識僅能擇一使用，如欲使用生物辨識服務，請先解除圖形綁定',
      );
      return true;
    }
    return false;
  };

  // 取得綁定狀態
  const fetchQLStatus = async () => {
    const {
      result,
      message,
      QLStatus,
      QLType,
    } = await getQLStatus();
    console.log('web取得綁定狀態結果', JSON.stringify({
      result,
      message,
      QLStatus,
      QLType,
    }));

    // 回傳成功
    if (result === 'true') {
      const status = QLType === '1';
      switch (QLStatus) {
        case '1':
        case '2':
          // 已綁定
          setIsBioActive(status);
          setIsPatternActive(!status);
          break;
        case '4':
          // 本裝置已綁定其他帳號
          showCustomPrompt({
            title: 'APP裝置認證錯誤',
            message: '本裝置已綁定他人帳號，請先解除原APP裝置認證或致電客服',
            onOk: () => {},
          });
          break;
        default:
          // 未綁定 | 已在其它裝置綁定
          setIsBioActive(false);
          setIsPatternActive(false);
          break;
      }
    }

    // 回傳失敗
    if (result === 'false') {
      customPopup(
        '系統訊息',
        message,
      );
    }
  };

  // 進行裝置綁定
  const callAppBindRegQL = async (type, pwd) => {
    // 通知 app 執行綁頂
    const { result, message } = await regQL(type, pwd);
    const isSuccess = result === 'true';
    // 顯示綁定結果
    showAnimationModal({
      isSuccess,
      successTitle: '設定成功',
      successDesc: '',
      errorTitle: '設定失敗',
      errorCode: '',
      errorDesc: message,
    });

    setDrawerVisible(false);

    // 設定 Switch 狀態
    if (type === '1') {
      setIsBioActive(isSuccess);
    }
    if (type === '2') {
      setIsPatternActive(isSuccess);
    }
    fetchLoginBindingInfo();
  };

  // 設定生物或圖形辨識, 1: 生物辨識, 2: 圖形辨識
  const callAppSetBioOrPattern = async (type) => {
    const isBinded = checkSettingStatus();
    if (isBinded) return;
    const { result, message } = await regQLfeature(type);
    console.log('設定快登資料結果:', JSON.stringify(result));

    // 設定綁定資料成功進行交易驗證
    if (result === 'true') {
      const rs = await transactionAuth(AuthCode.T00200.SET, midPhone);
      console.log('交易驗證結果:', JSON.stringify(rs));
      if (rs.result) {
        // 交易驗證成功，開啟綁定 drawer，點擊確認進行 MID 驗證
        showDrawer(
          'APP 手機裝置綁定',
          <DrawerContent
            midPhone={midPhone}
            confirmClick={() => callAppBindRegQL(type, rs?.netbankPwd)}
          />,
        );
      }
    }

    if (result === 'false') {
      customPopup(
        '系統訊息',
        message,
      );
    }
  };

  // 變更圖形辨識
  const handleChangePattern = async () => {
    console.log('T00200 handleChangePattern');

    const res = await transactionAuth(AuthCode.T00200.MODIFY, midPhone);

    if (res.result === true) {
      // 成功
    } else {
      // 失敗
      customPopup(
        '系統訊息',
        res.message,
      );
    }
  };

  useEffect(() => {
    fetchQLStatus();
    fetchLoginBindingInfo();
  }, []);

  return (
    <Layout title="快速登入設定">
      <QuickLoginSettingWrapper>
        <div className="tip">設定後就能快速登入囉！（僅能擇一）</div>
        <div>
          <div className="switchContainer">
            <FEIBSwitchLabel
              control={(
                <FEIBSwitch
                  checked={isBioActive}
                  onClick={() => {
                    if (isBioActive) {
                      callAppDelQL('1');
                    } else {
                      callAppSetBioOrPattern('1');
                    }
                  }}
                />
              )}
              label="生物辨識設定"
            />
          </div>
          <div className="switchContainer">
            <FEIBSwitchLabel
              control={(
                <FEIBSwitch
                  checked={isPatternActive}
                  onClick={() => {
                    if (isPatternActive) {
                      callAppDelQL('2');
                    } else {
                      callAppSetBioOrPattern('2');
                    }
                  }}
                />
              )}
              label="圖形辨識設定"
            />
            <div className={`mainBlock ${!isPatternActive && 'hide'}`} onClick={() => handleChangePattern()}>
              <div className="text">
                圖形辨識變更
              </div>
              <EditRounded />
            </div>
          </div>
        </div>
        {
          (isBioActive || isPatternActive) && (
            <div className="bindingInfo">
              <h1>已登錄裝置</h1>
              <InformationList title="啟用日期" content={bindingDate} textColor="text-primary" />
              <InformationList title="裝置型號" content={bindingDevice} textColor="text-primary" />
            </div>
          )
        }
        <div className="agreeTip">
          <p>提醒您：</p>
          <p>(1)本服務須關閉WiFi，使用手機行動網路。</p>
          <p>(2)啟用快速登入將同時進行APP裝置認證。</p>
          <p>
            (3)如需取消APP裝置認證，請關閉快速登入設定或致電本行客服。
          </p>
        </div>
        <Accordion>
          <ol>
            <li>每個帳號僅能認證一個行動裝置，請您確認目前使用的SIM卡門號為留存於本行之手機號碼，並具有上網功能。</li>
            <li>進行SIM卡認證前，請您關閉WiFi並使用手機行動網路(4G/5G)連線；使用雙卡機者，請以上網使用的SIM卡進行驗證。</li>
            <li>請您確認已關閉手機裝置的VPN、防火牆軟體服務。</li>
            <li>如您的帳號要認證一個新的裝置，須先於原裝置解除認證，始能進行新手機裝置認證。</li>
            <li>若於完成APP裝置認證後移除APP並重新安裝，則須請您再次進行APP手機裝置認證，方能使用相關功能。</li>
            <li>請您確認擬啟用「APP裝置認證」之行動裝置僅由使用者本人使用，再啟用本服務，並請勿於已破解系統權限之行動裝置上使用本服務。提醒您應妥善保管行動裝置、勿交付他人使用，建議您啟用本服務前，應先設定行動裝置之「螢幕鎖定密碼」或「開機密碼」，以確保帳戶及交易安全。</li>
            <li>啟用快速登入將同時進行APP裝置認證，如需取消裝置認證，請關閉快速登入設定或致電本行客服。</li>
          </ol>
        </Accordion>
      </QuickLoginSettingWrapper>
    </Layout>
  );
};

export default QuickLoginSetting;
