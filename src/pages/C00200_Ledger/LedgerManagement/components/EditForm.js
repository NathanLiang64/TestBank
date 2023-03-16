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

// 編輯帳本名稱 - 表單元件
export const EditLedgerNameForm = ({
  nameDefaultValue = '',
  callback = () => {},
}) => {
  const dispatch = useDispatch();
  // 驗證設定
  const schema = yup.object().shape({
    ledgerName: yup.string().max(20).required('必填'),
  });
  // 表單設定
  const { control, handleSubmit } = useForm({
    defaultValues: { ledgerName: nameDefaultValue },
    resolver: yupResolver(schema),
    mode: 'onChange',
  });
  // 點擊 - 表單送出
  const onSubmitClick = ({ ledgerName }) => {
    callback(ledgerName);
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

// 編輯暱稱 - 表單元件
export const EditNickNameForm = ({
  nameDefaultValue = '',
  callback = () => {},
}) => {
  const dispatch = useDispatch();
  // 驗證設定
  const schema = yup.object().shape({
    nickName: yup.string().max(20).required('必填'),
  });
  // 表單設定
  const { control, handleSubmit } = useForm({
    defaultValues: { nickName: nameDefaultValue },
    resolver: yupResolver(schema),
    mode: 'onChange',
  });
  // 點擊 - 表單送出
  const onSubmitClick = ({ nickName }) => {
    callback(nickName);
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

// 編輯綁定帳號 - 表單欄位
export const EditAccountForm = ({
  nameDefaultValue = { bankCode: '', accountNumber: '' },
  dropOptions = [],
  callback = () => {},
}) => {
  const dispatch = useDispatch();
  // 驗證設定
  const schema = yup.object().shape({
    bankCode: yup.string().required('必填'),
    accountNumber: yup
      .string()
      .matches(/^[0-9]*$/, '只能輸入數字')
      .max(14, '銀行帳號最多14碼')
      .required('必填'),
  });
  // 表單設定
  const { control, handleSubmit } = useForm({
    defaultValues: nameDefaultValue,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });
  // 點擊 - 表單送出
  const onSubmitClick = ({ bankCode, accountNumber }) => {
    callback({ bankCode, accountNumber });
    dispatch(setModalVisible(false));
  };
  return (
    <Box>
      <DropdownField
        name="bankCode"
        control={control}
        options={dropOptions}
        labelName="綁定賬號"
      />
      <TextInputField
        labelName=""
        type="text"
        name="accountNumber"
        control={control}
        inputProps={{ maxLength: 20 }}
      />
      <Box mt={3}>
        <FEIBButton onClick={handleSubmit(onSubmitClick)}>確認</FEIBButton>
      </Box>
    </Box>
  );
};
