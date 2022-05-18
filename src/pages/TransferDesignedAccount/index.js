import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Avatar from 'components/Avatar';
import {
  FEIBButton, FEIBErrorMessage, FEIBInput, FEIBInputLabel,
} from 'components/elements';
import { updateRegAccount } from 'apis/transferApi';
import { nicknameValidation } from 'utilities/validation';
import { setOpenDrawer, setClickMoreOptions } from '../D00100_NtdTransfer/stores/actions';

const TransferDesignedAccount = () => {
  const schema = yup.object().shape({ nickname: nicknameValidation() });
  const {
    control, handleSubmit, formState: { errors }, setValue, watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const openDrawer = useSelector(({ transfer }) => transfer.openDrawer);
  const clickMoreOptions = useSelector(({ transfer }) => transfer.clickMoreOptions);
  const regAccounts = useSelector(({ transfer }) => transfer.regAccounts);

  const [targetMember, setTargetMember] = useState({});
  const [avatar, setAvatar] = useState(null);
  const dispatch = useDispatch();

  const handleClickSubmit = (data) => {
    // TODO: 後端缺少頭像欄位
    if (avatar) data.avatar = avatar;

    const { accountId, bankId, email } = targetMember;
    const params = {
      email, // 不可修改
      inBank: bankId, // 不可修改
      inAcct: accountId, // 不可修改
      orgBankId: bankId,
      orgAcctId: accountId,
      nickName: data.nickname,
    };
    // console.log('params', params);

    // 送資料
    updateRegAccount(params).then(() => {
      // console.log('編輯約定帳號 res', response);
      // 成功後清除暫存資料並跳轉
      const { add, edit } = clickMoreOptions;
      if (edit.click) dispatch(setOpenDrawer({ ...openDrawer, title: '約定帳號', content: 'default' }));
      if (add.click) dispatch(setOpenDrawer({ ...openDrawer, content: 'default', open: false }));

      dispatch(setClickMoreOptions({
        ...clickMoreOptions,
        add: { click: false, target: null },
        edit: { click: false, target: null },
        remove: { click: false, target: null },
      }));
    });
    // .catch((error) => console.log('err', error));
  };

  const handleSelectAvatar = (file) => setAvatar(file);

  useEffect(() => {
    const { edit } = clickMoreOptions;
    // 當點擊狀態為編輯時，則設置編輯目標帳號
    if (edit.click && edit.target) {
      const currenTarget = regAccounts.find((member) => member.accountId === edit.target);
      setTargetMember(currenTarget);
      setValue('nickname', currenTarget.accountName);
    }
  }, [clickMoreOptions?.edit]);

  return (
    <div className="editDesignedAccountArea">
      <div className="accountArea">
        <span>帳號</span>
        <p>{`${targetMember.bankName} ${targetMember.accountId}`}</p>
      </div>
      <form>
        <div className="avatarArea">
          <Avatar src={targetMember.acctImg} name={watch('nickname')} onPreview={handleSelectAvatar} />
        </div>
        <FEIBInputLabel>暱稱</FEIBInputLabel>
        <Controller
          name="nickname"
          defaultValue={targetMember.accountName}
          control={control}
          render={({ field }) => (
            <FEIBInput {...field} id="nickname" type="text" name="nickname" placeholder="請輸入" error={!!errors.nickname} />
          )}
        />
        <FEIBErrorMessage>{errors.nickname?.message}</FEIBErrorMessage>

        <FEIBButton onClick={handleSubmit(handleClickSubmit)}>完成</FEIBButton>
      </form>
    </div>
  );
};

export default TransferDesignedAccount;
