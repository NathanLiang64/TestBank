/* eslint-disable no-unused-vars */
import { useDispatch } from 'react-redux';
import { useState } from 'react';

/* Elements */
import Layout from 'components/Layout/Layout';
import { FEIBSwitch, FEIBSwitchLabel } from 'components/elements';
import Accordion from 'components/Accordion';
import EditIcon from 'assets/images/icons/editIcon.svg';
import {
  closeDrawer, showAnimationModal, showDrawer,
} from 'utilities/MessageModal';
import { AuthCode } from 'utilities/TxnAuthCode';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { getQLStatus, transactionAuth } from 'utilities/AppScriptProxy';
import { getSettingInfo, changeStatus } from './api';

/* Styles */
import T00300Wrapper from './T00300.style';
import T00300AccordionContent from './T00300_accordionContent';
import T00300DrawerContent from './T00300_drawerContent';

/**
 * T00300 非約轉設定
 */
const T00300 = () => {
  const dispatch = useDispatch();

  const [model, setModel] = useState({});

  const isUnlock = (model?.status !== '01'); // 表示已開通非約轉, '01'表示尚未開通
  const isBound = (model?.status === '03'); // 表示已綁定非約轉手機號碼

  const authAndChangeStatus = async (authCode, newMobile) => {
    const transRes = await transactionAuth(authCode, newMobile);
    if (transRes.result === true) {
      const newStatus = await changeStatus(newMobile);
      if (newStatus) {
        model.status = newStatus;
        setModel({...model}); // 更新畫面。

        // 顯示成功畫面
        await showAnimationModal({
          isSuccess: true,
          successTitle: '設定成功',
        });
        return true;
      }
    }
    return false;
  };

  /**
   * Bottom Drawer 確認按鈕行為
   * @param {Promise<String>} newMobile 新的綁定手機號碼。
   */
  const handleDrawerConfirm = async (newMobile) => {
    let isSuccess;
    if (isUnlock && model.status !== '04') {
      if (newMobile !== model.mobile) {
        isSuccess = await authAndChangeStatus(AuthCode.T00300.EDIT, newMobile); // status =03, 不變
      }
    } else {
      isSuccess = await authAndChangeStatus(AuthCode.T00300.APPLY, newMobile); // status 由 01 變為 03
    }

    if (isSuccess) {
      model.mobile = newMobile;
      setModel({...model}); // 更新畫面。
    }
    closeDrawer();
  };

  /**
   * 非約轉交易門號 Drawer
   * @param {Promise<Boolean>} isEdit 表示可以修改非約轉交易門號。
   */
  const showSettingDrawer = async (isEdit) => {
    await showDrawer(
      '非約轉交易門號',
      <T00300DrawerContent
        readonly={!isEdit}
        mobile={model.mobile}
        onConfirm={handleDrawerConfirm}
        onCancel={closeDrawer}
      />,
    );
  };

  /**
   * 切換綁定狀態。
   */
  const handleSwitchOnTrigger = async () => {
    if (!isBound) {
      // 開通 or 申請+開通流程
      // 若原狀態為 01.未開發 則表示第一次開通，只有此情況下不可變更綁定門號。
      // 完成綁定門號開通後，status=3.已開通；之後的開關切換就是狀態3/4的互換。
      showSettingDrawer(isUnlock); // status 由 01/04 變為 03.開通
    } else {
      /* 取消綁定(即：4.註銷) */
      await authAndChangeStatus(AuthCode.T00300.CLOSE); // status 由 03 變為 04.註銷
    }
    setModel({...model}); // 更新畫面。
  };

  /**
   * 檢查是否可以開啟這個頁面。
   * @returns {Promise<String>} 傳回驗證結果的錯誤訊息；若是正確無誤時，需傳回 null
   */
  const inspector = async () => {
    dispatch(setWaittingVisible(true));
    let error;
    // 確認裝置綁定狀態
    const deviceBinding = await getQLStatus();
    if (deviceBinding.result === 'true' && deviceBinding.QLStatus === '1') {
      // 查詢非約轉設定狀態與綁定的手機號碼。
      const settingInfo = await getSettingInfo();
      // if (settingInfo.status === ???) // TODO 那些狀態下就不能進行設定？
      setModel(settingInfo);
      error = null;
    } else {
      // TODO 統一處理！
      // 1. 顯示訊息，2.設定按鈕名稱及功能

      // 顯示錯誤訊息後，立即關閉功能。
      switch (deviceBinding.QLStatus) {
        case '0': error = '無裝置綁定，請進行裝置綁定設定或致電客服。'; break;
        case '2': error = '???'; break; // 已裝置綁定 但鎖住！
        case '3':
        case '4': error = '您已進行裝置綁定，請至原裝置解除綁定或致電客服。'; break;
        default: error = `${deviceBinding.message}，系統忙碌中，請重新執行或致電客服。`; break;
      }
    }
    dispatch(setWaittingVisible(false));
    return error;
  };

  // console.log('===> ', {...model, isUnlock, isBound }); // DEBUG
  return (
    <Layout title="非約轉設定" inspector={inspector}>
      <T00300Wrapper>
        <div className="info_container">
          <div className="setting_switch">
            <FEIBSwitchLabel
              control={(
                <FEIBSwitch
                  checked={isBound}
                  onChange={handleSwitchOnTrigger}
                />
            )}
              label="非約定轉帳設定"
            />
          </div>

          {/* 已開通非約轉功能則顯示電話號碼以及編輯按鈕 */}
          {isBound && (
          <div className="phone_number">
            <div className="text">
              <p>手機號碼</p>
              <p className="mobile_number_text">{model.mobile}</p>
            </div>
            {/* 未開通前，不可變更綁定的手機號碼 */}
            {/* 暫時隱藏編輯按鈕 */}
            {/* {isUnlock && (
              <div className="edit" onClick={() => showSettingDrawer(true)}>
                <img src={EditIcon} alt="" />
              </div>
            )} */}
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
