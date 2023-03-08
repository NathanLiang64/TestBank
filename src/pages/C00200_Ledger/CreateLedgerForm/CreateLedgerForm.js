import { useEffect } from 'react';
import { useHistory } from 'react-router';
import Box from '@material-ui/core/Box';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from 'styled-components';
import Layout from 'components/Layout/Layout';
import {
  TextInputField,
  DropdownField,
  RadioGroupField,
  CheckboxField,
} from 'components/Fields';
import Accordion from 'components/Accordion';
import { FEIBButton } from 'components/elements';
import { LedgerTerms, SubLedgerTerms } from './components/Terms';
import ColorBall from './components/ColorBall';
import PageWrapper from './CreateLedgerForm.style';

export default () => {
  const history = useHistory();
  const theme = useTheme();
  const schema = yup.object().shape({
    ledgerName: yup.string().required('必填'),
    ledgerColor: yup.string().required('必填'),
    ledgerNickName: yup.string(),
    ledgerCategory: yup.string().required('必填'),
    ledgerAccount: yup.string().required('必填'),
    isSharingLedger: yup.boolean(),
    isAgreeLedgerTerms: yup.boolean().oneOf([true], '必填'),
  });
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      ledgerName: '',
      ledgerColor: '',
      ledgerNickName: '',
      ledgerCategory: '',
      ledgerAccount: '',
      isSharingLedger: false,
      isAgreeLedgerTerms: false,
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
    history.push('/CreateLedgerSuccess');
  };

  return (
    <Layout title="建立帳本" goBackFunc={() => history.goBack()}>
      <PageWrapper>
        <Box className="formFileds">
          <TextInputField
            labelName="帳本名稱"
            type="text"
            control={control}
            name="ledgerName"
            inputProps={{ placeholder: '為帳本取個名字' }}
          />
          <RadioGroupField
            labelName="帳本顏色"
            name="ledgerColor"
            control={control}
            row
            // 帳本顏色根據專案 theme 內的 card 設定
            options={Object.entries(theme.colors.card).map(
              ([colorLabel, colorCode]) => ({
                label: <ColorBall color={colorCode} />,
                value: colorLabel,
              }),
            )}
          />
          <TextInputField
            labelName="暱稱"
            type="text"
            control={control}
            name="ledgerNickName"
            inputProps={{ placeholder: '為帳本取個暱稱' }}
          />
          <DropdownField
            labelName="類型"
            name="ledgerCategory"
            control={control}
            options={[
              { label: '聚餐', value: 'dinner' },
              { label: '活動', value: 'activity' },
            ]}
          />
          <DropdownField
            labelName="連結帳戶"
            name="ledgerAccount"
            control={control}
            options={[
              { label: '1234567890123456', value: '1234567890123456' },
              { label: '987654321123456', value: '987654321123456' },
            ]}
          />
          <CheckboxField
            labelName="與成員分享明細"
            control={control}
            name="isSharingLedger"
          />
          <Accordion title="帳本條款">
            <LedgerTerms />
          </Accordion>
          <Accordion title="子帳戶特別約定事項">
            <SubLedgerTerms />
          </Accordion>
          <CheckboxField
            labelName="本人已閱讀並同意上述條款"
            control={control}
            name="isAgreeLedgerTerms"
          />
          <FEIBButton onClick={handleSubmit((data) => onSubmitClick(data))}>
            確認
          </FEIBButton>
        </Box>
      </PageWrapper>
    </Layout>
  );
};
