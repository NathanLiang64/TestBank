import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

/* Elements */
import {
  FEIBInputLabel,
  FEIBInput,
  FEIBSelect,
  FEIBOption,
  FEIBButton,
  FEIBErrorMessage,
  FEIBSwitchLabel,
  FEIBSwitch,
} from 'components/elements';
import Accordion from 'components/Accordion';
import DealContent from './dealContent';

/* Styles */
import MobileTransferWrapper from './mobileTransfer.style';

const mobileList = ['0988392725'];
const accountList = ['04300499031163'];

const MobileTransfer1 = () => {
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
      ...formData,
    };
    history.push(
      '/mobileTransfer2',
      {
        type: 'add',
        isModify: false,
        data,
      },
    );
  };

  const renderOptions = (data) => data.map((item) => (
    <FEIBOption value={item}>{item}</FEIBOption>
  ));

  useCheckLocation();
  usePageInfo('/api/mobileTransfer');

  useEffect(() => {
    setValue('mobile', mobileList[0]);
    setValue('account', accountList[0]);
  }, []);

  return (
    <MobileTransferWrapper>
      <div className="summaryContainer lighterBlueLine">
        <p>
          手機號碼就是您的存款帳號
        </p>
        <p>
          完成設定後，親友即可透過手機號碼，轉帳到您設定的存款帳號，轉帳快速又方便！
        </p>
      </div>
      <div className="formContainer">
        <p>請輸入欲設定的手機號碼與帳號</p>
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
                  {
                    renderOptions(mobileList)
                  }
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
                  {
                    renderOptions(accountList)
                  }
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
            <Accordion title="手機號碼收款服務使用條款" space="both">
              <DealContent />
            </Accordion>
          </div>
          <FEIBButton
            type="submit"
          >
            同意條款並繼續
          </FEIBButton>
        </form>
      </div>
    </MobileTransferWrapper>
  );
};

export default MobileTransfer1;
