import { useForm } from 'react-hook-form';
import Box from '@material-ui/core/Box';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { TextareaField } from 'components/Fields';
import { FEIBButton } from 'components/elements';
import { useDispatch } from 'react-redux';
import { setModalVisible } from 'stores/reducers/ModalReducer';

// 編輯公告表單元件
export const EditNotifyForm = ({
  memoDefaultValue = '',
  callback = () => {},
}) => {
  const dispatch = useDispatch();
  // 驗證設定
  const schema = yup.object().shape({
    memo: yup.string().max(12, '限制字數為12個字元').required('請輸入文字'),
  });
  // 表單設定
  const { control, handleSubmit } = useForm({
    defaultValues: { memo: memoDefaultValue },
    resolver: yupResolver(schema),
    mode: 'onChange',
  });
  // 點擊 - 表單送出
  const onSubmitClick = ({ memo }) => {
    callback(memo);
    dispatch(setModalVisible(false));
  };
  return (
    <Box>
      <TextareaField
        control={control}
        name="memo"
        rowsMin={3}
        rowsMax={6}
        limit={12}
      />
      <Box mt={1}>
        <FEIBButton onClick={handleSubmit(onSubmitClick)}>確認</FEIBButton>
      </Box>
    </Box>
  );
};
