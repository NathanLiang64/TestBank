import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';

import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import Main from 'components/Layout';
import Layout from 'components/Layout/Layout';

import { getLoanDetails } from './api';

/**
 * L00100 貸款 資訊頁
 */
const Page = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [details, setDetails] = useState();

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    const response = await getLoanDetails({});
    setDetails(response);
    dispatch(setWaittingVisible(false));
  }, []);

  return (
    <Layout title="貸款資訊" goBackFunc={() => history.goBack()}>
      <Main>
        { details && details.accountNo }
      </Main>
    </Layout>
  );
};

export default Page;
