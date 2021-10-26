import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Avatar from 'components/Avatar';
import {
  FEIBButton, FEIBErrorMessage, FEIBInput, FEIBInputLabel,
} from 'components/elements';
import { queryRegAcct, doModifyRegAcct } from 'apis/transferApi';
import { nicknameValidation } from 'utilities/validation';
import { setOpenDrawer, setClickMoreOptions } from '../Transfer/stores/actions';

const TransferDesignedAccount = () => {
  const schema = yup.object().shape({ nickname: nicknameValidation() });
  const {
    control, handleSubmit, formState: { errors }, setValue, watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const openDrawer = useSelector(({ transfer }) => transfer.openDrawer);
  const clickMoreOptions = useSelector(({ transfer }) => transfer.clickMoreOptions);
  const [targetMember, setTargetMember] = useState({});
  const [avatar, setAvatar] = useState(null);
  const dispatch = useDispatch();

  const handleClickSubmit = (data) => {
    if (avatar) data.avatar = avatar;
    console.log('targetMember', targetMember);
    data.inAcct = targetMember.acctId;
    data.inBank = targetMember.bankId;
    data.nickName = data.nickname;
    // 送資料
    console.log(data);

    doModifyRegAcct(data);

    const { add, edit } = clickMoreOptions;
    if (edit.click) dispatch(setOpenDrawer({ ...openDrawer, title: '約定帳號', content: 'default' }));
    if (add.click) dispatch(setOpenDrawer({ ...openDrawer, content: 'default', open: false }));

    dispatch(setClickMoreOptions({
      ...clickMoreOptions,
      add: { click: false, target: null },
      edit: { click: false, target: null },
      remove: { click: false, target: null },
    }));
  };

  const handleSelectAvatar = (file) => setAvatar(file);

  useEffect(async () => {
    console.log('執行');
    const { add, edit } = clickMoreOptions;
    console.log(clickMoreOptions);
    if (edit.click && edit.target) {
      const response = await queryRegAcct({});
      console.log('response', response);
      if (response) {
        const currenTarget = response.find((member) => member.acctId === edit.target);
        setTargetMember(currenTarget);
        setValue('nickname', currenTarget.acctName);
      }
    }
    if (add.click && add.target) {
      setTargetMember(add.target);
    }
  }, [clickMoreOptions.edit, clickMoreOptions.add]);

  return (
    <div className="editDesignedAccountArea">
      <div className="accountArea">
        <span>帳號</span>
        <p>{`${targetMember.bankName} ${targetMember.acctId}`}</p>
      </div>
      <form>
        <div className="avatarArea">
          <Avatar src={targetMember.acctImg} name={watch('nickname')} onPreview={handleSelectAvatar} />
        </div>
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

        <FEIBButton onClick={handleSubmit(handleClickSubmit)}>完成</FEIBButton>
      </form>
    </div>
  );
};

export default TransferDesignedAccount;
