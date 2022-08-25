import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import {
  setModal, setModalVisible, setDrawer, setDrawerVisible, setWaittingVisible,
} from 'stores/reducers/ModalReducer';

import { AddIcon } from 'assets/images/icons';
import Main from 'components/Layout';
import Layout from 'components/Layout/Layout';
import MemberAccountCard from 'components/MemberAccountCard';

import {
  getAllFrequentAccount,
  addFrequentAccount,
  updateFrequentAccount,
  deleteFrequentAccount,
} from './api';

import AccountEditor from './D00500_AccountEditor';
import PageWrapper from './D00500.style';

/**
 * D00500 常用帳號管理頁
 */
const Page = () => {
  const dispatch = useDispatch();
  const [cards, setCards] = useState([]);

  /**
   *- 初始化
   */
  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    setCards(await getAllFrequentAccount());

    dispatch(setWaittingVisible(false));
  }, []);

  /**
   * 處理UI流程：新增帳戶
   */
  const addnewAccount = async () => {
    const onFinished = async (newCard) => {
      console.log(newCard);
      const successful = addFrequentAccount(newCard);
      if (successful) {
        setCards([{
          ...newCard,
          isNew: true,
        }, ...cards]);
      }
      dispatch(setDrawerVisible(false));
    };

    const options = (
      <AccountEditor onFinished={onFinished} />
    );
    dispatch(setDrawer({ title: '新增常用帳號', content: options }));
    dispatch(setDrawerVisible(true));
  };

  /**
   * 處理UI流程：編輯帳戶
   * @param {*} card 變更前資料。
   */
  const editAccount = async (card) => {
    const { bankId, acctId } = card; // 變更前 常用轉入帳戶-銀行代碼 及 帳號
    const onFinished = async (newCard) => {
      console.log(newCard);
      const successful = updateFrequentAccount({
        ...newCard,
        orgBankId: bankId,
        orgAcctId: acctId,
      });
      dispatch(setDrawerVisible(false));
      if (successful) {
        card.isNew = false;
        setCards([...cards]); // 強制更新清單。
      }
    };

    const options = (
      <AccountEditor initData={card} onFinished={onFinished} />
    );
    dispatch(setDrawer({ title: '編輯常用帳號', content: options }));
    dispatch(setDrawerVisible(true));
  };

  /**
   * 處理UI流程：移除登記帳戶
   */
  const removeAccount = (card) => {
    const onRemoveConfirm = () => {
      const successful = deleteFrequentAccount({ bankId: card.bankId, acctId: card.acctId });
      if (successful) {
        const tmpCards = cards.filter((c) => c.acctId !== card.acctId);
        setCards(tmpCards);
      }
    };

    dispatch(setModal({
      title: '系統訊息',
      content: <div style={{ textAlign: 'center' }}>您確定要刪除此帳號?</div>,
      okContent: '確定刪除',
      onOk: onRemoveConfirm,
      cancelContent: '我再想想',
    }));
    dispatch(setModalVisible(true));
  };

  /**
   * 顯示帳戶列表
   */
  return (
    <Layout title="常用帳號管理">
      <Main small>
        <PageWrapper>
          <button type="button" aria-label="新增常用帳號" className="addMemberButtonArea" onClick={addnewAccount}>
            <div className="addMemberButtonIcon">
              <AddIcon />
            </div>
            <span className="addMemberButtonText">新增常用帳號</span>
          </button>
          {cards?.map((card) => (
            <MemberAccountCard
              key={card.acctId}
              type="常用帳號"
              name={card.nickName}
              bankNo={card.bankId}
              bankName={card.bankName}
              account={card.acctId}
              avatarSrc={card.headshot}
              hasNewTag={card.isNew}
              onEdit={() => editAccount(card)}
              onRemove={() => removeAccount(card)}
            />
          )) }
        </PageWrapper>
      </Main>
    </Layout>
  );
};

export default Page;
