import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';

import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import Main from 'components/Layout';
import Layout from 'components/Layout/Layout';

import { getLoanRewards } from './api';

/**
 * L00100 貸款 可能回饋頁
 */
const Page = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [rewards, setRewards] = useState();

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    const response = await getLoanRewards({});
    setRewards(response);
    dispatch(setWaittingVisible(false));
  }, []);

  return (
    <Layout title="可能回饋" goBackFunc={() => history.goBack()}>
      <Main>
        { rewards && rewards?.accountNo }
      </Main>
    </Layout>
  );
};

export default Page;
