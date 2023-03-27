import { useEffect, useState, useRef } from 'react';
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
import { getAccountsList } from 'utilities/CacheData';
import { showAnimationModal } from 'utilities/MessageModal';
import { transactionAuth } from 'utilities/AppScriptProxy';
import { Func } from 'utilities/FuncID';
import { LedgerTerms, SubLedgerTerms } from './components/Terms';
import ColorBall from './components/ColorBall';
import PageWrapper from './CreateLedgerForm.style';
import { ledgerTypeList } from '../utils/lookUpTable';
import { create } from './api';

export default () => {
  const history = useHistory();
  const theme = useTheme();
  const isMounted = useRef(false);
  // 表單設定
  const schema = yup.object().shape({
    name: yup.string().max(12, '不能超過12個字').required('必填'),
    color: yup.string().required('必填'),
    nickname: yup.string().max(5, '限5個中英文').required('必填'),
    type: yup.string().required('必填'),
    account: yup.string().required('必填'),
    isShare: yup.boolean(),
    isAgree: yup.boolean().oneOf([true], '必填'),
  });
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      name: '',
      color: '1',
      nickname: '',
      type: '',
      account: '',
      isShare: true,
      isAgree: false,
    },
    resolver: yupResolver(schema),
  });
  // 狀態設定
  const [allowBindAccounts, setAllowBindAccounts] = useState([]);
  const [ledgerTypes, setLedgerTypes] = useState([]);
  // 初始設定
  const init = async () => {
    const ledgerTypeOptions = ledgerTypeList.map((i) => ({
      label: i.typeName,
      value: i.ledgerType,
    }));
    setLedgerTypes(ledgerTypeOptions);
    getAccountsList('C', (accounts) => {
      /**
       * bindType
       * 0: 未綁定
       * 1: 綁定社群帳本
       * 2: 綁定存錢計畫
       * 可綁定帳號選項只秀還未綁定的帳號
       */
      const allowBindAccountList = accounts.filter(
        (item) => item.bindType === 0,
      );
      const formatAllowBindAccounts = allowBindAccountList.map((item) => ({
        label: item.accountNo,
        value: item.accountNo,
      }));
      const allowCreateSubAccts = accounts.length < 8;
      if (allowCreateSubAccts) {
        setAllowBindAccounts([
          ...formatAllowBindAccounts,
          { label: '加開子帳戶', value: 'new' },
        ]);
      } else {
        setAllowBindAccounts(formatAllowBindAccounts);
      }
    });
  };
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      init();
    } else {
      reset((p) => ({
        ...p,
        account: allowBindAccounts[0]?.value,
        type: ledgerTypes[0]?.value,
      }));
    }
  }, [allowBindAccounts, ledgerTypes]);

  // 點擊 - 確認送出表單
  const onSubmitClick = async (data) => {
    const jsRs = await transactionAuth(Func.C002.authCode);
    if (jsRs.result) {
      delete data.isAgree;
      data.color = parseInt(data.color, 10);
      const resFrom = await create(data);
      if (!resFrom) {
        showAnimationModal({
          isSuccess: false,
          errorTitle: '設定失敗',
        });
        return null;
      }
      history.push('/CreateLedgerSuccess', resFrom);
      return null;
    }
    return null;
  };

  return (
    <Layout title="建立帳本" goBackFunc={() => history.goBack()}>
      <PageWrapper>
        <Box className="formFileds">
          <TextInputField
            labelName="帳本名稱"
            type="text"
            control={control}
            name="name"
            inputProps={{ placeholder: '為帳本取個名字' }}
          />
          <RadioGroupField
            labelName="帳本顏色"
            name="color"
            control={control}
            row
            // 帳本顏色根據專案 theme 內的 card 設定
            options={Object.values(theme.colors.card).map((colorCode, idx) => ({
              label: <ColorBall color={colorCode} />,
              value: (idx + 1).toString(),
            }))}
          />
          <TextInputField
            labelName="暱稱"
            type="text"
            control={control}
            name="nickname"
            inputProps={{ placeholder: '為帳本取個暱稱' }}
          />
          <DropdownField
            labelName="類型"
            name="type"
            control={control}
            options={ledgerTypes}
          />
          <DropdownField
            labelName="連結帳戶"
            name="account"
            control={control}
            options={allowBindAccounts}
          />
          <CheckboxField
            labelName="與成員分享明細"
            control={control}
            name="isShare"
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
            name="isAgree"
          />
          <Box mb={3}>
            <FEIBButton onClick={handleSubmit((data) => onSubmitClick(data))}>
              確認
            </FEIBButton>
          </Box>
        </Box>
      </PageWrapper>
    </Layout>
  );
};
