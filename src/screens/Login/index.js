import { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FormControl, FormControlLabel, InputLabel, Input, Checkbox, IconButton, InputAdornment,
} from 'themes/styleModules';
import {
  Visibility, VisibilityOff, RadioButtonChecked, RadioButtonUnchecked, ArrowForwardRounded,
} from '@material-ui/icons';

/* Styles */
import { LoginWrapper } from './login.style';

const Login = () => {
  const userInfo = useSelector(({ login }) => login.userInfo);
  const [values, setValues] = useState({
    id: '',
    userId: '',
    password: '',
    showPassword: false,
  });
  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };
  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  // const handleChangeRemember = (event) => {
  // };

  return (
    userInfo
      ? <Redirect to="/account" />
      : (
        <LoginWrapper $fullWidth>
          <form>
            <div className="title">
              <h3>Hello !</h3>
              <p>To be Friendlier & Smarter</p>
            </div>

            <div className="formItems">
              <div className="formItem">
                <FormControl>
                  <InputLabel htmlFor="id">身分證字號 / 手機號碼</InputLabel>
                  <Input id="id" />
                </FormControl>
              </div>
              <div className="formItem">
                <FormControl>
                  <InputLabel htmlFor="userId">使用者代號</InputLabel>
                  <Input id="userId" />
                </FormControl>
              </div>
              <div className="formItem">
                <FormControl>
                  <InputLabel htmlFor="password">密碼</InputLabel>
                  <Input
                    id="password"
                    type={values.showPassword ? 'text' : 'password'}
                    value={values.password}
                    onChange={handleChange('password')}
                    endAdornment={(
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {values.showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )}
                  />
                </FormControl>
              </div>
              <div className="formItem">
                <FormControlLabel
                  control={(
                    <Checkbox
                      icon={<RadioButtonUnchecked />}
                      checkedIcon={<RadioButtonChecked />}
                      name="remember"
                    />
                  )}
                  label="記住我的身分"
                />
                <div className="forgot">
                  <span>忘記使用者代號或密碼</span>
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
