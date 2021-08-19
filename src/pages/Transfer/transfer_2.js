/* eslint-disable */
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { AddRounded } from '@material-ui/icons';
import MemberAccountCard from 'components/MemberAccountCard';
import BankCodeInput from 'components/BankCodeInput';
import Avatar from 'components/Avatar';
import {
  FEIBButton, FEIBErrorMessage, FEIBInput, FEIBInputLabel,
} from 'components/elements';
import { bankAccountValidation, bankCodeValidation, nicknameValidation } from 'utilities/validation';
import { TransferDrawerWrapper } from './transfer.style';
import BottomDrawer from '../../components/BottomDrawer';

const Transfer2 = ({ openDrawer, setOpenDrawer }) => {
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
  const designedAccounts = useSelector(({ transfer }) => transfer.designedAccounts);
  const [drawerContent, setDrawerContent] = useState('default');
  const [clickMoreOption, setClickMoreOption] = useState({ click: false, button: '', target: null });

  // eslint-disable-next-line no-unused-vars
  const handleSubmitAddFrequentlyUsed = (data) => {
    setDrawerContent('default');
    setOpenDrawer({ ...openDrawer, title: '常用帳號' });
    setClickMoreOption({ click: false, button: '', target: null });
    console.log(data);
    // 送資料
  };

  const handleCloseDrawer = () => {
    setOpenDrawer({ ...openDrawer, open: false });
    setDrawerContent('default');
  };

  // 點擊新增常用帳號按鈕
  const handleClickAddFrequentlyUsedAccount = () => {
    setOpenDrawer({ ...openDrawer, title: '新增常用帳號' });
    setDrawerContent('addFrequentlyUsedAccount');
  };

  const memberAccountCardList = (list, type) => (
    list.map((member) => (
      <MemberAccountCard
        key={member.acctId}
        type={type}
        name={member.acctName}
        bankNo={member.bankNo}
        bankName={member.bankName}
        account={member.acctId}
        avatarSrc={member.acctImg}
        setClickMoreOption={setClickMoreOption}
      />
    ))
  );

  const renderMemberAccountCardListByType = () => {
    if (openDrawer.title === '常用帳號' && frequentlyUsedAccounts) {
      return memberAccountCardList(frequentlyUsedAccounts, openDrawer.title);
    }
    return memberAccountCardList(designedAccounts, openDrawer.title);
  };

  // 預設的會員帳號頁面 (常用帳號、約定帳號)，常用帳號才有新增按鈕
  const defaultMemberAccountContent = (title) => (
    <>
      { title === '常用帳號' && (
        <div className="addMemberButtonArea" onClick={handleClickAddFrequentlyUsedAccount}>
          <div className="addMemberButtonIcon">
            <AddRounded />
          </div>
          <span className="addMemberButtonText">新增常用帳號</span>
        </div>
      ) }
      { renderMemberAccountCardListByType() }
    </>
  );

  // TODO: Bug, 待修正
  // 新增/編輯常用帳號頁面
  const frequentlyUsedAccountContent = (account) => {
    if (account) {
      const target = frequentlyUsedAccounts.find((member) => member.acctId === account);
      const {
        acctImg,
        bankNo,
        bankName,
        acctId,
        acctName,
      } = target;
      return (
        <form className="addFrequentlyUsedAccountArea">
          <Avatar src={acctImg} name={watch('nickname')} />
          <BankCodeInput
            id="memberAccountCardBankCode"
            setValue={setValue}
            trigger={trigger}
            control={control}
            bankCode={{ bankNo, bankName }}
            errorMessage={errors.memberAccountCardBankCode?.message}
          />

          <FEIBInputLabel>帳號</FEIBInputLabel>
          <Controller
            name="bankAccount"
            defaultValue={acctId}
            control={control}
            render={({ field }) => (
              <FEIBInput {...field} id="bankAccount" type="number" name="bankAccount" placeholder="請輸入" error={!!errors.bankAccount} />
            )}
          />
          <FEIBErrorMessage>{errors.bankAccount?.message}</FEIBErrorMessage>

          <FEIBInputLabel>暱稱</FEIBInputLabel>
          <Controller
            name="nickname"
            defaultValue={acctName}
            control={control}
            render={({ field }) => (
              <FEIBInput {...field} id="nickname" type="text" name="nickname" placeholder="請輸入" error={!!errors.nickname} />
            )}
          />
          <FEIBErrorMessage>{errors.nickname?.message}</FEIBErrorMessage>

          <FEIBButton onClick={handleSubmit(handleSubmitAddFrequentlyUsed)}>加入</FEIBButton>
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

        <FEIBButton onClick={handleSubmit(handleSubmitAddFrequentlyUsed)}>加入</FEIBButton>
      </form>
    );
  };

  useEffect(() => {
    // if (clickMoreOption) console.log(clickMoreOption);
    const { click, button, target } = clickMoreOption;
    if (click && button === 'edit') {
      const targetMember = frequentlyUsedAccounts.find((member) => member.acctId === target);
      setDrawerContent('editFrequentlyUsedAccount');
    }
  }, [clickMoreOption]);

  // 由 drawerController 控制要顯示哪個頁面
  const drawerController = (content) => {
    switch (content) {
      case 'default':
        // return defaultMemberAccountContent(transferType);
        return defaultMemberAccountContent(openDrawer.title);
      case 'addFrequentlyUsedAccount':
        return frequentlyUsedAccountContent();
      case 'editFrequentlyUsedAccount':
        return frequentlyUsedAccountContent(clickMoreOption.target);
      default:
        return defaultMemberAccountContent(openDrawer.title);
    }
  };

  return (
    <BottomDrawer
      title={openDrawer.title}
      isOpen={openDrawer.open}
      onClose={handleCloseDrawer}
      content={(
        <TransferDrawerWrapper>
          { drawerController(drawerContent) }
        </TransferDrawerWrapper>
      )}
    />
  );
};

export default Transfer2;
