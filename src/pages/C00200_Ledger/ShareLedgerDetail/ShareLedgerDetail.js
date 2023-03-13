import { useEffect } from 'react';
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
import PageWrapper from './ShareLedgerDetail.style';
import SHARE_LEDGER_IMG from './images/share_ledger_img.png';

export default () => {
  const history = useHistory();
  const { state = {} } = useLocation();
  const { friendName = '好友名稱' } = state;
  const schema = yup.object().shape({
    verifyCode: yup.string().required('必填'),
    ledgerInterval: yup.string().required('必填'),
    ledgerPeriod: yup.string().required('必填'),
  });
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      verifyCode: '',
      ledgerInterval: '',
      ledgerPeriod: '',
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
    shareMessage('分享明細');
  };

  return (
    <Layout title="分享明細" goBackFunc={() => history.goBack()}>
      <PageWrapper>
        <Box m={3}>
          <Box mb={3}>
            <Box component="img" src={SHARE_LEDGER_IMG} alt="分享明細" />
            <Box textAlign="center" my={1}>
              分享帳本給 [
              {friendName}
              ] 好友吧！
            </Box>
          </Box>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              <TextInputField
                labelName="帳本驗證碼*"
                type="text"
                control={control}
                name="verifyCode"
                inputProps={{ placeholder: '請輸入帳號' }}
              />
            </Grid>
            <Grid item>
              <DropdownField
                labelName="帳本明細區間*"
                name="ledgerInterval"
                control={control}
                options={[{ label: '遠銀', value: 'XXX' }]}
              />
            </Grid>
            <Grid item>
              <DropdownField
                labelName="連結有效期間*"
                name="ledgerPeriod"
                control={control}
                options={[{ label: '遠銀', value: 'XXX' }]}
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
