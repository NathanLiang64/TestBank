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
import { getFavAcct, insertFacAcct, doModifyFacAcct } from 'apis/transferApi';
import { setOpenDrawer, setClickMoreOptions } from '../Transfer/stores/actions';

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
  const dispatch = useDispatch();

  const handleSubmitFrequentlyUsed = (data) => {
    if (avatar) data.avatar = avatar;
    // 送資料
    console.log('送資料', data);

    // 點擊修改
    if (clickMoreOptions.edit.click) {
      data.inBank = data.memberAccountCardBankCode.bankNo;
      data.inAcct = data.memberAccountCardBankCode.bankName;
      data.nickName = data.nickname;
      doModifyFacAcct(data);
    }

    // 點擊新增
    if (clickMoreOptions.add.click) {
      insertFacAcct({ inAcct: data.bankAccount, inBank: data.memberAccountCardBankCode.bankNo, nickName: data.nickname });
    }

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
    console.log(clickMoreOptions);
    const { edit } = clickMoreOptions;
    if (edit.click && edit.target) {
      let response = await getFavAcct({});
      console.log('getFavAcct', response);
      response = {
        favoriteAcctList: [{
          bankId: '805', bankName: '遠東銀行', accountId: '04300490003488', accountName: '４８８', email: '',
        },
        {
          bankId: '805', bankName: '遠東銀行', accountId: '04300499004366', accountName: '１２３３２１', email: '',
        }],
      };
      if (response) {
        console.log(response);
        const currenTarget = response.favoriteAcctList.find((member) => member.accountId === edit.target);
        console.log('currenTarget', currenTarget);
        setTargetMember(currenTarget);
        setValue('memberAccountCardBankCode', { bankNo: currenTarget.bankId, bankName: currenTarget.bankName });
        setValue('bankAccount', currenTarget.accountId);
        setValue('nickname', currenTarget.accountName);
      }
    }
  }, [clickMoreOptions.edit]);

  if (targetMember) {
    console.log(targetMember.bankId);
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
