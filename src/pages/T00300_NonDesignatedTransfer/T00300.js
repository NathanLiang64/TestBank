/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';

/* Elements */
import Layout from 'components/Layout/Layout';
import {
  FEIBSwitch,
  FEIBSwitchLabel,
} from 'components/elements';
import Accordion from 'components/Accordion';
import theme from 'themes/theme';
import EditIcon from 'assets/images/icons/editIcon.svg';
import { showAnimationModal } from 'utilities/MessageModal';
import { checkDeviceBindingStatus, getNonDesignatedTransferData } from './api';

/* Styles */
import T00300Wrapper from './T00300.style';
import T00300AccordionContent from './T00300_accordionContent';

const T00300 = () => {
  const [model, setModel] = useState({});

  /* 錯誤訊息 */
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

  /* 申請流程 */
  const handleApply = () => {
    console.log('T00300 handleApply()');
  };

  /* 註銷流程 */
  const handleCancel = () => {
    console.log('T00300 handleCancel()');
  };

  /* 編輯流程 */
  const handleEdit = () => {
    console.log('T00300 handleEdit()');
  };

  /* 點擊開關 */
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
      showAnimationModal({
        isSuccess: false,
        errorTitle: '設定失敗',
        errorDesc: failureMessage(1),
        onClose: () => {},
      });

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

  /* 點擊鉛筆 */
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

        <Accordion title="使用條款" space="both">
          <T00300AccordionContent />
        </Accordion>
      </T00300Wrapper>
    </Layout>
  );
};

export default T00300;
