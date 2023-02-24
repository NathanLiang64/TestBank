/* eslint-disable no-unused-vars */
import { FEIBInputLabel } from 'components/elements';
import { TextInputField } from 'components/Fields';
import Layout from 'components/Layout/Layout';
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { TransferConfirmWrapper } from './transfer.style';

const TransferConfirm = () => {
  console.log('TransferConfirm');
  const history = useHistory();
  const {state} = useLocation();
  const [data, setData] = useState(state);

  const goBack = () => history.goBack();

  return (
    <Layout title="轉帳" goBackFunc={goBack}>
      <TransferConfirmWrapper>
        <div className="banner">
          資料確認
          <div>v</div>
        </div>
      </TransferConfirmWrapper>
    </Layout>
  );
};

export default TransferConfirm;
