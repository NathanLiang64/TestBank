import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

/* Elements */
import {
  FEIBInputLabel,
  FEIBInput,
  FEIBSelect,
  FEIBOption,
  FEIBErrorMessage,
  FEIBSwitchLabel,
  FEIBSwitch,
} from 'components/elements';
import ConfirmButtons from 'components/ConfirmButtons';
import Accordion from 'components/Accordion';

/* Styles */
import MobileTransferWrapper from './mobileTransfer.style';

const MobileTransferModifyForm = ({ onClose, modifyData }) => {
  const history = useHistory();
  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    userName: yup
      .string()
      .required('請輸入姓名'),
    mobile: yup
      .string()
      .required('請選擇手機號碼'),
    account: yup
      .string()
      .required('請選擇收款帳號'),
  });
  const {
    handleSubmit, control, formState: { errors }, setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [accountDefault, setAccountDefault] = useState(true);

  const switchAccountDefault = () => {
    setAccountDefault(!accountDefault);
  };

  const onSubmit = (formData) => {
    // eslint-disable-next-line no-console
    console.log(formData);
    const data = {
      isDefault: accountDefault,
      id: modifyData.id,
      ...formData,
    };
    history.push(
      '/mobileTransfer2',
      {
        type: 'edit',
        isModify: true,
        data,
      },
    );
  };

  useEffect(() => {
    console.log(modifyData);
    const {
      userName, account, mobile, isDefault,
    } = modifyData;
    setValue('userName', userName);
    setValue('account', account);
    setValue('mobile', mobile);
    setAccountDefault(isDefault);
  }, []);

  return (
    <MobileTransferWrapper className="drawerWrapper">
      <div className="formContainer">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <FEIBInputLabel>姓名</FEIBInputLabel>
            <Controller
              name="userName"
              control={control}
              render={({ field }) => (
                <FEIBInput
                  {...field}
                  type="text"
                  id="userName"
                  name="userName"
                  placeholder="請輸入姓名"
                  error={!!errors.userName}
                />
              )}
            />
            <FEIBErrorMessage>{errors.userName?.message}</FEIBErrorMessage>
            <FEIBInputLabel>手機號碼</FEIBInputLabel>
            <Controller
              name="mobile"
              defaultValue=""
              control={control}
              placeholder="請選擇手機號碼"
              render={({ field }) => (
                <FEIBSelect
                  {...field}
                  id="mobile"
                  name="mobile"
                  placeholder="請選擇手機號碼"
                  error={!!errors.mobile}
                >
                  <FEIBOption value="" disabled>請選擇手機號碼</FEIBOption>
                  <FEIBOption value="0988392726">0988392726</FEIBOption>
                  <FEIBOption value="0988392899">0988392899</FEIBOption>
                </FEIBSelect>
              )}
            />
            <FEIBErrorMessage>{errors.mobile?.message}</FEIBErrorMessage>
            <FEIBInputLabel>收款帳號</FEIBInputLabel>
            <Controller
              name="account"
              defaultValue=""
              control={control}
              placeholder="請選擇收款帳號"
              render={({ field }) => (
                <FEIBSelect
                  {...field}
                  id="account"
                  name="account"
                  placeholder="請選擇收款帳號"
                  error={!!errors.account}
                >
                  <FEIBOption value="" disabled>請選擇收款帳號</FEIBOption>
                  <FEIBOption value="00300400326306">00300400326306</FEIBOption>
                  <FEIBOption value="00300400326307">00300400326307</FEIBOption>
                </FEIBSelect>
              )}
            />
            <FEIBErrorMessage>{errors.account?.message}</FEIBErrorMessage>
            <FEIBSwitchLabel
              control={(
                <FEIBSwitch
                  checked={accountDefault}
                  onChange={switchAccountDefault}
                />
              )}
              label="設定為「預設收款帳戶」"
            />
            <div className="switchDescription">
              說明：您可以將手機號碼綁定一個帳戶做為「預設收款帳戶」，未來您的朋友只要輸入您的手機號碼，無須再選擇銀行代碼，即可立即轉帳給您！
            </div>
            <Accordion title="注意事項" space="both">
              <ol>
                <li>一個手機號碼僅能設定一組存款帳號，若重複設定，將取消舊設定，改採新設定。</li>
                <li>若欲設定帳號已被其他手機號碼設定，請先取消後再進行設定。</li>
              </ol>
            </Accordion>
          </div>
          <ConfirmButtons
            mainButtonValue="確認"
            subButtonOnClick={onClose}
          />
        </form>
      </div>
    </MobileTransferWrapper>
  );
};

export default MobileTransferModifyForm;
