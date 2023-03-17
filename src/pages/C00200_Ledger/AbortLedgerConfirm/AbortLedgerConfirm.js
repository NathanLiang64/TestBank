import { useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { Box } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { TextInputField } from 'components/Fields';
import Layout from 'components/Layout/Layout';
import InformationList from 'components/InformationList';
import { FEIBButton } from 'components/elements';
import Accordion from 'components/Accordion';
import PageWrapper from './AbortLedgerConfirm.style';
import { getLedgerTypeName } from '../utils/lookUpTable';

export default () => {
  const history = useHistory();
  // 狀態設定
  const location = useLocation();
  const { state } = location;
  const [viewModel] = useState(state || {});
  // 表單設定
  const schema = yup.object().shape({
    verifyCode: yup
      .string()
      .matches(/^[0-9]*$/, '只能輸入數字')
      .min(4, '請輸入4位數字驗證碼')
      .max(4, '請輸入4位數字驗證碼')
      .required('必填'),
  });
  const { control, handleSubmit } = useForm({
    defaultValues: {
      verifyCode: '',
    },
    resolver: yupResolver(schema),
  });

  const CONFIG = [
    { id: 1, label: '帳本名稱', value: viewModel.ledgerName },
    { id: 2, label: '帳本餘額', value: viewModel.ledgerAmount },
    { id: 3, label: '連結帳號', value: viewModel.bankeeAccount?.accountNumber },
    {
      id: 4,
      label: '帳本類型',
      value: getLedgerTypeName(viewModel.ledgerType),
    },
  ];

  // 點擊 - 確認
  const onSubmitClick = (data) => {
    console.log(data);
    history.push('/AbortLedgerSuccess', { ...state, ...data });
  };

  return (
    <Layout title="終止帳本" goBackFunc={() => history.goBack()}>
      <PageWrapper>
        <Box className="pageTitle">確認資料</Box>
        {CONFIG.map((item) => (
          <InformationList
            key={item.id}
            title={item.label}
            content={item.value}
          />
        ))}
        <Box mt={3}>
          <TextInputField
            labelName="帳本驗證碼*"
            type="text"
            control={control}
            name="verifyCode"
            inputProps={{ placeholder: '請輸入帳本驗證碼' }}
          />
        </Box>
        <Accordion title="注意事項" space="top" open>
          帳本終止後，帳本明細會發送給帳本成員，請設定帳本明細驗證碼
        </Accordion>
        <FEIBButton
          onClick={handleSubmit((data) => onSubmitClick(data))}
          style={{ marginTop: 20 }}
        >
          確認
        </FEIBButton>
      </PageWrapper>
    </Layout>
  );
};
