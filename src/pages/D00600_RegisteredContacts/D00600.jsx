import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';

import Main from 'components/Layout';
import Layout from 'components/Layout/Layout';
import MemberAccountCard from 'components/MemberAccountCard';

const mock = [
  {
    name: 'Loid Forger', bankName: 'Peanuts Bank', bankNo: '017', account: '11122233334444',
  },
  {
    name: 'Anya Forger', bankName: 'Peanuts Bank', bankNo: '017', account: '11122233324444',
  },
  {
    name: 'Yor Forger', bankName: 'Peanuts Bank', bankNo: '017', account: '11122233304444',
  },
];

/**
 * D00600 約定帳號管理頁
 */
const Page = () => {
  const dispatch = useDispatch();
  const [cards, setCards] = useState([]);

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    setCards(mock);
    dispatch(setWaittingVisible(false));
  }, []);

  const handleEdit = (card) => {
    console.debug('handleEdit', card);
  };

  return (
    <Layout title="約定帳號管理">
      <Main small>
        { !!cards && cards.map((card) => (
          <MemberAccountCard
            key={card.account}
            {...card}
            onEdit={() => handleEdit(card)}
          />
        )) }
      </Main>
    </Layout>
  );
};

export default Page;
