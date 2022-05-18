import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Avatar from 'components/Avatar';
import BankCodeInput from 'pages/TransferStatic/BankCodeInput';
import {
  FEIBButton, FEIBErrorMessage, FEIBInput, FEIBInputLabel,
} from 'components/elements';
import { bankAccountValidation, bankCodeValidation, nicknameValidation } from 'utilities/validation';
import { setOpenDrawer, setClickMoreOptions } from '../D00100_NtdTransfer/stores/actions';
import mockData from '../TransferStatic/mockData';

const TransferStaticFrequentlyUsedAccount = () => {
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
  const dispatch = useDispatch();

  const handleSubmitFrequentlyUsed = (data) => {
    if (avatar) data.avatar = avatar;
    // 送資料
    // console.log(data);
    dispatch(setOpenDrawer({ ...openDrawer, title: '常用帳號', content: 'default' }));
    dispatch(setClickMoreOptions({
      ...clickMoreOptions,
      add: { click: false, target: null },
      edit: { click: false, target: null },
      remove: { click: false, target: null },
    }));
  };

  const handleSelectAvatar = (file) => setAvatar(file);

  useEffect(async () => {
    const { edit } = clickMoreOptions;
    const { getFavoriteAcct } = mockData;
    if (edit.click && edit.target) {
      const currenTarget = getFavoriteAcct.favoriteAcctList.find((member) => member.id === edit.target);
      setTargetMember(currenTarget);
      setValue('memberAccountCardBankCode', { bankNo: currenTarget.bankNo, bankName: currenTarget.bankName });
      setValue('bankAccount', currenTarget.acctId);
      setValue('nickname', currenTarget.acctName);
    }
  }, [clickMoreOptions.edit]);

  if (targetMember) {
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

export default TransferStaticFrequentlyUsedAccount;
