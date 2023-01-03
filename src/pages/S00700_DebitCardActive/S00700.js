import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';

import { useQLStatus } from 'hooks/useQLStatus';
import Layout from 'components/Layout/Layout';
import { FEIBButton } from 'components/elements';
import { TextInputField } from 'components/Fields';
import { AuthCode } from 'utilities/TxnAuthCode';
import { transactionAuth } from 'utilities/AppScriptProxy';
import { getStatus } from 'pages/S00800_LossReissue/api';

import { getAccountsList } from 'utilities/CacheData';
import { useDispatch } from 'react-redux';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { activate } from './api';
import DebitCardActiveWrapper from './S00700.style';
import { validationSchema } from './validationSchema';

const S00700 = () => {
  const history = useHistory();
  const { QLResult, showUnbondedMsg } = useQLStatus();
  const dispatch = useDispatch();
  const { control, handleSubmit, reset } = useForm({
    defaultValues: { actno: '', serial: '' },
    resolver: yupResolver(validationSchema),
  });

  const submitHandler = async (values) => {
    dispatch(setWaittingVisible(true));
    const auth = await transactionAuth(AuthCode.S00700);
    if (auth && auth.result) {
      await getStatus(); // activate 之前需要先獲得卡況
      const activateResult = await activate({...values});
      if (!activateResult) return;
      history.push('/S007001', {...activateResult});
    }
    dispatch(setWaittingVisible(false));
  };

  useEffect(() => {
    if (!QLResult) showUnbondedMsg();
  }, [QLResult]);

  // 我的金融卡帳號欄位自動帶入金融卡台幣主帳號
  useEffect(() => {
    getAccountsList('M', (accounts) => reset((formValues) => ({...formValues, actno: accounts[0].accountNo})));
  }, []);

  return (
    <Layout title="金融卡啟用">
      <DebitCardActiveWrapper>
        <form style={{ minHeight: 'initial' }} onSubmit={handleSubmit(submitHandler)}>
          <TextInputField
            labelName="我的金融卡帳號"
            name="actno"
            control={control}
            inputProps={{maxLength: 14, inputMode: 'numeric', disabled: true}}

          />
          <TextInputField
            labelName="我的金融卡序號"
            name="serial"
            placeholder="請輸入金融卡序號"
            inputProps={{maxLength: 6, inputMode: 'numeric'}}
            control={control}
          />
          <p className="hint_text">金融卡序號為金融卡背面右下角6碼數字</p>
          <FEIBButton type="submit">確認</FEIBButton>
        </form>
      </DebitCardActiveWrapper>
    </Layout>
  );
};

export default S00700;
