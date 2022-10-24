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
    customPopup(
      '系統訊息',
      '解除快速綁定 workflow 測試',
    );
    const code = 0x20;
    const rs = await transactionAuth(code);
    console.log('交易驗證結果:', JSON.stringify(rs));
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
    } else {
      await showCustomPrompt({
        message: `解除快速綁定交易驗證測試結果：${JSON.stringify(rs)}`,
        onOk: () => closeFunc(),
        onCancel: () => closeFunc(),
        onClose: () => closeFunc(),
      });
    }
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
      // 未綁定
      if (QLStatus === '0') {
        setIsBioActive(false);
        setIsPatternActive(false);
      }
      // 已綁定
      if (QLStatus === '1' || QLStatus === '2') {
        const status = QLType === '1';
        setIsBioActive(status);
        setIsPatternActive(!status);
      }
      // 已綁定帳號或裝置
      if (QLStatus === '3' || QLStatus === '4') {
        customPopup(
          '已裝置綁定',
          '您已進行裝置綁定，請至原裝置解除綁定或致電客服',
        );
      }
    }

    // 回傳失敗
    if (result === 'false') {
      customPopup(
        '系統訊息',
        message,
        () => {
          closeFunc();
        },
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
      const code = 0x17;
      const rs = await transactionAuth(code, midPhone);
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
        () => {
          closeFunc();
        },
      );
    }
  };

  useEffect(() => {
    fetchQLStatus();
    fetchLoginBindingInfo();
  }, []);

  return (
    <Layout title="快速登入設定test">
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
            <div className={`mainBlock ${!isPatternActive && 'hide'}`} onClick={() => {}}>
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
              <InformationList title="啟用日期" content={bindingDate} />
              <InformationList title="裝置型號" content={bindingDevice} />
            </div>
          )
        }
        <div className="agreeTip">
          <p>提醒您：</p>
          <p>(1)本服務須使用手機行動網路進行認證。</p>
          <p>(2)啟用快速登入將同時進行裝置綁定，且同意以下使用條款。</p>
          <p>(3)如需取消裝置綁定，請關閉快速登入設定或致電本行客服，謝謝。</p>
        </div>
        <Accordion title="使用條款">
          <ol>
            <li>本人同意與遠東商銀約定以本手機做為登入遠東商銀行動銀行APP時身分認證之用。爾後欲取消約定時，將由本人登入後至「服務設定&gt;圖形密碼登入設定/變更/取消」功能中設定。</li>
            <li>為保障使用安全，本人以圖形密碼登入後僅查詢帳戶相關資料，如需執行交易類功能，將於交易過程中另行輸入網路銀行密碼。</li>
            <li>圖形密碼登入連續三次錯誤時，系統將鎖住該功能，如欲重新使用，本人應於APP首頁以身分證字號、使用者代碼、網銀密碼登入後，進行解鎖。</li>
            <li>圖形密碼請設定6~12個點(可重覆)。</li>
            <li>本功能只提供本人之一台手機中設定，如於本人之其他手機中設定，則原手機設定將自動解除。</li>
            <li>如果手機重置或重新安裝APP時，需要重新設定本功能。</li>
          </ol>
        </Accordion>
      </QuickLoginSettingWrapper>
    </Layout>
  );
};

export default QuickLoginSetting;
