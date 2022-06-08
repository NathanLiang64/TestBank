import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Layout from 'components/Layout/Layout';
import { MainScrollWrapper } from 'components/Layout';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';

/**
 * C00700 信用卡 帳單頁
 */
const CreditCardPage = () => {
  const dispatch = useDispatch();

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    dispatch(setWaittingVisible(false));
  }, []);
  return (
    <Layout title="信用卡帳單" hasClearHeader>
      <MainScrollWrapper>
        <div>A</div>
      </MainScrollWrapper>
    </Layout>
  );
};

export default CreditCardPage;
