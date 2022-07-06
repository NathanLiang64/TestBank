/* eslint-disable object-curly-newline */
/* eslint-disable radix,no-restricted-globals */
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { setShowSpinner } from 'components/Spinner/stores/actions';
import {
  FEIBInput, FEIBErrorMessage, FEIBLinkButton, FEIBCheckbox, FEIBCheckboxLabel, FEIBIconButton,
} from 'components/elements';
import {
  ArrowBackIcon, ArrowNextIcon, CheckboxCheckedIcon, CheckboxUncheckedIcon, FaceIdIcon, VisibilityIcon, VisibilityOffIcon,
} from 'assets/images/icons';
import { accountValidation, identityValidation, passwordValidation } from 'utilities/validation';
import theme from 'themes/theme';
import Logo from 'assets/images/logoTransparent.png';
import BgImage from 'assets/images/loginBackground.png';
import HandShake from './HandShake';
import LoginWrapper from './login.style';
import FaceIdLoginModal from './faceIdLoginModal';
import RegisterModal from './registerModal';
// import { login, personalDataPreload, getInitData, getHomeData } from './login.api';
import { login, getInitData } from './login.api';

const Login = () => {
  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    account: accountValidation(),
    identity: identityValidation(),
    password: passwordValidation(),
  });
  const {
    control, handleSubmit, setValue, formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      identity: 'Y120409367', // Bankee台外數存(有很多明細資料)
      // identity: 'B100000039', // Bankee台外數存、遠智授扣、交割帳戶
      account: '1qaz2wsx',
      password: 'feib1688',
    },
  });

  const [showUserId, setShowUserId] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showFaceIdLogin, setShowFaceIdLogin] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(async () => {
    await HandShake();
    await getInitData();

    dispatch(setShowSpinner(false));
  }, []);

  const upperId = (e) => {
    setValue('identity', e.target.value.toUpperCase());
  };

  const handleFaceIdLoginOpen = () => {
    if (showFaceIdLogin) {
      // 當開啟時，再按一次；就當成是快登通過。
      // TODO 模擬快登。 ISG API尚未完成！
    }
    setShowFaceIdLogin(!showFaceIdLogin);
  };

  const handleActionsOpen = () => {
    setShowActions(!showActions);
  };

  const onSubmit = async (data) => {
    const isSuccess = await login(data);
    if (isSuccess) { // 登入成功
      // await personalDataPreload();
      // await getHomeData();
      history.push('/');
    }
  };

  return (
    <LoginWrapper fullScreen>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="head">
          <img src={Logo} alt="logo" />
          <span>Bankee 我們的社群銀行</span>
        </div>

        <div className="formItems" style={{ width: '100%' }}>
          <div>
            <Controller
              name="identity"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <FEIBInput {...field} id="identity" name="identity" placeholder="身分證字號/手機號碼" onBlur={(e) => upperId(e)} />
              )}
            />
            <FEIBErrorMessage>{errors.identity?.message}</FEIBErrorMessage>
          </div>

          <div>
            <Controller
              name="account"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <FEIBInput
                  {...field}
                  id="account"
                  name="account"
                  placeholder="使用者代號"
                  type={showUserId ? 'text' : 'password'}
                  $icon={showUserId ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  $iconOnClick={() => setShowUserId(!showUserId)}
                  autoComplete="off"
                />
              )}
            />
            <FEIBErrorMessage>{errors.account?.message}</FEIBErrorMessage>
          </div>

          <div>
            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <FEIBInput
                  {...field}
                  id="password"
                  name="password"
                  placeholder="密碼"
                  type={showPassword ? 'text' : 'password'}
                  $icon={showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  $iconOnClick={() => setShowPassword(!showPassword)}
                  autoComplete="off"
                />
              )}
            />
            <FEIBErrorMessage>{errors.password?.message}</FEIBErrorMessage>
          </div>

          <div className="rememberAccountArea">
            <FEIBCheckboxLabel
              control={<FEIBCheckbox icon={<CheckboxUncheckedIcon />} checkedIcon={<CheckboxCheckedIcon />} />}
              label="記住我的身分"
            />
            <div className="forgot">
              <FEIBLinkButton $color={theme.colors.text.lightGray}>
                忘記帳號或密碼
                <ArrowNextIcon />
              </FEIBLinkButton>
            </div>
          </div>
        </div>

        <div className="controlButtons">
          <div className="login">
            <FEIBIconButton
              className="fastLogin"
              $fontSize={2.4}
              onClick={handleFaceIdLoginOpen}
            >
              <FaceIdIcon />
            </FEIBIconButton>
            <button type="submit">
              登入
              <ArrowBackIcon />
            </button>
          </div>
          <div className="signup">
            <span>還沒有帳號？</span>
            <FEIBLinkButton $color={theme.colors.text.link} onClick={handleActionsOpen}>立即申請</FEIBLinkButton>
          </div>
        </div>
        <img src={BgImage} alt="logo" className="backgroundImage" />
      </form>
      <FaceIdLoginModal show={showFaceIdLogin} close={handleFaceIdLoginOpen} />
      <RegisterModal show={showActions} close={handleActionsOpen} />
    </LoginWrapper>
  );
};

export default Login;
