/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-wrap-multilines */
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loading from 'components/Loading';
import Header from 'components/Header';
import Dialog from 'components/Dialog';
import BottomDrawer from 'components/BottomDrawer';
import { FEIBButton } from 'components/elements';
// import theme from 'themes/theme';
import {
  setModalVisible, setWaittingVisible, setDrawerVisible,
} from '../../stores/reducers/ModalReducer';

function Layout({
  title,
  children,
  goHome,
  goBack,
  goBackFunc,
}) {
  const dispatch = useDispatch();

  //
  // 處理 Popup視窗、 等待中 及 Drawer。
  //
  const modalData = useSelector((state) => state.ModalReducer.modal);
  const showModal = useSelector((state) => state.ModalReducer.showModal);
  const drawerData = useSelector((state) => state.ModalReducer.drawer);
  const showDrawer = useSelector((state) => state.ModalReducer.showDrawer);
  const waitting = useSelector((state) => state.ModalReducer.waitting);

  // 關閉 Popup視窗。
  const onModalClose = async () => {
    if (modalData.onClose) {
      modalData.onClose();
    }
    dispatch(setModalVisible(false));
    // dispatch(setWaittingVisible(false));
  };

  //
  const onModalOk = async () => {
    if (modalData.onOk) {
      if ((await modalData.onOk() === false)) return;
    }
    dispatch(setModalVisible(false));
  };

  //
  const onModalCancel = async () => {
    if (modalData.onCancel) {
      if ((await modalData.onCancel() === false)) return;
    }
    dispatch(setModalVisible(false));
  };

  /**
   *  監控 ModalReducer.showModal，當開啟時立即關閉 等待中 及 Drawer
   */
  useEffect(async () => {
    console.log('showModal -> ', showModal);
    // 強制關掉 等待畫面，才能看到 Popup 視窗。
    if (showModal) {
      dispatch(setWaittingVisible(false));
      dispatch(setDrawerVisible(false));
    }
  }, [showModal]);

  /**
   * 顯示訊息視窗
   */
  const MessageModal = () => (
    <div>
      <Dialog
        title={modalData.title ?? '系統訊息'}
        isOpen={showModal}
        onClose={onModalClose}
        content={modalData.content}
        action={
          <>
            {(modalData.onCancel || modalData.cancelContent)
              ? (<FEIBButton onClick={onModalCancel}>
                    {modalData.cancelContent ?? '取消'}
                 </FEIBButton>)
              : null}
            <FEIBButton onClick={onModalOk}>
              {modalData.okContent ?? '確認'}
            </FEIBButton>
          </>
        }
      />
    </div>
  );

  /**
   *  監控 ModalReducer.showDrawer，當開啟時立即關閉 等待中 及 Popup視窗。
   */
  useEffect(async () => {
    console.log('showDrawer -> ', showDrawer);
    if (showDrawer) {
      dispatch(setWaittingVisible(false));
      dispatch(setModalVisible(false));
    }
  }, [showDrawer]);

  /**
   * 監控 ModalReducer.waitting，當開啟時立即關閉 Drawer 及 Popup視窗。
   */
  useEffect(async () => {
    console.log('showWaitting -> ', waitting);
    if (waitting) {
      dispatch(setDrawerVisible(false));
      dispatch(setModalVisible(false));
    }
  }, [waitting]);

  /**
   * 下方彈出抽屜 UI。
   */
  const Drawer = () => (
    <BottomDrawer
      title={drawerData.title}
      // titleColor={theme.colors.primary.dark}
      isOpen={showDrawer}
      onClose={() => dispatch(setDrawerVisible(false))}
      content={drawerData.content}
    />
  );

  //
  // 頁面外框
  //
  if (!waitting) {
    return (
      <div>
        <Header title={title} hideHome={!goHome} hideBack={!goBack} goBack={goBackFunc} />

        <div>
            {waitting ? null : children}
            <MessageModal />
            <Drawer />
        </div>
      </div>
    );
  }
  return <Loading isFullscreen />;
}

Layout.propTypes = {
  title: PropTypes.string,
  children: PropTypes.element,
  goHome: PropTypes.bool,
  goBack: PropTypes.bool,
  goBackFunc: PropTypes.func,
};

Layout.defaultProps = {
  title: 'Bankee APP 2.0',
  children: <div />,
  goHome: true,
  goBack: true,
  goBackFunc: null,
};

export default Layout;
