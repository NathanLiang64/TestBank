import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';

import Main from 'components/Layout';
import Layout from 'components/Layout/Layout';
import MemberAccountCard from 'components/MemberAccountCard';

/**
 * 先修好 D00500 再把程式碼複製過來！
 * 先修好 D00500 再把程式碼複製過來！
 * 先修好 D00500 再把程式碼複製過來！
 */

const mock = [
  { name: 'Loid Forger', bankName: 'Peanuts Bank', account: '11122233334444' },
  { name: 'Anya Forger', bankName: 'Peanuts Bank', account: '11122233324444' },
  { name: 'Yor Forger', bankName: 'Peanuts Bank', account: '11122233304444' },
];

/**
 * D00600 約定帳號管理頁
 */
const Page = () => {
  const dispatch = useDispatch();
  const [cards, setCards] = useState([]);

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    // setCards(await getFavAccounts());
    // TODO:  若要呼叫 API，取消以上註解，並移除以下一行。
    setCards(mock);
    dispatch(setWaittingVisible(false));
  }, []);

  /**
   * 呼叫 API 更新帳戶資訊
   */
  const handleEdit = (card) => {
    /*
    const params = {
      email: card?.email,
      inBank: card?.bankId,
      inAcct: card?.accountId,
      nickName: card?.accountName,
      orgBankId: card?.bankId,
      orgAcctId: card?.accountId,
    };
    try {
      await updateRegAccount(params);
      return true;
    } catch (error) {
      // TODO: You may want to remove below line in production.
      console.warn('Error returned from updateFavAccount', error);
      return false;
    }
    */

    // TODO:  若要呼叫 API，取消以上註解，並移除以下兩行。
    console.debug('handleEdit', card);
    return true;
  };

  /**
   * 處理UI流程：編輯帳戶
   */
  const onEditClick = (card) => {
    // TODO: Do something with UI, then call API:
    const successful = handleEdit(card);

    if (!successful) {
      // TODO: You may want to do something with UI?
    }
  };

  /**
   * 顯示帳戶列表
   */
  return (
    <Layout title="約定帳號管理">
      <Main small>
        { !!cards && cards.map((card) => (
          <MemberAccountCard
            key={card.account}
            {...card}
            onEdit={() => onEditClick(card)}
          />
        )) }
      </Main>
    </Layout>
  );
};

export default Page;
