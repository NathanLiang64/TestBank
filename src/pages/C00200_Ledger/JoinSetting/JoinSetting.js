import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import Box from '@material-ui/core/Box';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Layout from 'components/Layout/Layout';
import { TextInputField, DropdownField } from 'components/Fields';
import { FEIBButton } from 'components/elements';
import { getBankCode } from 'utilities/CacheData';
import { showAnimationModal } from 'utilities/MessageModal';
import { Func } from 'utilities/FuncID';
import PageWrapper from './JoinSetting.style';
import { inviteJoin } from './api';

export default () => {
  const history = useHistory();
  const location = useLocation();
  const { state } = location;
  // 狀態設定
  const [bankCodeOptions, setBankCodeOptions] = useState([]);

  // 表單設定
  const schema = yup.object().shape({
    nickname: yup.string().max(5, '限5個中英文').required('必填'),
    bankCode: yup.string().required('必填'),
    account: yup
      .string()
      .matches(/^[0-9]*$/, '只能輸入數字')
      .max(14, '銀行帳號最多14碼')
      .required('必填'),
  });
  const { control, handleSubmit } = useForm({
    defaultValues: {
      nickname: '',
      bankCode: '',
      account: '',
    },
    resolver: yupResolver(schema),
  });
  const init = async () => {
    const resFromGetBankCode = await getBankCode();
    const formatBankCode = resFromGetBankCode.map((item) => ({
      label: `${item.bankNo} - ${item.bankName}`,
      value: item.bankNo,
    }));
    setBankCodeOptions(formatBankCode);
  };

  useEffect(() => {
    init();
  }, []);

  // 點擊 - 確認送出表單
  const onSubmitClick = async (data) => {
    const resFromInviteJoin = await inviteJoin({ ...data, token: state });
    showAnimationModal({
      isSuccess: resFromInviteJoin,
      successTitle: '設定成功',
      errorTitle: '設定失敗',
      onClose: () => resFromInviteJoin && history.push('C00200'),
    });
  };

  return (
    <Layout title="加入帳本" fid={Func.C002} goBackFunc={() => history.goBack()}>
      <PageWrapper>
        <Box mb={3}>
          <Box>請設定您在帳本所顯示的暱稱</Box>
          <Box>請提供一組帳號，以便日後帳本收款</Box>
        </Box>
        <Box my={2}>
          <TextInputField
            labelName="暱稱"
            type="text"
            control={control}
            name="nickname"
            inputProps={{ placeholder: '限5位中英文' }}
          />
        </Box>
        <Box my={2}>
          <DropdownField
            labelName="綁定帳號"
            name="bankCode"
            control={control}
            options={bankCodeOptions}
          />
          <TextInputField
            labelName=""
            type="text"
            control={control}
            name="account"
            inputProps={{ placeholder: '請輸入帳號' }}
          />
        </Box>
        <Box my={3}>
          <FEIBButton onClick={handleSubmit((data) => onSubmitClick(data))}>
            確定
          </FEIBButton>
        </Box>
      </PageWrapper>
    </Layout>
  );
};
