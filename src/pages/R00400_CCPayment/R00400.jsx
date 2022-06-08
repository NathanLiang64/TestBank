import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import Layout from 'components/Layout/Layout';
import Main from 'components/Layout';
import Badge from 'components/Badge';

/**
 * C00700 信用卡 付款頁
 */
const CreditCardPaymentPage = () => {
  const dispatch = useDispatch();

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    dispatch(setWaittingVisible(false));
  }, []);
  return (
    <Layout title="繳款" hasClearHeader>
      <Main>
        <Badge label="應繳金額" value="$12,000" />
      </Main>
    </Layout>
  );
};

export default CreditCardPaymentPage;
