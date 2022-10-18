/* eslint-disable no-unused-vars */
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Accordion from 'components/Accordion';
import { FEIBButton } from 'components/elements';
import { CheckboxField, TextInputField } from 'components/Fields';
import Layout from 'components/Layout/Layout';
import personalSaveContent from 'pages/ProjectJ/personalSaveContent';
import {
  closeFunc, getQLStatus, transactionAuth,
} from 'utilities/AppScriptProxy';
import { showCustomPrompt } from 'utilities/MessageModal';
import { useHistory } from 'react-router';
import DebitCardActiveWrapper from './S00700.style';
import { validationSchema } from './validationSchema';

const S00700 = () => {
  const history = useHistory();
  const {control, handleSubmit} = useForm({
    defaultValues: {
      accountNo: '',
      accountSn: '',
    },
    resolver: yupResolver(validationSchema),
  });

  const submitHandler = async (values) => {
    const {
      result,
      message,
      QLStatus,
    } = await getQLStatus();

    if (result === 'true') {
      if (QLStatus === '0') {
        // 未綁定
        await showCustomPrompt({
          message: '無裝置綁定，請先進行裝置綁定設定或致電客服',
        });
      } else if (QLStatus === '3' || QLStatus === '4') {
        // 已綁定但不同裝置
        await showCustomPrompt({
          message: '您已進行裝置綁定，請至原裝置解除綁定或致電客服',
        });
      } else {
        const auth = await transactionAuth(0x30); // 需通過 2FA 或 網銀密碼 驗證才能進行金融卡開啟。
        if (auth.result) {
          // TODO 打金融卡啟用的API，先用 mockData 代替
          const debitActiveResponse = {result: true, message: 'errorMessage'};
          history.push(
            '/S007001',
            {
              isSuccess: !!debitActiveResponse?.result,
              successTitle: '設定成功',
              errorTitle: '設定失敗',
              errorDesc: debitActiveResponse?.message,
            },
          );
        }
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
          {/* <Accordion title="個人資料保護法告知事項" space="bottom">
            {personalSaveContent()}
          </Accordion>
          <CheckboxField label="我已同意並審閱個人資料保護法告知事項" name="termAgree" control={control} /> */}
          <FEIBButton type="submit">
            確認
          </FEIBButton>
        </form>
      </DebitCardActiveWrapper>

    </Layout>
  );
};

export default S00700;
