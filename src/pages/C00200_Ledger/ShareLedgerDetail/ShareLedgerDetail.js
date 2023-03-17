import { useState } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { useLocation, useHistory } from 'react-router';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Layout from 'components/Layout/Layout';
import { TextInputField, DropdownField } from 'components/Fields';
import { FEIBButton } from 'components/elements';
import { shareMessage } from 'utilities/AppScriptProxy';
import { showAnimationModal } from 'utilities/MessageModal';
import PageWrapper from './ShareLedgerDetail.style';
import SHARE_LEDGER_IMG from './images/share_ledger_img.png';
import { toShare } from './api';

export default () => {
  const history = useHistory();
  const location = useLocation();
  // 狀態設定
  const { state } = location;
  const [viewModel] = useState(state || {});
  // 表單設定
  const schema = yup.object().shape({
    pinCode: yup
      .string()
      .matches(/^[0-9]*$/, '只能輸入數字')
      .min(4, '請輸入4位數字驗證碼')
      .max(4, '請輸入4位數字驗證碼')
      .required('必填'),
    txnDays: yup.string().required('必填'),
    validDays: yup.string().required('必填'),
  });
  const { control, handleSubmit } = useForm({
    defaultValues: {
      pinCode: '',
      txnDays: 7,
      validDays: 1,
    },
    resolver: yupResolver(schema),
  });
  // 下拉選項設定
  const txnDaysOptions = [
    { label: '近一週', value: 7 },
    { label: '近一個月', value: 30 },
    { label: '近三個月', value: 90 },
  ];

  const validDaysOptions = [
    { label: '1天', value: 1 },
    { label: '3天', value: 3 },
    { label: '7天', value: 7 },
    { label: '14天', value: 14 },
  ];

  // 點擊 - 確認送出表單
  const onSubmitClick = async (data) => {
    const resFromToShare = await toShare(data);
    if (!resFromToShare) {
      showAnimationModal({
        isSuccess: false,
        errorTitle: '設定失敗',
      });
      return null;
    }
    shareMessage(resFromToShare);
    return null;
  };

  return (
    <Layout title="分享明細" goBackFunc={() => history.goBack()}>
      <PageWrapper>
        <Box m={3}>
          <Box mb={3}>
            <Box component="img" src={SHARE_LEDGER_IMG} alt="分享明細" />
            <Box textAlign="center" my={1}>
              分享帳本 [
              {viewModel.ledgerName}
              ] 給好友吧！
            </Box>
          </Box>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <TextInputField
                labelName="帳本驗證碼*"
                type="text"
                control={control}
                name="pinCode"
                inputProps={{ placeholder: '驗證碼限4位數' }}
              />
            </Grid>
            <Grid item>
              <DropdownField
                labelName="帳本明細區間*"
                name="txnDays"
                control={control}
                options={txnDaysOptions}
              />
            </Grid>
            <Grid item>
              <DropdownField
                labelName="連結有效期間*"
                name="validDays"
                control={control}
                options={validDaysOptions}
              />
            </Grid>
          </Grid>
          <Box mt={3}>
            <FEIBButton onClick={handleSubmit((data) => onSubmitClick(data))}>
              確定
            </FEIBButton>
          </Box>
        </Box>
      </PageWrapper>
    </Layout>
  );
};
