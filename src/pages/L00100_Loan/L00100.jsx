import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';

import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import Main from 'components/Layout';
import Layout from 'components/Layout/Layout';

import { getLoanSummary } from './api';

/**
 * L00100 貸款 首頁
 */
const Page = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [loans, setLoans] = useState();

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    const response = await getLoanSummary();
    setLoans(response);
    dispatch(setWaittingVisible(false));
  }, []);

  return (
    <Layout title="貸款" goBackFunc={() => history.goBack()}>
      <Main>
        { loans && loans[0].accountNo }
      </Main>
    </Layout>
  );
};

export default Page;
