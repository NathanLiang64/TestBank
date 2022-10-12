/* eslint-disable no-unused-vars */

import { useState, useEffect } from 'react';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import styled from 'styled-components';
import {
  FEIBButton, FEIBErrorMessage, FEIBInput, FEIBInputLabel,
} from 'components/elements';
import ConfirmButtons from 'components/ConfirmButtons';
import theme from 'themes/theme';
import { OTPVerify } from './api';

const OTPDrawerWrapper = styled.div`
  padding: 1rem;

  .hint_container {
    margin: 2rem 0 4rem 0;
    color: ${theme.colors.text.dark};
    font-size: 14px;

    .hint_link_text {
      color: ${theme.colors.text.light};
    }
  }

  .countDownCard {
    background: ${theme.colors.background.lighterBlue};
    padding: 1.2rem 1.6rem;
    margin: 0 auto 2.4rem auto;
    position: relative;
    border-radius: .8rem;
    .countDownLabel {
      color: ${theme.colors.text.darkGray};
    }
    .countDownInfo {
      display: flex;
      justify-content: space-between;
      .getNewOTP {
        width: 15rem;
        min-height: 2rem;
        margin: 0 0 0 auto;
        color: ${theme.colors.text.darker};
      }
    }
  }
  .countSec {
    font-size: 3rem;
    color: ${theme.colors.state.danger};
  }

  .otpInput {
    margin-bottom: 10rem;
  }

  .btns {
    margin: 2rem 0;
  }
`;

const CountDown = () => {
  const [countSec, setCountSec] = useState(5 * 60);

  const formatCountSec = (count) => {
    const min = Math.floor(count / 60);
    const sec = count % 60;
    return `${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`;
  };

  useEffect(() => {
    const countDown = setInterval(() => {
      if (countSec > 0) {
        // eslint-disable-next-line no-shadow
        setCountSec((countSec) => countSec - 1);
      }
    }, 1000);
    return () => clearInterval(countDown);
  }, [countSec]);

  return (
    <p className="countSec">{ formatCountSec(countSec) }</p>
  );
};

/**
   * OTP驗證 Drawer 內容
   * TODO: 此元件應為共用元件。在共用元件製作完成前先暫時使用此元件。
   * @param {isEdit} isEdit input可／不可 編輯、hint文字顯示
   * @param {mobile} mobile model.mobile
   * @returns drawer content
   */
const T00300OTPDrawerContent = ({
  mobile, handleConfirm,
}) => {
  /**
   * 資料驗證
   */
  const schema = yup.object().shape({
    otpCode: yup.string().matches(/^[0-9]{6}$/, '請輸入正確的 OTP 驗證碼').required('請輸入 OTP 驗證碼'),
  });
  const { handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      otpCode: '',
    },
    resolver: yupResolver(schema),
  });

  const onConfirmClick = async (data) => {
    console.log('T00300 T00300OTPDrawerContent() data: ', data);

    // TODO: OTP驗證api
    const result = await OTPVerify(data.otpCode);

    // 回傳成功／失敗值
    handleConfirm(result);
  };

  return (
    <OTPDrawerWrapper>
      {/* 時間倒數＋重新寄送 */}
      <div className="countDownCard">
        <div className="countDownLabel">時間倒數</div>
        <div className="countDownInfo">
          <CountDown />
          <FEIBButton
            className="getNewOTP"
            $color={theme.colors.primary.dark}
            $borderColor="#DBE1F0"
            $bgColor="#DBE1F0"
          >
            重新寄驗證碼
          </FEIBButton>
        </div>
      </div>

      {/* 驗證碼輸入 */}
      <div className="otpInput">
        <FEIBInputLabel>一次性OTP驗證</FEIBInputLabel>
        <Controller
          name="otpCode"
          defaultValue=""
          control={control}
          render={({ field }) => (
            <FEIBInput
              {...field}
              type="text"
              id="otpCode"
              name="otpCode"
              placeholder="請輸入 OTP 驗證碼"
              error={!!errors.otpCode}
            />
          )}
        />
        <FEIBErrorMessage>{errors.otpCode?.message}</FEIBErrorMessage>
      </div>
      {/* btns */}
      <div className="btns">
        <FEIBButton onClick={handleSubmit((data) => onConfirmClick(data))}>送出</FEIBButton>
      </div>
    </OTPDrawerWrapper>
  );
};

export default T00300OTPDrawerContent;
