import { useForm } from 'react-hook-form';
import Box from '@material-ui/core/Box';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  TextareaField,
  TextInputField,
  DropdownField,
} from 'components/Fields';
import { FEIBButton } from 'components/elements';
import { useDispatch } from 'react-redux';
import { setModalVisible } from 'stores/reducers/ModalReducer';

// 編輯帳本名稱表單元件
export const EditLedgerNameForm = ({ callback = () => {} }) => {
  const dispatch = useDispatch();
  // 驗證設定
  const schema = yup.object().shape({
    ledgerName: yup.string().max(20).required('必填'),
  });
  // 表單設定
  const { control, handleSubmit, unregister } = useForm({
    defaultValues: { ledgerName: '' },
    resolver: yupResolver(schema),
    mode: 'onChange',
  });
  // 點擊 - 表單送出
  const onSubmitClick = ({ ledgerName }) => {
    callback(ledgerName);
    unregister('ledgerName');
    dispatch(setModalVisible(false));
  };
  return (
    <Box>
      <TextareaField
        control={control}
        name="ledgerName"
        rowsMin={3}
        rowsMax={6}
        limit={20}
      />
      <Box mt={1}>
        <FEIBButton onClick={handleSubmit(onSubmitClick)}>確認</FEIBButton>
      </Box>
    </Box>
  );
};

// 編輯暱稱表單元件
export const EditNickNameForm = ({ callback = () => {} }) => {
  const dispatch = useDispatch();
  // 驗證設定
  const schema = yup.object().shape({
    nickName: yup.string().max(20).required('必填'),
  });
  // 表單設定
  const { control, handleSubmit, unregister } = useForm({
    defaultValues: { nickName: '' },
    resolver: yupResolver(schema),
    mode: 'onChange',
  });
  // 點擊 - 表單送出
  const onSubmitClick = ({ nickName }) => {
    callback(nickName);
    unregister('nickName');
    dispatch(setModalVisible(false));
  };
  return (
    <Box>
      <TextareaField
        control={control}
        name="nickName"
        rowsMin={3}
        rowsMax={6}
        limit={20}
      />
      <Box mt={1}>
        <FEIBButton onClick={handleSubmit(onSubmitClick)}>確認</FEIBButton>
      </Box>
    </Box>
  );
};

// 編輯綁定帳號表單欄位
export const EditAccountForm = ({ callback = () => {} }) => {
  const dispatch = useDispatch();
  // 驗證設定
  const schema = yup.object().shape({
    bankCode: yup.string().required('必填'),
    bankAccount: yup.string().max(20).required('必填'),
  });
  // 表單設定
  const { control, handleSubmit, unregister } = useForm({
    defaultValues: { bankCode: '', bankAccount: '' },
    resolver: yupResolver(schema),
    mode: 'onChange',
  });
  // 點擊 - 表單送出
  const onSubmitClick = ({ bankCode, bankAccount }) => {
    callback({ bankCode, bankAccount });
    unregister('data');
    dispatch(setModalVisible(false));
  };
  return (
    <Box>
      <DropdownField
        name="bankCode"
        control={control}
        options={[
          { label: '805 - 遠東銀行', value: '805' },
          { label: 'XXX - XX銀行', value: 'XXX' },
        ]}
        labelName="綁定賬號"
      />
      <TextInputField
        labelName=""
        type="text"
        name="bankAccount"
        control={control}
        inputProps={{ maxLength: 20 }}
      />
      <Box mt={1}>
        <FEIBButton onClick={handleSubmit(onSubmitClick)}>確認</FEIBButton>
      </Box>
    </Box>
  );
};
