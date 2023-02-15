/* eslint-disable no-unused-vars */
import { useState, useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import Main from 'components/Layout';
import Layout from 'components/Layout/Layout';
import MemberAccountCard from 'components/MemberAccountCard';
import { showCustomDrawer, showCustomPrompt } from 'utilities/MessageModal';
import { Func } from 'utilities/FuncID';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { AddIcon } from 'assets/images/icons';
// import { useNavigation } from 'hooks/useNavigation';
import EmptyData from 'components/EmptyData';
import uuid from 'react-uuid';
// import {  updateFrequentAccount,  deleteFrequentAccount,} from './api';
import AccountEditor from './E00400_PriceEditor';
import PageWrapper from './E00400.style';

/**
 * D00500 常用帳號管理頁
 */
const Page = () => {
  const dispatch = useDispatch();
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const [notiLists, setNotiLists] = useState([]);

  /**
   *- 初始化
   */
  useEffect(async () => {
    console.log('取得已設定的通知列表');
  }, []);

  /**
   * 處理UI流程：新增通知
   */
  const addnewAccount = async () => {
    const onFinished = async () => {

      // TODO 新增通知 API
      // if (newNoti) {
      //   setNotiLists(newNoti);
      //   forceUpdate();
      // }
    };

    await showCustomDrawer({
      title: '新增外幣到價通知',
      content: <AccountEditor onFinished={onFinished} />,
      noScrollable: true,
    });
  };

  /**
   * 處理UI流程：編輯帳戶
   * @param {*} acct 變更前資料。
   */
  const editAccount = async (noti) => {
    const onFinished = async (newNoti) => {
      dispatch(setWaittingVisible(true));
      console.log('newNoti', newNoti);
      // TODO 更新到價設定 API updateNoti(newNoti)
      dispatch(setWaittingVisible(false));
      // if (newAccounts) {
      //   setNotiLists(newAccounts);
      //   forceUpdate();
      // }
    };

    await showCustomDrawer({
      title: '編輯外幣到價通知',
      content: <AccountEditor initData={noti} onFinished={onFinished} />,
      noScrollable: true,
    });
  };

  /**
   * 處理UI流程：移除登記帳戶
   */
  const removeAccount = async (noti) => {
    const onRemoveConfirm = () => {
      // TODO 刪除到價設定 API deleteNoti(noti)
      // setNotiLists(newNotiLists);
      forceUpdate();
    };

    await showCustomPrompt({
      title: '系統訊息',
      message: (<div style={{ textAlign: 'center' }}>您確定要刪除此帳號?</div>),
      okContent: '確定刪除',
      onOk: onRemoveConfirm,
      cancelContent: '我再想想',
      onCancel: () => {},
    });
  };

  const renderMemberCards = () => {
    if (!notiLists) return null;
    if (!notiLists.length) return <EmptyData content="尚無已設定的通知" height="70vh" />;
    //  TODO name 整合成 title
    //  TODO bankNo/bankName/account 整合成 subTitle
    return notiLists.map((noti) => (
      <MemberAccountCard
        key={uuid()}
        name={noti.nickName} // TODO
        subTitle="匯率低於 (含) : 27.34 (mock)"
        hasNewTag={noti.isNew}
        // disabledAvatar
        moreActions={[
          { lable: '編輯', type: 'edit', onClick: () => editAccount(noti) },
          { lable: '刪除', type: 'delete', onClick: () => removeAccount(noti) },
        ]}
      />
    ));
  };

  /**
   * 顯示帳戶列表
   */
  return (
    <Layout fid={Func.E004} title="外幣到價通知設定">
      <Main small>
        <PageWrapper>
          <button type="button" aria-label="新增外幣到價通知設定" className="addMemberButtonArea" onClick={addnewAccount}>
            <div className="addMemberButtonIcon">
              <AddIcon />
            </div>
            <span className="addMemberButtonText">新增 (最多可設定五筆)</span>
          </button>
          {renderMemberCards()}
        </PageWrapper>
      </Main>
    </Layout>
  );
};

export default Page;
