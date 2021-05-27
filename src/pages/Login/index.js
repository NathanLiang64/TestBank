/* eslint-disable radix,no-restricted-globals */
import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// import { useCheckLocation, usePageInfo } from 'hooks';
import * as yup from 'yup';
import {
  Visibility,
  VisibilityOff,
  ArrowForwardRounded,
  RadioButtonUnchecked,
  RadioButtonChecked,
} from '@material-ui/icons';
import {
  FEIBInput,
  FEIBInputLabel,
  FEIBInputAnimationWrapper,
  FEIBLinkButton,
  FEIBIconButton,
  FEIBCheckbox,
  FEIBCheckboxLabel,
} from 'components/elements';
import theme from 'themes/theme';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { useEffect } from 'react';
import LoginWrapper from './login.style';
import { setLoginFormValues } from './stores/actions';
import e2ee from '../../utilities/E2ee';
import { userLogin } from '../../apis/loginApi';
import getJwtKey from '../../utilities/DoGetToken';

const checkID = (id) => {
  const tab = 'ABCDEFGHJKLMNPQRSTUVXYWZIO';
  const A1 = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3];
  const A2 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5];
  const Mx = [9, 8, 7, 6, 5, 4, 3, 2, 1, 1];

  if (id.length !== 10) return false;
  let i = tab.indexOf(id.charAt(0));
  if (i === -1) return false;
  let sum = A1[i] + A2[i] * 9;

  for (i = 1; i < 10; i += 1) {
    const v = parseInt(id.charAt(i));
    if (isNaN(v)) return false;
    sum += v * Mx[i];
  }
  if (sum % 10 !== 0) return false;
  return true;
};

const Login = () => {
  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    // 身分證
    identity: yup.string().required('身分證字號尚未輸入，請確認，謝謝。')
      .test(
        'check-custID',
        '輸入錯誤，請重新填寫，謝謝。',
        (value) => checkID(value),
      ),
    account: yup.string().required('使用者代號尚未輸入，請確認，謝謝。')
      .min(6, '您輸入的使用者代號長度有誤，請重新輸入，謝謝。').max(20, '您輸入的使用者代號長度有誤，請重新輸入，謝謝。'),
    password: yup.string().required('密碼尚未輸入，請確認，謝謝。')
      .min(8, '您輸入的密碼長度有誤，請重新輸入，謝謝。').max(20, '您輸入的密碼長度有誤，請重新輸入，謝謝。'),
  });
  const {
    control, handleSubmit, setValue, formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  useEffect(() => {
    getJwtKey();
  }, []);
  const userInfo = useSelector(({ login }) => login.userInfo);
  const loginFormValues = useSelector(({ login }) => login.loginFormValues);

  const dispatch = useDispatch();
  // const handleChangeInput = (event) => {
  //   dispatch(setLoginFormValues({ ...loginFormValues, [event.target.name]: event.target.value }));
  // };
  const handleClickShowPassword = () => {
    dispatch(
      setLoginFormValues({ ...loginFormValues, showPassword: !loginFormValues.showPassword }),
    );
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const upperId = (e) => {
    setValue('identity', e.target.value.toUpperCase());
  };

  const onSubmit = async (data) => {
    data.identity = data.identity.toUpperCase();
    data.account = await e2ee(data.account);
    data.password = await e2ee(data.password);
    const response = await userLogin(data);
    localStorage.setItem('jwtToken', response);
  };

  // useCheckLocation();
  // usePageInfo('/api/login');

  return (
    userInfo
      ? <Redirect to="/shortcut" />
      : (
        <LoginWrapper fullScreen>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="title">
              <h3>Hello !</h3>
              <p>To be Friendlier & Smarter</p>
            </div>

            <div className="formItems" style={{ width: '100%' }}>
              <div style={{ width: '100%' }}>
                <FEIBInputAnimationWrapper>
                  <FEIBInputLabel
                    htmlFor="identity"
                    $color={theme.colors.basic.white}
                  >
                    身分證字號
                  </FEIBInputLabel>
                  <Controller
                    name="identity"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <FEIBInput
                        {...field}
                        id="identity"
                        name="identity"
                        $color={theme.colors.basic.white}
                        $borderColor={theme.colors.basic.white}
                        onBlur={(e) => upperId(e)}
                      />
                    )}
                  />
                </FEIBInputAnimationWrapper>
                <p>{errors.identity?.message}</p>
              </div>

              <div style={{ width: '100%' }}>
                <FEIBInputAnimationWrapper>
                  <FEIBInputLabel
                    htmlFor="account"
                    $color={theme.colors.basic.white}
                  >
                    使用者代號
                  </FEIBInputLabel>
                  <Controller
                    name="account"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <FEIBInput
                        {...field}
                        id="account"
                        name="account"
                        $color={theme.colors.basic.white}
                        $borderColor={theme.colors.basic.white}
                      />
                    )}
                  />
                </FEIBInputAnimationWrapper>
                <p>{errors.account?.message}</p>
              </div>

              <div style={{ width: '100%' }}>
                <FEIBInputAnimationWrapper>
                  <FEIBInputLabel htmlFor="password" $color={theme.colors.basic.white}>密碼</FEIBInputLabel>
                  <Controller
                    name="password"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <FEIBInput
                        {...field}
                        id="password"
                        name="password"
                        type={loginFormValues.showPassword ? 'text' : 'password'}
                        endAdornment={(
                          <FEIBIconButton
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            $iconColor={theme.colors.basic.white}
                          >
                            {loginFormValues.showPassword ? <Visibility /> : <VisibilityOff />}
                          </FEIBIconButton>
                        )}
                        $color={theme.colors.basic.white}
                        $borderColor={theme.colors.basic.white}
                      />
                    )}
                  />

                </FEIBInputAnimationWrapper>
                <p>{errors.password?.message}</p>
              </div>

              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <FEIBCheckboxLabel
                    control={(
                      <FEIBCheckbox
                        color="default"
                        $iconColor={theme.colors.basic.white}
                        icon={<RadioButtonUnchecked />}
                        checkedIcon={<RadioButtonChecked />}
                      />
                    )}
                    label="記住我的身分"
                    $color={theme.colors.basic.white}
                  />
                </div>
                <div className="forgot">
                  <FEIBLinkButton $color={theme.colors.basic.white}>忘記使用者代號或密碼</FEIBLinkButton>
                </div>
              </div>
            </div>

            <div className="controlButtons">
              <div className="login">
                <button type="submit">
                  登入
                  <ArrowForwardRounded />
                </button>
              </div>
              <div className="signup">
                <span>還沒有帳號嗎？</span>
                <FEIBLinkButton
                  className="boldLink"
                  $color={theme.colors.text.link}
                >
                  Sign up!
                </FEIBLinkButton>
              </div>
            </div>
          </form>
        </LoginWrapper>
      )
  );
};

export default Login;
