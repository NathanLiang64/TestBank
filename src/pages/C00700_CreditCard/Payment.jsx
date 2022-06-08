import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Layout from 'components/Layout/Layout';
import { MainScrollWrapper } from 'components/Layout';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';

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
      <MainScrollWrapper>
        <div>A</div>
      </MainScrollWrapper>
    </Layout>
  );
};

export default CreditCardPaymentPage;
