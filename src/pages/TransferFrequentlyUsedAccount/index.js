import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Avatar from 'components/Avatar';
import BankCodeInput from 'components/BankCodeInput';
import {
  FEIBButton, FEIBErrorMessage, FEIBInput, FEIBInputLabel,
} from 'components/elements';
import { bankAccountValidation, bankCodeValidation, nicknameValidation } from 'utilities/validation';
import { addFavAccount, updateFavAccount } from 'apis/transferApi';
import { setOpenDrawer, setClickMoreOptions } from '../D00100_NtdTransfer/stores/actions';

const TransferFrequentlyUsedAccount = () => {
  const schema = yup.object().shape({
    memberAccountCardBankCode: bankCodeValidation(),
    bankAccount: bankAccountValidation(),
    nickname: nicknameValidation(),
  });
  const {
    control, handleSubmit, formState: { errors }, setValue, trigger, watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const openDrawer = useSelector(({ transfer }) => transfer.openDrawer);
  const clickMoreOptions = useSelector(({ transfer }) => transfer.clickMoreOptions);
  const [targetMember, setTargetMember] = useState({});
  const [avatar, setAvatar] = useState(null);

  const favAccounts = useSelector(({ transfer }) => transfer.favAccounts);

  const dispatch = useDispatch();

  // 回到常用帳號列表
  const goBackToFavAccountList = () => {
    dispatch(setOpenDrawer({ ...openDrawer, title: '常用帳號', content: 'default' }));
    dispatch(setClickMoreOptions({
      ...clickMoreOptions,
      add: { click: false, target: null },
      edit: { click: false, target: null },
      remove: { click: false, target: null },
    }));
  };

  const handleSubmitFrequentlyUsed = (data) => {
    if (avatar) data.avatar = avatar;
    // console.log('原始資料', data);

    const { nickname, memberAccountCardBankCode: { bankNo }, bankAccount } = data;
    const { accountId, bankId, email } = targetMember;
    // console.log('targetMember', targetMember)

    // 提交編輯常用帳號
    if (clickMoreOptions.edit.click) {
      const params = {
        email,
        nickName: nickname,
        inBank: bankNo,
        inAcct: bankAccount,
        orgBankId: bankId,
        orgAcctId: accountId,
      };
      // console.log('編輯params', params);

      updateFavAccount(params).then(() => {
        // console.log('編輯常用帳號 res', response);
        goBackToFavAccountList();
      });
      // .catch((error) => console.log('編輯常用帳號 err', error));
    }

    // 提交新增常用帳號
    if (clickMoreOptions.add.click) {
      const params = {
        nickName: nickname,
        inBank: bankNo,
        inAcct: bankAccount,
      };
      // console.log('新增 params', params);

      addFavAccount(params).then(() => {
        // console.log('新增常用帳號 res', response);
        goBackToFavAccountList();
      });
      // .catch((error) => console.log('新增常用帳號 err', error));
    }
  };

  const handleSelectAvatar = (file) => setAvatar(file);

  useEffect(async () => {
    const { edit } = clickMoreOptions;
    if (edit.click && edit.target) {
      const currenTarget = favAccounts.find((member) => member.accountId === edit.target);
      setTargetMember(currenTarget);
      setValue('memberAccountCardBankCode', { bankNo: currenTarget.bankId, bankName: currenTarget.bankName });
      setValue('bankAccount', currenTarget.accountId);
      setValue('nickname', currenTarget.accountName);
    }
  }, [clickMoreOptions.edit]);

  if (targetMember) {
    // console.log('targetMember.bankId', targetMember.bankId);
    return (
      <form className="addFrequentlyUsedAccountArea">
        <div className="avatarArea">
          <Avatar src={targetMember.acctImg} name={watch('nickname')} onPreview={handleSelectAvatar} />
        </div>
        <BankCodeInput
          id="memberAccountCardBankCode"
          setValue={setValue}
          trigger={trigger}
          control={control}
          bankCode={{ bankNo: targetMember.bankId, bankName: targetMember.bankName }}
          errorMessage={errors.memberAccountCardBankCode?.message}
        />

        <FEIBInputLabel>帳號</FEIBInputLabel>
        <Controller
          name="bankAccount"
          defaultValue={targetMember.acctId}
          control={control}
          render={({ field }) => (
            <FEIBInput {...field} id="bankAccount" type="number" name="bankAccount" placeholder="請輸入" error={!!errors.bankAccount} />
          )}
        />
        <FEIBErrorMessage>{errors.bankAccount?.message}</FEIBErrorMessage>

        <FEIBInputLabel>暱稱</FEIBInputLabel>
        <Controller
          name="nickname"
          defaultValue={targetMember.acctName}
          control={control}
          render={({ field }) => (
            <FEIBInput {...field} id="nickname" type="text" name="nickname" placeholder="請輸入" error={!!errors.nickname} />
          )}
        />
        <FEIBErrorMessage>{errors.nickname?.message}</FEIBErrorMessage>

        <FEIBButton onClick={handleSubmit(handleSubmitFrequentlyUsed)}>完成</FEIBButton>
      </form>
    );
  }

  return (
    <form className="addFrequentlyUsedAccountArea">
      <div className="avatarArea">
        <Avatar name={watch('nickname')} />
      </div>
      <BankCodeInput
        id="memberAccountCardBankCode"
        setValue={setValue}
        trigger={trigger}
        control={control}
        errorMessage={errors.memberAccountCardBankCode?.message}
      />

      <FEIBInputLabel>帳號</FEIBInputLabel>
      <Controller
        name="bankAccount"
        defaultValue=""
        control={control}
        render={({ field }) => (
          <FEIBInput {...field} id="bankAccount" type="number" name="bankAccount" placeholder="請輸入" error={!!errors.bankAccount} />
        )}
      />
      <FEIBErrorMessage>{errors.bankAccount?.message}</FEIBErrorMessage>

      <FEIBInputLabel>暱稱</FEIBInputLabel>
      <Controller
        name="nickname"
        defaultValue=""
        control={control}
        render={({ field }) => (
          <FEIBInput {...field} id="nickname" type="text" name="nickname" placeholder="請輸入" error={!!errors.nickname} />
        )}
      />
      <FEIBErrorMessage>{errors.nickname?.message}</FEIBErrorMessage>

      <FEIBButton onClick={handleSubmit(handleSubmitFrequentlyUsed)}>加入</FEIBButton>
    </form>
  );
};

export default TransferFrequentlyUsedAccount;
