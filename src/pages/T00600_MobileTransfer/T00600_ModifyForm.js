/* eslint-disable object-curly-newline */
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { getAccountsList } from 'utilities/CacheData';
import { accountFormatter } from 'utilities/Generator';

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
import MobileTransferWrapper from './T00600.style';

const T00600ModifyForm = ({ onClose, modifyData }) => {
  const history = useHistory();

  const [accountList, setAccountList] = useState([]);
  const [accountDefault, setAccountDefault] = useState(true);

  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    custName: yup.string().required('請輸入姓名'),
    mobile: yup.string().required('請選擇手機號碼'),
    account: yup.string().required('請選擇收款帳號'),
  });
  const { handleSubmit, control, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (formData) => {
    const data = {
      isDefault: accountDefault,
      ...formData,
    };
    // BUG 因為編輯是用 Drawer，而確認頁卻是獨立 Page，所以二者相衝突！
    history.push(
      '/T006002', {
        type: 'edit',
        isModify: true,
        data,
      },
    );
    onClose();
  };

  useEffect(async () => {
    modifyData.mobilesList.splice(0, 0, modifyData.mobile); // 可用的手機門號
    await getAccountsList('MSC', (accounts) => { // 帳戶類型 M:母帳戶, S:證券戶, C:子帳戶
      const account = accounts.filter((acct) => acct.accountNo === modifyData.account);
      modifyData.accountList.splice(0, 0, account); // 可用的帳號
      setAccountList(accounts);
    });

    reset({
      custName: modifyData.custName,
      mobile: modifyData.mobile,
      account: modifyData.account,
    });
    setAccountDefault(modifyData.isDefault);
  }, []);

  return (
    <MobileTransferWrapper className="drawerWrapper">
      <div className="formContainer">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <FEIBInputLabel>姓名</FEIBInputLabel>
            <Controller
              name="custName"
              control={control}
              render={({ field }) => (
                <FEIBInput
                  {...field}
                  type="text"
                  id="custName"
                  name="custName"
                  placeholder="請輸入姓名"
                  error={!!errors.custName}
                  disabled
                />
              )}
            />
            <FEIBErrorMessage>{errors.custName?.message}</FEIBErrorMessage>
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
                  disabled
                >
                  {
                    modifyData.mobilesList.map((item) => (
                      <FEIBOption value={item} key={item}>{item}</FEIBOption>
                    ))
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
                  {
                    accountList.map((item) => (
                      <FEIBOption value={item.accountNo} key={item.accountNo}>
                        {`${accountFormatter(item.accountNo, true)}  ${item.alias}`}
                      </FEIBOption>
                    ))
                  }
                </FEIBSelect>
              )}
            />
            <FEIBErrorMessage>{errors.account?.message}</FEIBErrorMessage>
            <FEIBSwitchLabel
              control={(
                <FEIBSwitch
                  checked={accountDefault}
                  onChange={() => setAccountDefault(!accountDefault)}
                  disabled
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

export default T00600ModifyForm;
