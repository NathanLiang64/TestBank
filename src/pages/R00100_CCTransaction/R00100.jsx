import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Layout from 'components/Layout/Layout';
import Main from 'components/Layout';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';

/**
 * R00100 信用卡 即時消費明細
 */
const Page = () => {
  const dispatch = useDispatch();

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    dispatch(setWaittingVisible(false));
  }, []);
  return (
    <Layout title="信用卡即時消費明細" hasClearHeader>
      <Main>
        <div>A</div>
      </Main>
    </Layout>
  );
};

export default Page;
