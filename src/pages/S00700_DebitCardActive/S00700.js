/* eslint-disable no-unused-vars */
import React from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import { FEIBButton } from 'components/elements';
import { TextInputField } from 'components/Fields';
import Layout from 'components/Layout/Layout';
import { closeFunc, getQLStatus, transactionAuth } from 'utilities/AppScriptProxy';
import { showCustomPrompt } from 'utilities/MessageModal';
import DebitCardActiveWrapper from './S00700.style';
import { validationSchema } from './validationSchema';

const S00700 = () => {
  const history = useHistory();
  const {control, handleSubmit} = useForm({
    defaultValues: {accountNo: '', accountSn: '' },
    resolver: yupResolver(validationSchema),
  });

  const checkQLStatus = async (QLStatus) => {
    switch (QLStatus) {
      case ('0'):
        await showCustomPrompt({message: '無裝置綁定，請先進行裝置綁定設定或致電客服'});
        return false;
      case ('3'):
        await showCustomPrompt({message: '該帳號已在其它裝置綁定'});
        return false;
      case ('4'):
        await showCustomPrompt({message: '本裝置已綁定其他帳號'});
        return false;
      default:
        return await transactionAuth(0x30); // 需通過 2FA 或 網銀密碼 驗證才能進行金融卡開啟。
    }
  };

  const submitHandler = async (values) => {
    const {result, message, QLStatus } = await getQLStatus();

    if (result === 'true') {
      const auth = await checkQLStatus(QLStatus);
      if (auth && auth.result) {
        // TODO 打金融卡啟用的API，先用 mockData 代替
        const apiResponse = {result: true, message: 'errorMessage'};
        history.push('/S007001', {apiResponse});
      }
    } else {
      // 回傳失敗
      showCustomPrompt({message, onClose: () => closeFunc()});
    }
  };

  return (
    <Layout title="金融卡啟用">
      <DebitCardActiveWrapper>
        <form style={{ minHeight: 'initial' }} onSubmit={handleSubmit(submitHandler)}>
          <TextInputField
            type="number"
            labelName="我的金融卡帳號"
            name="accountNo"
            placeholder="請輸入金融卡帳號(金融卡背面14碼數字)"
            control={control}
          />
          <TextInputField
            type="number"
            labelName="我的金融卡序號"
            name="accountSn"
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
