/* eslint-disable no-unused-vars */
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Accordion from 'components/Accordion';
import { FEIBButton } from 'components/elements';
import { CheckboxField, TextInputField } from 'components/Fields';
import Layout from 'components/Layout/Layout';
import personalSaveContent from 'pages/ProjectJ/personalSaveContent';
import { closeFunc, getQLStatus, transactionAuth } from 'utilities/AppScriptProxy';
import { showAnimationModal, showCustomPrompt, showError } from 'utilities/MessageModal';
import DebitCardActiveWrapper from './S00700.style';
import { validationSchema } from './validationSchema';
import { successDesc } from './utils';

const S00700 = () => {
  const {control, handleSubmit} = useForm({
    defaultValues: {
      accountNo: '11111111111111',
      accountSn: '111111',
      termAgree: false,
    },
    resolver: yupResolver(validationSchema),
  });

  const submitHandler = async (values) => {
    const {
      result,
      message,
      QLStatus,
      QLType,
    } = await getQLStatus();

    if (result === 'true') {
      // 未綁定
      if (QLStatus === '0') {
        await showCustomPrompt({
          message: '無裝置綁定，請先進行裝置綁定設定或致電客服',
          onOk: async () => {
            try {
              const auth = await transactionAuth(0x30); // 需通過 2FA 或 網銀密碼 驗證才能關閉計劃。
              console.log('auuuuuuuuuuuuth', auth);
              if (auth.result) {
                showAnimationModal({
                  isSuccess: true,
                  successTitle: '金融卡設定結果',
                  errorTitle: '金融卡設定結果',
                  successDesc: successDesc(),
                  errorDesc: <div>設定失敗</div>,
                  onClose: () => closeFunc(),
                });
              } else {
                closeFunc();
              }
            } catch (error) {
              showAnimationModal({
                isSuccess: false,
                errorTitle: '驗證失敗',
                errorDesc: '網路密碼驗證失敗，請重新執行或致電客服',
                onClose: () => closeFunc(),
              });
            }
          },
          okContent: '若已綁定 (mockdata)，進行雙因子認證',

        });
      } else {
        console.log('yoyoyo');
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
            labelName="我的金融卡帳號"
            name="accountNo"
            placeholder="請輸入金融卡帳號(金融卡背面14碼數字)"
            control={control}
          />
          <TextInputField
            labelName="我的金融卡序號"
            name="accountSn"
            placeholder="請輸入金融卡序號(金融卡背面右下角6碼數字)"
            control={control}
          />
          <Accordion title="個人資料保護法告知事項" space="bottom">
            {personalSaveContent()}
          </Accordion>
          <CheckboxField label="我已同意並審閱個人資料保護法告知事項" name="termAgree" control={control} />
          <FEIBButton type="submit">
            確認
          </FEIBButton>
        </form>
      </DebitCardActiveWrapper>

    </Layout>
  );
};

export default S00700;
