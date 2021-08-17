import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import BottomDrawer from 'components/BottomDrawer';
import { FEIBButton } from 'components/elements';
import PasswordInput from 'components/PasswordInput';
import { passwordValidation } from 'utilities/validation';
import { setIsPasswordRequired, setResult } from './stores/actions';
import PasswordDrawerWrapper from './passwordDrawer.style';

// TODO: trying refactor (using custom hook to check)
const PasswordDrawer = () => {
  const schema = yup.object().shape({
    ...passwordValidation,
  });
  const { handleSubmit, control, formState: { errors } } = useForm({ resolver: yupResolver(schema) });
  const isPasswordRequired = useSelector(({ passwordDrawer }) => passwordDrawer.isPasswordRequired);
  const dispatch = useDispatch();

  // eslint-disable-next-line
  const handleClickSubmit = (data) => {
    if (data.password === '1qaz2wsx') {
      dispatch(setResult(true));
      // dispatch(setFastLogin(false));
      dispatch(setIsPasswordRequired(false));
    } else {
      // console.log('不通過');
      dispatch(setResult(false));
    }
  };

  return (
    <BottomDrawer
      title="輸入網銀密碼"
      isOpen={isPasswordRequired}
      onClose={() => dispatch(setIsPasswordRequired(false))}
      content={(
        <PasswordDrawerWrapper>
          <form onSubmit={handleSubmit(handleClickSubmit)}>
            <PasswordInput
              id="password"
              name="password"
              control={control}
              errorMessage={errors.password?.message}
            />
            <FEIBButton type="submit">送出</FEIBButton>
          </form>
        </PasswordDrawerWrapper>
      )}
    />
  );
};

export default PasswordDrawer;
