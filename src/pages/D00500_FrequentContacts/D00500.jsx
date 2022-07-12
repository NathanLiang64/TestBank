import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';

import Main from 'components/Layout';
import Layout from 'components/Layout/Layout';
import MemberAccountCard from 'components/MemberAccountCard';
import { getFavAccounts, updateFavAccount, removeFavAccount } from 'apis/transferApi';

/**
 * D00500 常用帳號管理頁
 */
const Page = () => {
  const dispatch = useDispatch();
  const [cards, setCards] = useState([]);

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    setCards(await getFavAccounts());
    dispatch(setWaittingVisible(false));
  }, []);

  const handleEdit = async (card) => {
    const params = {
      email: card?.email,
      inBank: card?.bankId,
      inAcct: card?.accountId,
      nickName: card?.accountName,
      orgBankId: card?.bankId,
      orgAcctId: card?.accountId,
    };
    try {
      await updateFavAccount(params);
      return true;
    } catch (error) {
      // TODO: You may want to remove below line in production.
      console.warn('Error returned from updateFavAccount', error);
      return false;
    }
  };

  const handleRemove = async (card) => {
    const params = {
      email: card?.email,
      inBank: card?.bankId,
      inAcct: card?.accountId,
      nickName: card?.accountName,
    };
    try {
      await removeFavAccount(params);
      return true;
    } catch (error) {
      // TODO: You may want to remove below line in production.
      console.warn('Error returned from updateFavAccount', error);
      return false;
    }
  };

  const onEditClick = (card) => {
    // TODO: Do something with UI, then call API:
    const successful = handleEdit(card);

    if (!successful) {
      // TODO: You may want to do something with UI?
    }
  };

  const onRemoveClick = (card) => {
    // TODO: Do something with UI, then call API:
    const successful = handleRemove(card);

    if (!successful) {
      // TODO: You may want to do something with UI?
    }
  };

  return (
    <Layout title="常用帳號管理">
      <Main small>
        { !!cards && cards.map((card) => (
          <MemberAccountCard
            key={card.accountId}
            type="常用帳號"
            name={card.accountName}
            bankNo={card.bankId}
            bankName={card.bankName}
            account={card.accountId}
            avatarSrc={card.acctImg}
            onEdit={() => onEditClick(card)}
            onRemove={() => onRemoveClick(card)}
          />
        )) }
      </Main>
    </Layout>
  );
};

export default Page;
