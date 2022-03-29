/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-wrap-multilines */
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import Header from 'components/Header';
import Loading from 'components/Loading';
// import '../styles/custom.css';
import {
  setModalVisible, setWaittingVisible,
} from '../../stores/reducers/ModalReducer';
// import { routepath } from '../../routes';

function Layout({
  title,
  children,
  goHome,
  goBack,
  goBackFunc,
}) {
  const dispatch = useDispatch();

  //
  // 處理 Popup 視窗。
  //
  const modalData = useSelector((state) => state.ModalReducer.modal);
  const showModal = useSelector((state) => state.ModalReducer.showModal);
  const waitting = useSelector((state) => state.ModalReducer.waitting);

  // 當 Popup 視窗 關閉 時，同時關閉 Wait
  const onModalClose = async () => {
    if (modalData.onClose) {
      modalData.onClose();
    }
    dispatch(setModalVisible(false));
    dispatch(setWaittingVisible(false));
  };

  //
  const onModalOk = async () => {
    if (modalData.onOk) {
      if ((await modalData.onOk() === false)) return;
    }
    dispatch(setModalVisible(false));
    // dispatch(setWaittingVisible(false));
  };

  //
  const onModalCancel = async () => {
    if (modalData.onCancel) {
      if ((await modalData.onCancel() === false)) return;
    }
    dispatch(setModalVisible(false));
    // dispatch(setWaittingVisible(false));
  };

  /**
   *  監控 ModalReducer.visible，當開啟時立即關閉 等待中 視窗
   */
  useEffect(async () => {
    // 強制關掉 等待畫面，才能看到 Popup 視窗。
    if (showModal) dispatch(setWaittingVisible(false));
  }, [showModal]);

  /**
   * 顯示訊息視窗
   */
  const MessageModal = () => (
    <>
      <Modal show={showModal} onHide={onModalClose} centered backdrop={modalData.backdrop ? '' : 'static'}>
        <Modal.Header>
          <Modal.Title className="h5" style={{ color: '#ab8ce4' }}>
            {modalData.title ?? '系統訊息'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '1rem 1.5rem' }}>
          {modalData.content}
        </Modal.Body>
        <Modal.Footer style={{ justifyContent: 'center', flexWrap: 'nowrap' }}>
          {(modalData.onCancel || modalData.cancelContent)
            ? (<Button variant="secondary" onClick={onModalCancel}>
                  {modalData.cancelContent ?? '取消'}
               </Button>)
            : null}
          <Button variant="primary" onClick={onModalOk} style={{ backgroundColor: '#ab8ce4', color: 'white' }}>
            {modalData.okContent ?? '確認'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
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
        </div>
      </div>
    );
  }
  return (
    <div style={{ backgroundColor: 'gray' }}>
      <Loading />
    </div>);
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
