/* eslint-disable radix,no-restricted-globals */
import { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useHistory } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { setShowSpinner } from 'components/Spinner/stores/actions';
import { useCheckLocation, usePageInfo } from 'hooks';
// import { userLogin } from 'apis/loginApi';
import {
  FEIBInput, FEIBErrorMessage, FEIBLinkButton, FEIBCheckbox, FEIBCheckboxLabel, FEIBIconButton,
} from 'components/elements';
import {
  ArrowBackIcon, ArrowNextIcon, CheckboxCheckedIcon, CheckboxUncheckedIcon, FaceIdIcon, VisibilityIcon, VisibilityOffIcon,
} from 'assets/images/icons';
// import e2ee from 'utilities/E2ee';
import { setFavoriteDrawer } from 'pages/Favorite/stores/actions';
import getJwtKey from 'utilities/DoGetToken';
import { goToFunc } from 'utilities/BankeePlus';
import { accountValidation, identityValidation, passwordValidation } from 'utilities/validation';
import theme from 'themes/theme';
import Logo from 'assets/images/logoTransparent.png';
import BgImage from 'assets/images/loginBackground.png';
import LoginWrapper from './login.style';

// import CipherUtil from '../../utilities/CipherUtil';
// import userAxios from '../../apis/axiosConfig';
// import JWEUtil from '../../utilities/JWEUtil';

const Login = () => {
  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    ...identityValidation, ...accountValidation, ...passwordValidation,
  });
  const {
    control, handleSubmit, setValue, formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [showUserId, setShowUserId] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    // getJwtKey();
    dispatch(setShowSpinner(false));

    // 避免我的最愛 catch 住，在開啟 APP 後就顯示
    dispatch(setFavoriteDrawer({
      title: '我的最愛', open: false, content: '', back: null,
    }));
  }, []);

  const userInfo = useSelector(({ login }) => login.userInfo);

  const upperId = (e) => {
    setValue('identity', e.target.value.toUpperCase());
  };
  // const iv = CipherUtil.generateIV();
  // const aesKey = CipherUtil.generateAES();
  // const getPublicAndPrivate = CipherUtil.generateRSA();
  // const txnId = 'WEBCTLff7fd095-2cd0-4418-94cb-023256911c06';
  // const channelCode = 'HHB_A';
  // const appVersion = '1.0.15';
  // const txSeq = '20210802155847';

  // const onSubmit = async (data) => {
  //   consolw.log(data);
  //   const ServerPublicKey = await userAxios.post('/auth/getPublicKey'); // 取得公鑰
  //   const jweRq = {
  //     publicKey: getPublicAndPrivate.publicKey.replace(/(\r\n\t|\r\n|\n|\r\t)/gm, '').replace('-----BEGIN PUBLIC KEY-----', '').replace('-----END PUBLIC KEY-----', ''),
  //     iv,
  //     aesKey,
  //     txnId,
  //     channelCode,
  //     appVersion,
  //     txSeq,
  //     custId: data.identity.toUpperCase(),
  //     username: await e2ee(data.account),
  //     password: await e2ee(data.password),
  //   };
  //   // console.log('jweRq', jweRq);
  //   // data.identity = data.identity.toUpperCase();
  //   // data.account = await e2ee(data.account);
  //   // data.password = await e2ee(data.password);
  //   // const response = await userLogin(data);

  //   const getJWTToken = JWEUtil.encryptJWEMessage(ServerPublicKey.data.data.result, JSON.stringify(jweRq));
  //   const response = await userLogin(getJWTToken);
  //   // console.log('jwtToken', response);
  //   localStorage.setItem('jwtToken', response);
  //   if (response.data.message === 'Success!!' && response.data.code === '0000') {
  //     // alert('登入成功');
  //   }
  // };

  const onSubmit = async (data) => {
    const { result, message } = await getJwtKey(data);
    if (result === 'success') {
      console.log('login success');
      try {
        alert('登入成功');
        goToFunc('home');
      } catch (error) {
        history.push('/');
      }
    } else {
      alert(message);
    }
  };

  useCheckLocation();
  usePageInfo('/api/login');

  return (
    userInfo
      ? <Redirect to="/shortcut" />
      : (
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
                  // onClick={onClose}
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
                <FEIBLinkButton $color={theme.colors.text.link}>立即申請</FEIBLinkButton>
              </div>
            </div>
            <img src={BgImage} alt="logo" className="backgroundImage" />
          </form>
        </LoginWrapper>
      )
  );
};

export default Login;
