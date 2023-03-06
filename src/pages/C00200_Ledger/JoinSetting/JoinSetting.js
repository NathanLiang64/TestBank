import { useEffect } from 'react';
import Box from '@material-ui/core/Box';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Layout from 'components/Layout/Layout';
import { TextInputField, DropdownField } from 'components/Fields';
import { FEIBButton } from 'components/elements';
import PageWrapper from './JoinSetting.style';

export default () => {
  const schema = yup.object().shape({
    nickName: yup.string().required('必填'),
    accountCode: yup.string().required('必填'),
    accountNumber: yup.string().required('必填'),
  });
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      nickNmae: '',
      accountCode: '',
      accountNumber: '',
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    reset((formValues) => ({
      ...formValues,
    }));
  }, []);

  // 點擊 - 確認送出表單
  const onSubmitClick = (data) => {
    console.log(data);
  };

  return (
    <Layout title="加入帳本" goBackFunc={() => {}}>
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
            name="nickName"
            inputProps={{ placeholder: '限5位中英文' }}
          />
        </Box>
        <Box my={2}>
          <DropdownField
            labelName="綁定帳號"
            name="accountCode"
            control={control}
            options={[{ label: '遠銀', value: 'XXX' }]}
          />
          <TextInputField
            labelName=""
            type="text"
            control={control}
            name="accountNumber"
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
