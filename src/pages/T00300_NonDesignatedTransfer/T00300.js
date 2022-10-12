/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';

/* Elements */
import Layout from 'components/Layout/Layout';
import {
  FEIBInput, FEIBInputLabel, FEIBSwitch, FEIBSwitchLabel,
} from 'components/elements';
import Accordion from 'components/Accordion';
import theme from 'themes/theme';
import EditIcon from 'assets/images/icons/editIcon.svg';
import { closeDrawer, showAnimationModal, showDrawer } from 'utilities/MessageModal';
import { useHistory } from 'react-router';
import {
  bifactorVerify, checkDeviceBindingStatus, getNonDesignatedTransferData, MIDVerify,
} from './api';

/* Styles */
import T00300Wrapper from './T00300.style';
import T00300AccordionContent from './T00300_accordionContent';
import T00300DrawerContent from './T00300_drawerContent';
import T00300OTPDrawerContent from './T00300_OTPDrawer';

/**
 * T00300 非約轉設定
 */
const T00300 = () => {
  const [model, setModel] = useState({});
  const history = useHistory();

  /**
   * 錯誤訊息
   * @param {code} code number (failureCode)
   * @param {errMsg} errMsg string?
   * @returns string
   */
  const failureMessage = (code, errMsg) => {
    switch (code) {
      case 1: // 無裝置綁定
        return '無裝置綁定，請進行裝置綁定設定或致電客服。';
      case 2: // 網銀密碼驗證失敗（驗證2次未過）
        return '網銀密碼驗證失敗，請重新執行或致電客服。';
      case 3: // 簡訊OTP驗證失敗（驗證3次未過）
        return '簡訊OTP驗證失敗，請重新執行或致電客服。';
      case 4: // MID驗證失敗（手機門號與SIM卡認證失敗）
        return '手機門號與SIM卡認證失敗，請使用手機行動網路，重新執行或致電客服。';
      default: // 其他錯誤
        return `錯誤代碼: ${errMsg}，系統忙碌中，請重新執行或致電客服。`;
    }
  };

  /**
   * 失敗畫面
   * @param {code} code number (failureCode)
   * @param {errMsg} errMsg string?
   */
  const onFailure = (code, errMsg) => {
    console.log('T00300 onFailure() errMsg: ', errMsg);
    showAnimationModal({
      isSuccess: false,
      errorTitle: '設定失敗',
      errorDesc: failureMessage(code, errMsg),
      onClose: history.replace('/T00300'),
    });
  };

  /**
   * 成功畫面
   */
  const onSuccess = () => {
    showAnimationModal({
      isSuccess: true,
      successTitle: '設定成功',
      onClose: history.replace('/T00300'),
    });
  };

  const handleOTPConfirmed = async (result) => {
    console.log('T00300 handleOTPConfirmed() result: ', result);

    /* OTP驗證 通過：MID驗證 ｜ 失敗：失敗畫面 */
    if (result.code === 1) {
      // MID驗證
      const resultMID = await MIDVerify();
      console.log('T00300 handleOTPConfirmed() resultMID: ', resultMID);

      if (resultMID.code === 1) {
        onSuccess();
      } else {
        onFailure(resultMID.code === 0 ? 4 : 5, result.msg);
      }
    } else {
      // 失敗畫面
      onFailure(result.code === 0 ? 3 : 5, result.msg);
    }
  };

  /**
   * OTP驗證Drawer
   */
  const OTPVerifyDrawer = () => {
    console.log('T00300 OTPVerifyDrawer()');
    showDrawer(
      'OTP驗證',
      <T00300OTPDrawerContent mobile={model.mobile} handleConfirm={handleOTPConfirmed} />,
    );
  };

  /**
   * Bottom Drawer 確認按鈕行為
   * @param {data} data {isEdit, data: {mobileNumber}}
   */
  const handleDrawerConfirm = async (data) => {
    console.log('T00300 handleDrawerConfirm() data:', data);

    if (!data.isEdit) {
      // 申請流程：雙因子驗證
      const result = await bifactorVerify(0);

      if (result.code !== 1) {
        /* 失敗頁面: 不通過 -> failureCode: 0, 其他原因 -> failureCode: 5 */
        onFailure(result.code === 0 ? 2 : 5, result.msg);

        return;
      }

      /* 成功頁面 */
      onSuccess();
    } else {
      // 修改流程：OTP 驗證
      OTPVerifyDrawer();
    }
  };

  const handleDrawerCancel = () => {
    console.log('T00300 handleDrawerCancel()');
    closeDrawer();
  };

  /**
   * 非約轉交易門號 Drawer
   * @param {isEdit} isEdit boolean: 非約轉交易門號 Drawer 內容
   */
  const mobileNumberSettingDrawer = (isEdit) => {
    console.log('T00300 mobileNumberSettingDrawer()');

    showDrawer(
      '非約轉交易門號',
      <T00300DrawerContent
        isEdit={isEdit}
        mobile={model.mobile}
        handleConfirm={(data) => handleDrawerConfirm(data)}
        handleCancel={() => handleDrawerCancel()}
      />,
    );
  };

  /**
   * 申請流程
   */
  const handleApply = () => {
    console.log('T00300 handleApply()');

    /* 打開drawer：input 不可編輯 */
    mobileNumberSettingDrawer(false);
  };

  /**
   * 註銷流程
   */
  const handleCancel = async () => {
    console.log('T00300 handleCancel()');

    /**
     * 雙因子驗證
     * 成功：成功頁面
     * 失敗：failureCode: 2
     */
    const result = await bifactorVerify(true);

    if (result.code !== 1) {
      onFailure(result.code === 0 ? 2 : 5, result.msg);

      return;
    }
    onSuccess();
  };

  /* 編輯流程 */
  const handleEdit = () => {
    console.log('T00300 handleEdit()');

    /* 打開drawer：input 可編輯 */
    mobileNumberSettingDrawer(true);
  };

  /**
   * 點擊開關
   */
  const handleSwitchOnTrigger = async () => {
    console.log('T00300 handleSwitchOnTrigger() checkDeviceBindingStatus(): ', await checkDeviceBindingStatus(model.QLStatus));

    /**
     * 檢查裝置綁定狀態
     * 否 -> failureCode: 1
     * 是 ->
     *  model.originalStatus === 0 -> Close流程
     *  其餘走 申請流程
     */
    if (!await checkDeviceBindingStatus(model.QLStatus)) {
      // failureCode: 1, return
      onFailure(1);

      return;
    }

    if (model.originalStatus === 0) {
      // 註銷流程
      handleCancel();
    } else {
      // 申請流程
      handleApply();
    }
  };

  /**
   * 點擊鉛筆
   */
  const handleEditOnClick = async () => {
    console.log('T00300 handleEditOnClick() checkDeviceBindingStatus(): ', await checkDeviceBindingStatus(model.QLStatus));

    /**
     * 檢查裝置綁定狀態
     * 否 -> failureCode: 1
     * 是 ->
     *  走 編輯流程
     */
    if (!await checkDeviceBindingStatus(model.QLStatus)) {
      // failureCode: 1, return
      showAnimationModal({
        isSuccess: false,
        errorTitle: '設定失敗',
        errorDesc: failureMessage(1),
        onClose: () => {},
      });
    }
    // 編輯流程
    handleEdit();
  };

  /* 初始化資料 */
  useEffect(async () => {
    // getInitialData through api
    const rtData = await getNonDesignatedTransferData();

    console.log('T00300 useEffect rtData: ', rtData);
    // set to pageModel
    setModel(rtData);
  }, []);

  return (
    <Layout title="非約轉設定">
      <T00300Wrapper>
        <div className="setting_switch">
          <FEIBSwitchLabel
            control={(
              <FEIBSwitch
                checked={model.originalStatus === 0}
                disabled={false}
                onChange={handleSwitchOnTrigger}
              />
            )}
            label="非約定轉帳設定"
            $color={theme.colors.text.lightGray}
          />
        </div>

        {/* 已開通非約轉功能則顯示電話號碼以及編輯按鈕 */}
        {model.originalStatus === 0 && (
        <div className="phone_number">
          <div className="text">
            <p>手機號碼</p>
            <p className="mobile_number_text">{model.mobile}</p>
          </div>
          <div className="edit" onClick={handleEditOnClick}>
            <img src={EditIcon} alt="" />
          </div>
        </div>
        )}

        {/* TODO: 使用條款內容確認 */}
        <Accordion title="使用條款" space="both">
          <T00300AccordionContent />
        </Accordion>
      </T00300Wrapper>
    </Layout>
  );
};

export default T00300;
