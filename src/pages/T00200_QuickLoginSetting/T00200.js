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
  createQuickLogin,
  verifyQuickLogin,
  removeQuickLogin,
  transactionAuth,
  changePattern,
  showWaitting,
} from 'utilities/AppScriptProxy';
import {
  customPopup, showAnimationModal, showDrawer, showCustomPrompt, showError,
} from 'utilities/MessageModal';
import { setDrawerVisible, setWaittingVisible } from 'stores/reducers/ModalReducer';
import { Func } from 'utilities/FuncID';
import { dateToString } from 'utilities/Generator';
import { useNavigation } from 'hooks/useNavigation';
import { getQuickLoginInfo } from './api';
import DrawerContent from './drawerContent';

/* Styles */
import QuickLoginSettingWrapper from './T00200.style';
import T00200AccordionContent from './T00200_accordionContent';

const QuickLoginSetting = () => {
  const dispatch = useDispatch();
  const {closeFunc} = useNavigation();

  const [model, setModel] = useState({
    status: 0,
    boundDate: undefined,
    boundDevice: undefined,
    boundType: undefined,
    midMobile: null,
  });

  // 僅 1,已正常綁定 2,綁定但已鎖定 需標示為active
  const isBioActive = (model.status === 1 || model.status === 2) && model.boundType === 1;
  const isPatternActive = (model.status === 1 || model.status === 2) && model.boundType === 2;

  /** 生物辨識模式代碼 */
  const BioIdentiy = 1;

  /** 圖形辨識模式代碼 */
  const Pattern = 2;

  // 取得綁定資訊
  const fetchLoginBindingInfo = async () => {
    await getQLStatus(); // 要先查才能驗證？？？
    const apiRs = await getQuickLoginInfo();
    setModel({
      ...model,
      ...apiRs,
    });
    return apiRs;
  };

  /**
   * 解除快登綁定
   * @param {*} type 快登所使用驗證方式。(1. 生物辨識, 2.圖形辨識)
   */
  const removeSetting = async () => {
    const rs = await transactionAuth(Func.T002.authCode.UNSET);
    if (rs.result) {
      const { result, message } = await removeQuickLogin();
      const isSuccess = result;
      if (isSuccess) {
        model.status = 0;
        setModel({...model}); // 移除成功後，更新開關
      }

      // 顯示解除綁定結果
      await showAnimationModal({
        isSuccess,
        successTitle: '解除成功',
        successDesc: '',
        errorTitle: '解除失敗',
        errorCode: '',
        errorDesc: message,
      });
    }
  };

  // 檢查綁定狀態
  const checkSettingStatus = async () => {
    if (model.status !== 0 && model.boundType === 1) {
      await customPopup(
        '系統訊息',
        '生物辨識與圖形辨識僅能擇一使用，如欲使用圖形辨識服務，請先解除生物綁定',
      );
      return true;
    }
    if (model.status !== 0 && model.boundType === 2) {
      await customPopup(
        '系統訊息',
        '生物辨識與圖形辨識僅能擇一使用，如欲使用生物辨識服務，請先解除圖形綁定',
      );
      return true;
    }
    return false;
  };

  /**
   * 驗證設定結果並進行裝置認證，以完成綁定作業。
   * @param {*} type 快登所使用驗證方式。(1. 生物辨識, 2.圖形辨識)
   * @param {*} pwd 通過交易驗證後取得的密碼，此密碼已做過 E2EE 加密。
   */
  const verifySettingAndMID = async (type, pwd) => {
    // 通知 app 執行綁頂
    showWaitting(true);
    const { result, message } = await verifyQuickLogin(type, pwd);
    showWaitting(false);
    const isSuccess = result;

    if (isSuccess) {
      model.status = 1;
      setModel({ ...model }); // 設定成功後，更新開關
    }

    // 顯示綁定結果
    await showAnimationModal({
      isSuccess,
      successTitle: '設定成功',
      successDesc: '',
      errorTitle: '設定失敗',
      errorCode: '',
      errorDesc: message,
    });
    setDrawerVisible(false);
  };

  /**
   * 要求使用者以指定的驗證方式進行快登設定。
   * @param {*} type 快登所使用驗證方式。(1. 生物辨識, 2.圖形辨識)
   */
  const startSetting = async (type) => {
    const isBinded = await checkSettingStatus(); // 要先查 getQLStatus 才能驗證？？？
    if (isBinded) return;

    // 設定綁定資料成功進行交易驗證
    const { result, message } = await createQuickLogin(type);
    if (result) {
      const rs = await transactionAuth(Func.T002.authCode.SET, model.midMobile);
      if (rs.result) {
        // 交易驗證成功，開啟綁定 drawer，點擊確認進行 MID 驗證
        // NOTE 通過 MID 驗證才算是真正完成快登設定，目前二者是綁在一起的！
        await showDrawer(
          'APP裝置認證',
          <DrawerContent
            midPhone={model.midMobile}
            confirmClick={() => verifySettingAndMID(type, rs.netbankPwd)}
            cancelClick={() => dispatch(setDrawerVisible(false))}
          />,
        );
      }
    } else {
      await showError(message);
    }
  };

  /**
   * 變更圖形辨識
   */
  const handleChangePattern = async () => {
    const res = await transactionAuth(Func.T002.authCode.MODIFY);
    if (res.result) {
      // 交易驗證成功
      const {result, message} = await changePattern();
      // 顯示綁定結果
      await showAnimationModal({
        isSuccess: result,
        successTitle: '設定成功',
        successDesc: '',
        errorTitle: '設定失敗',
        errorCode: '',
        errorDesc: message,
      });
    }
  };

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    const apiRs = await fetchLoginBindingInfo();
    if (apiRs) {
      if (apiRs.status === 4) {
        // 本裝置已綁定其他帳號
        await showCustomPrompt({
          title: 'APP裝置認證錯誤',
          message: '本裝置已綁定他人帳號，請先解除原APP裝置認證或致電客服',
          onOk: closeFunc,
        });
      }
      if (!apiRs.midMobile) {
        // TODO 若沒有 非約轉 及 CIF 門號()，應詢問使用者是否立即進行「基本資料變更」的手機號碼設定。
      }
      // TODO 鎖住畫面，不可設定
    }
    dispatch(setWaittingVisible(false));
  }, []);

  return (
    <Layout fid={Func.T002} title="快速登入設定">
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
                      removeSetting(BioIdentiy);
                    } else {
                      startSetting(BioIdentiy);
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
                      removeSetting(Pattern);
                    } else {
                      startSetting(Pattern);
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
          // 僅 1,已正常綁定 2,綁定但已鎖定 需顯示資訊
          (model.status === 1 || model.status === 2) && (
            <div className="bindingInfo">
              <h1>已登錄裝置</h1>
              <InformationList title="啟用日期" content={dateToString(model.boundDate)} textColor="text-primary" />
              <InformationList title="裝置型號" content={model.boundDevice} textColor="text-primary" />
            </div>
          )
        }
        <div className="agreeTip">
          <p>提醒您：</p>
          <p>(1)本服務須關閉Wi-Fi，使用手機行動網路。</p>
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
