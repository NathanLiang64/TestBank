import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';

/* Elements */
import Layout from 'components/Layout/Layout';
import { FEIBSwitch, FEIBSwitchLabel } from 'components/elements';
import Accordion from 'components/Accordion';
import {
  closeDrawer, showAnimationModal, showDrawer,
} from 'utilities/MessageModal';
import { Func } from 'utilities/FuncID';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { transactionAuth } from 'utilities/AppScriptProxy';
import { useQLStatus } from 'hooks/useQLStatus';
import { getSettingInfo, changeStatus } from './api';

/* Styles */
import { T00300Wrapper } from './T00300.style';
import T00300AccordionContent from './T00300_accordionContent';
import T00300DrawerContent from './T00300_drawerContent';

/**
 * T00300 非約轉設定
 */
const T00300 = () => {
  const dispatch = useDispatch();
  const {QLResult, showUnbondedMsg} = useQLStatus(); // 確認裝置綁定狀態(比照無卡提款設定)

  const [model, setModel] = useState({});

  const isUnlock = (model?.status !== 1); // 表示已開通非約轉, 1.表示尚未開通
  const isBound = (model?.status === 3); // 表示已綁定非約轉手機號碼

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
    if (isUnlock && model.status !== 4) {
      if (newMobile !== model.mobile) {
        isSuccess = await authAndChangeStatus(Func.T00300.authCode.EDIT, newMobile); // status = 3, 不變
      }
    } else {
      isSuccess = await authAndChangeStatus(Func.T00300.authCode.APPLY, newMobile); // status 由 1 變為 3
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
    // ??? For UX 因素，使用者可能會想要看到 switch 切換的過程
    // 後續可改為 disabling switch 避免 double click，待討論
    // 這邊先暫時以 loading 方式來避免 double click
    dispatch(setWaittingVisible(true));
    if (QLResult) { // 點擊switch時檢查裝置綁定
      if (!isBound) {
        // 開通 or 申請+開通流程
        // 若原狀態為 1.未開發 則表示第一次開通，只有此情況下不可變更綁定門號。
        // 完成綁定門號開通後，status=3.已開通；之後的開關切換就是狀態3/4的互換。
        showSettingDrawer(isUnlock); // status 由 1,4 變為 3.開通
      } else {
        /* 取消綁定(即：4.註銷) */
        await authAndChangeStatus(Func.T00300.authCode.CLOSE); // status 由 3 變為 4.註銷
      }
      setModel({...model}); // 更新畫面。
    } else showUnbondedMsg();
    dispatch(setWaittingVisible(false));
  };

  /**
   * 取得初始資料
   */
  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    const settingInfo = await getSettingInfo();
    // if (settingInfo.status === ???) // TODO 那些狀態下就不能進行設定？
    setModel(settingInfo);

    dispatch(setWaittingVisible(false));
  }, []);

  return (
    <Layout title="非約轉設定">
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
        <Accordion space="both">
          <T00300AccordionContent />
        </Accordion>
      </T00300Wrapper>
    </Layout>
  );
};

export default T00300;
