/* eslint-disable no-unused-vars */

import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import styled from 'styled-components';
import { FEIBErrorMessage, FEIBInput, FEIBInputLabel } from 'components/elements';
import ConfirmButtons from 'components/ConfirmButtons';

const DrawerContentWrapper = styled.div`
  padding: 1rem;

  .hint_container {
    margin: 2rem 0 4rem 0;
    color: ${({theme}) => theme.colors.text.dark};
    font-size: 14px;

    .hint_link_text {
      color: ${({theme}) => theme.colors.text.light};
    }
  }

  .btns {
    margin: 2rem 0;
  }
`;
/**
   * 非約轉交易門號 Drawer 內容
   * @param {isEdit} isEdit input可／不可 編輯、hint文字顯示
   * @param {mobile} mobile model.mobile
   * @returns drawer content
   */
const T00300DrawerContent = ({
  isEdit, mobile, handleConfirm, handleCancel,
}) => {
  /**
   * 資料驗證
   */
  const schema = yup.object().shape({
    mobileNumber: yup.string().matches(/^[0-9]{10}$/, '請輸入正確的手機號碼').required('請輸入手機號碼'),
  });
  const { handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      mobileNumber: mobile,
    },
    resolver: yupResolver(schema),
  });

  const onConfirmClick = (data) => {
    console.log('T00300 T00300DrawerContent() data: ', data);

    handleConfirm({isEdit, data});
  };

  return (
    <DrawerContentWrapper>
      <div>
        <FEIBInputLabel>非約定轉帳交易門號</FEIBInputLabel>
        <Controller
          name="mobileNumber"
          control={control}
          render={({field}) => (
            <FEIBInput
              {...field}
              disabled={!isEdit}
              value={field.value}
              placeholder="請輸入手機號碼"
              error={!!errors.mobileNumber}
            />
          )}
        />
        <FEIBErrorMessage>{errors.mobileNumber?.message}</FEIBErrorMessage>
        <div className="hint_container">
          點選確認即同意進行非約定轉帳設定與
          <span className="hint_link_text">
            非約定轉帳使用條款
          </span>
          {!isEdit
            ? (<>，以完成非約定轉帳設定。</>)
            : (<>並將與您的電信公司確認您的手機門號與SIM卡是否一致，若無請更新手機門號，以完成非約定轉帳門號異動設定。</>)}
        </div>
        {/* btns */}
        <div className="btns">
          <ConfirmButtons
            mainButtonValue="確認"
            mainButtonOnClick={handleSubmit((data) => onConfirmClick(data))}
            subButtonValue="取消"
            subButtonOnClick={handleCancel}
          />
        </div>
      </div>
    </DrawerContentWrapper>
  );
};

export default T00300DrawerContent;
