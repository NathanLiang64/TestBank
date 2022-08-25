import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Main from 'components/Layout';
import Layout from 'components/Layout/Layout';
import MemberAccountCard from 'components/MemberAccountCard';
import { setDrawer, setDrawerVisible, setWaittingVisible } from 'stores/reducers/ModalReducer';
import { getAllRegisteredAccount, updateRegisteredAccount } from './api';
import AccountEditor from './D00600_AccountEditor';
import PageWrapper from './D00600.style';

/**
 * D00600 約定帳號管理頁
 */
const Page = () => {
  const dispatch = useDispatch();
  const [cards, setCards] = useState([]);

  /**
   *- 初始化
   */
  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    setCards(await getAllRegisteredAccount());

    dispatch(setWaittingVisible(false));
  }, []);

  /**
   * 處理UI流程：編輯帳戶
   * @param {*} card 變更前資料。
   */
  const editAccount = async (card) => {
    const onFinished = async (newCard) => {
      const successful = await updateRegisteredAccount(newCard);
      dispatch(setDrawerVisible(false));
      if (successful) {
        setCards([...cards]); // 強制更新清單。
      }
    };

    dispatch(setDrawer({
      title: '編輯約定帳號',
      content: (<AccountEditor initData={card} onFinished={onFinished} />),
    }));
    dispatch(setDrawerVisible(true));
  };

  /**
   * 顯示帳戶列表
   */
  return (
    <Layout title="約定帳號管理">
      <Main small>
        <PageWrapper>
          {cards?.map((card) => (
            <MemberAccountCard
              key={card.acctId}
              type="約定帳號"
              name={card.nickName}
              bankNo={card.bankId}
              bankName={card.bankName}
              account={card.acctId}
              avatarSrc={card.headshot}
              onEdit={() => editAccount(card)}
            />
          )) }
        </PageWrapper>
      </Main>
    </Layout>
  );
};

export default Page;
