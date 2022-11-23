/* eslint-disable no-unused-vars */
import React, {useEffect} from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import { FEIBButton } from 'components/elements';
import { TextInputField } from 'components/Fields';
import Layout from 'components/Layout/Layout';
import {
  closeFunc, getQLStatus, startFunc, transactionAuth,
} from 'utilities/AppScriptProxy';
import { showCustomPrompt } from 'utilities/MessageModal';
import { AuthCode } from 'utilities/TxnAuthCode';
import { FuncID } from 'utilities/FuncID';
import { useQLStatus } from 'hooks/useQLStatus';
import { getStatus } from 'pages/S00800_LossReissue/api';
import DebitCardActiveWrapper from './S00700.style';
import { validationSchema } from './validationSchema';
import { activate } from './api';

const S00700 = () => {
  const history = useHistory();
  const { QLResult, showMessage } = useQLStatus();
  const { control, handleSubmit } = useForm({
    defaultValues: { actno: '', serial: '' },
    resolver: yupResolver(validationSchema),
  });

  const submitHandler = async (values) => {
    const auth = await transactionAuth(AuthCode.S00700);
    if (auth && auth.result) {
      await getStatus(); // activate 之前需要先獲得卡況
      const activateResponse = await activate({...values});
      history.push('/S007001', {...activateResponse});
    }
  };

  useEffect(() => {
    if (!QLResult) showMessage();
  }, [QLResult]);

  return (
    <Layout title="金融卡啟用">
      <DebitCardActiveWrapper>
        <form style={{ minHeight: 'initial' }} onSubmit={handleSubmit(submitHandler)}>
          <TextInputField
            type="number"
            labelName="我的金融卡帳號"
            name="actno"
            placeholder="請輸入金融卡帳號(金融卡背面14碼數字)"
            control={control}
          />
          <TextInputField
            type="number"
            labelName="我的金融卡序號"
            name="serial"
            placeholder="請輸入金融卡序號(金融卡背面右下角6碼數字)"
            control={control}
          />
          <FEIBButton type="submit">確認</FEIBButton>
        </form>
      </DebitCardActiveWrapper>
    </Layout>
  );
};

export default S00700;
