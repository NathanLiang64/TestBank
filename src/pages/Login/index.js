import { Redirect } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCheckLocation, usePageInfo } from 'hooks';
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
import LoginWrapper from './login.style';
import { setLoginFormValues } from './stores/actions';

const Login = () => {
  const userInfo = useSelector(({ login }) => login.userInfo);
  const loginFormValues = useSelector(({ login }) => login.loginFormValues);

  const dispatch = useDispatch();
  const handleChangeInput = (event) => {
    dispatch(setLoginFormValues({ ...loginFormValues, [event.target.name]: event.target.value }));
  };
  const handleClickShowPassword = () => {
    dispatch(
      setLoginFormValues({ ...loginFormValues, showPassword: !loginFormValues.showPassword }),
    );
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  useCheckLocation();
  usePageInfo('/api/login');

  return (
    userInfo
      ? <Redirect to="/account" />
      : (
        <LoginWrapper fullScreen>
          <form>
            <div className="title">
              <h3>Hello !</h3>
              <p>To be Friendlier & Smarter</p>
            </div>

            <div className="formItems" style={{ width: '100%' }}>
              <div style={{ width: '100%' }}>
                <FEIBInputAnimationWrapper>
                  <FEIBInputLabel
                    htmlFor="id"
                    $color={theme.colors.basic.white}
                  >
                    身分證字號 / 手機號碼
                  </FEIBInputLabel>
                  <FEIBInput
                    id="id"
                    name="id"
                    value={loginFormValues.id}
                    $color={theme.colors.basic.white}
                    $borderColor={theme.colors.basic.white}
                    onChange={handleChangeInput}
                  />
                </FEIBInputAnimationWrapper>
              </div>

              <div style={{ width: '100%' }}>
                <FEIBInputAnimationWrapper>
                  <FEIBInputLabel
                    htmlFor="userId"
                    $color={theme.colors.basic.white}
                  >
                    使用者代號
                  </FEIBInputLabel>
                  <FEIBInput
                    id="userId"
                    name="userId"
                    value={loginFormValues.userId}
                    $color={theme.colors.basic.white}
                    $borderColor={theme.colors.basic.white}
                    onChange={handleChangeInput}
                  />
                </FEIBInputAnimationWrapper>
              </div>

              <div style={{ width: '100%' }}>
                <FEIBInputAnimationWrapper>
                  <FEIBInputLabel htmlFor="password" $color={theme.colors.basic.white}>密碼</FEIBInputLabel>
                  <FEIBInput
                    id="password"
                    name="password"
                    value={loginFormValues.password}
                    type={loginFormValues.showPassword ? 'text' : 'password'}
                    onChange={handleChangeInput}
                    endAdornment={(
                      <FEIBIconButton
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        $iconColor={theme.colors.basic.white}
                      >
                        {loginFormValues.showPassword ? <VisibilityOff /> : <Visibility />}
                      </FEIBIconButton>
                    )}
                    $color={theme.colors.basic.white}
                    $borderColor={theme.colors.basic.white}
                  />
                </FEIBInputAnimationWrapper>
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
                <span className="textLink">Sign up!</span>
              </div>
            </div>
          </form>
        </LoginWrapper>
      )
  );
};

export default Login;
