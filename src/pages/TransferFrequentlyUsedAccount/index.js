import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Avatar from 'components/Avatar';
import BankCodeInput from 'components/BankCodeInput';
import {
  FEIBButton, FEIBErrorMessage, FEIBInput, FEIBInputLabel,
} from 'components/elements';
import { bankAccountValidation, bankCodeValidation, nicknameValidation } from 'utilities/validation';

const TransferFrequentlyUsedAccount = ({
  openDrawer, setDrawerContent, setOpenDrawer, setClickMoreOption, target,
}) => {
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

  const frequentlyUsedAccounts = useSelector(({ transfer }) => transfer.frequentlyUsedAccounts);
  const [targetMember, setTargetMember] = useState({});
  const [avatar, setAvatar] = useState(null);

  // eslint-disable-next-line no-unused-vars
  const handleSubmitFrequentlyUsed = (data) => {
    if (avatar) data.avatar = avatar;
    // 送資料
    // console.log(data);
    setDrawerContent('default');
    setClickMoreOption({ click: false, button: '', target: null });
    setOpenDrawer({ ...openDrawer, title: '常用帳號' });
  };

  const handleSelectAvatar = (file) => setAvatar(file);

  useEffect(() => {
    if (target) {
      const currenTarget = frequentlyUsedAccounts.find((member) => member.acctId === target);
      setTargetMember(currenTarget);
      setValue('memberAccountCardBankCode', { bankNo: currenTarget.bankNo, bankName: currenTarget.bankName });
      setValue('bankAccount', currenTarget.acctId);
      setValue('nickname', currenTarget.acctName);
    }
  }, [target]);

  if (targetMember) {
    return (
      <form className="addFrequentlyUsedAccountArea">
        <Avatar src={targetMember.acctImg} name={watch('nickname')} onPreview={handleSelectAvatar} />
        <BankCodeInput
          id="memberAccountCardBankCode"
          setValue={setValue}
          trigger={trigger}
          control={control}
          bankCode={{ bankNo: targetMember.bankNo, bankName: targetMember.bankName }}
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
      <Avatar name={watch('nickname')} />
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
