/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

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
import { setDrawerVisible, setWaittingVisible } from 'stores/reducers/ModalReducer';
import { AuthCode } from 'utilities/TxnAuthCode';
import store from 'stores/store';
import { dateToString } from 'utilities/Generator';
import { getQuickLoginInfo } from './api';
import DrawerContent from './drawerContent';

/* Styles */
import QuickLoginSettingWrapper from './T00200.style';
import T00200AccordionContent from './T00200_accordionContent';

const QuickLoginSetting = () => {
  const [isBioActive, setIsBioActive] = useState(false);
  const [isPatternActive, setIsPatternActive] = useState(false);
  const [bindingDate, setBindingDate] = useState('');
  const [bindingDevice, setBindingDevice] = useState('');
  const [midPhone, setMidPhone] = useState('');

  const dispatch = useDispatch();

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
    // TODO: 下為測試用彈窗，正式上線前移除
    await showCustomPrompt({
      title: '綁定狀態結果(測試用彈窗)',
      message: JSON.stringify({
        result,
        message,
        QLStatus,
        QLType,
      }),
    });

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
            cancelClick={() => store.dispatch(setDrawerVisible(false))}
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
    const res = await transactionAuth(AuthCode.T00200.MODIFY, midPhone);

    if (res.result) {
      // 交易驗證成功
    }
  };

  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    await fetchQLStatus();
    await fetchLoginBindingInfo();

    dispatch(setWaittingVisible(false));
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
              <InformationList title="啟用日期" content={dateToString(bindingDate)} textColor="text-primary" />
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
          <T00200AccordionContent />
        </Accordion>
      </QuickLoginSettingWrapper>
    </Layout>
  );
};

export default QuickLoginSetting;
