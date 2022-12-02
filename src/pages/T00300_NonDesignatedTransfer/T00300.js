/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { startFunc, transactionAuth } from 'utilities/AppScriptProxy';

/* Elements */
import Layout from 'components/Layout/Layout';
import { FEIBSwitch, FEIBSwitchLabel } from 'components/elements';
import Accordion from 'components/Accordion';
import EditIcon from 'assets/images/icons/editIcon.svg';
import {
  closeDrawer, showAnimationModal, showCustomPrompt, showDrawer,
} from 'utilities/MessageModal';
import { useHistory } from 'react-router';
import theme from 'themes/theme';
import { AuthCode } from 'utilities/TxnAuthCode';
import { FuncID } from 'utilities/FuncID';
import {
  checkDeviceBindingStatus, getNonDesignatedTransferData, queryOTP, updateOTP,
} from './api';

/* Styles */
import T00300Wrapper from './T00300.style';
import T00300AccordionContent from './T00300_accordionContent';
import T00300DrawerContent from './T00300_drawerContent';

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
      case '1_0': // 無裝置綁定
        return '無裝置綁定，請進行裝置綁定設定或致電客服。';
      case '1_1': // 已裝置綁定
        return '您已進行裝置綁定，請至原裝置解除綁定或致電客服。';
      case '2': // 網銀密碼驗證失敗（驗證2次未過）
        return '網銀密碼驗證失敗，請重新執行或致電客服。';
      case '3': // 簡訊OTP驗證失敗（驗證3次未過）
        return '簡訊OTP驗證失敗，請重新執行或致電客服。';
      case '4': // MID驗證失敗（手機門號與SIM卡認證失敗）
        return '手機門號與SIM卡認證失敗，請使用手機行動網路，重新執行或致電客服。';
      case '5': // 無法判斷錯誤代碼，直接顯示錯誤訊息
        return errMsg;
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
    showCustomPrompt({
      title: '設定失敗',
      message: failureMessage(code, errMsg),
      onCancel: () => history.replace('/T00300'),
      onClose: () => history.replace('/T00300'),
      onOk: code === '1_0' ? () => startFunc(FuncID.T00200) : () => history.replace('/T00300'),
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

  /**
   * Bottom Drawer 確認按鈕行為
   * @param {data} data: {isEdit, data: {mobileNumber}}
   */
  const handleDrawerConfirm = async (data) => {
    if (!data.isEdit) {
      /* 開通流程：雙因子驗證? && 申請＋開通流程：雙因子驗證 */
      const transRes = await transactionAuth(AuthCode.T00300.APPLY, model.mobile);
      if (transRes.result !== true) {
        /* 失敗頁面 */
        onFailure('5', transRes.message);
      } else {
        /* 驗證成功：更新資料至api */
        await queryOTP();
        const updateResult = await updateOTP(model.mobile);

        if (updateResult.code === '0000') {
          /* 成功頁面 */
          onSuccess();
          return;
        }

        /* 失敗畫面 */
        onFailure('5', updateResult.message);
      }
    } else {
      /* 修改流程：雙因子＋OTP 驗證 */
      const transRes = await transactionAuth(AuthCode.T00300.EDIT, data.data.mobileNumber);
      console.log('transactionAuth res: ', transRes);

      if (transRes.result !== true) {
        /* 失敗頁面 */
        onFailure('5', transRes.message);
      } else {
        /* 驗證成功：更新資料至api */
        await queryOTP();
        const updateResult = await updateOTP(data.data.mobileNumber);

        if (updateResult.code === '0000') {
          /* 成功畫面 */
          onSuccess();
          return;
        }
        /* 失敗頁面 */
        onFailure('5', transRes.message);
      }
    }
  };

  /**
   * 非約轉交易門號 Drawer
   * @param {isEdit} isEdit boolean: 非約轉交易門號 Drawer 內容
   */
  const mobileNumberSettingDrawer = (isEdit) => {
    showDrawer(
      '非約轉交易門號',
      <T00300DrawerContent
        isEdit={isEdit}
        mobile={model.mobile}
        handleConfirm={(data) => handleDrawerConfirm(data)}
        handleCancel={() => closeDrawer()}
      />,
    );
  };

  /**
   * 註銷流程
   */
  const handleCancel = async () => {
    /* 雙因子驗證 */
    const result = await transactionAuth(AuthCode.T00300.CLOSE, model.mobile);
    console.log('transactionAuth res: ', result);

    if (result === false) {
      /* 失敗頁面 */
      onFailure('5', result.message);
    } else {
      /* 驗證成功：更新資料至api */
      await queryOTP();
      const updateResult = await updateOTP(model.mobile);

      console.log({updateResult});

      if (updateResult.code === '0000') {
        /* 成功頁面 */
        onSuccess();
      }
      /* 失敗頁面 */
      onFailure('5', updateResult.message);
    }
  };

  /**
   * 點擊開關
   */
  const handleSwitchOnTrigger = async () => {
    /**
     * 檢查裝置綁定狀態
     * 否 -> failureCode: 1_0 | 1_1 | 5
     * 是 ->
     *  model.status === '03' -> Close流程
     *  model.status === '01 -> 開通流程
     *  其餘走 申請+開通流程
     */
    const result = await checkDeviceBindingStatus();
    if (!result.bindingStatus) {
      onFailure(result.failureCode, result.message);
      return;
    }

    if (model.status === '03') {
      /* 註銷流程 */
      handleCancel();
    } else {
      /* 開通 or 申請+開通流程: 打開drawer (input-不可編輯) */
      console.log('handleSwitchOnTrigger(): ', {status: model.status});
      mobileNumberSettingDrawer(false);
    }
  };

  /**
   * 點擊鉛筆
   */
  const handleEditOnClick = async () => {
    /**
     * 檢查裝置綁定狀態
     * 否 -> failureCode: 1_0 | 1_1 | 5
     * 是 ->
     *  走 編輯流程
     */
    const result = await checkDeviceBindingStatus();
    if (!result.bindingStatus) {
      onFailure(result.failureCode, result.message);
      return;
    }

    /* 編輯流程: 打開drawer (input-可編輯) */
    mobileNumberSettingDrawer(true);
  };

  /* 初始化資料 */
  useEffect(async () => {
    // 自api取得初始資料
    const rtData = await getNonDesignatedTransferData();

    // 取得之資料儲存至 model state
    setModel(rtData);
  }, []);

  return (
    <Layout title="非約轉設定">
      <T00300Wrapper>
        <div className="info_container">
          <div className="setting_switch">
            <FEIBSwitchLabel
              control={(
                <FEIBSwitch
                  checked={model.status === '03'}
                  disabled={false}
                  onChange={handleSwitchOnTrigger}
                />
            )}
              label="非約定轉帳設定"
            />
          </div>

          {/* 已開通非約轉功能則顯示電話號碼以及編輯按鈕 */}
          {model.status === '03' && (
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
        </div>

        {/* TODO: 使用條款內容確認 */}
        <Accordion title="使用條款" space="both">
          <T00300AccordionContent />
        </Accordion>
      </T00300Wrapper>
    </Layout>
  );
};

export default T00300;
