import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

/* Elements */
import Layout from 'components/Layout/Layout';

/* Reducers & JS functions */
import { setWaittingVisible } from 'stores/reducers/ModalReducer';

/**
 * C00600 存錢計畫
 */
const DepositePlan = () => {
  const dispatch = useDispatch();

  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    // Fetch API...

    dispatch(setWaittingVisible(false));
  }, []);

  return (
    <Layout title="存錢計畫">
      <div style={{ marginTop: 100, textAlign: 'center' }}>存錢計畫</div>
    </Layout>
  );
};

export default DepositePlan;
