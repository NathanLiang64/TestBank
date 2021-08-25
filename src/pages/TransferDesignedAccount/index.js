import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Avatar from 'components/Avatar';
import {
  FEIBButton, FEIBErrorMessage, FEIBInput, FEIBInputLabel,
} from 'components/elements';
import { nicknameValidation } from 'utilities/validation';
import { setOpenDrawer, setClickMoreOptions } from '../Transfer/stores/actions';

const TransferDesignedAccount = () => {
  const schema = yup.object().shape({ nickname: nicknameValidation() });
  const {
    control, handleSubmit, formState: { errors }, setValue, watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const designedAccounts = useSelector(({ transfer }) => transfer.designedAccounts);
  const openDrawer = useSelector(({ transfer }) => transfer.openDrawer);
  const clickMoreOptions = useSelector(({ transfer }) => transfer.clickMoreOptions);
  const [targetMember, setTargetMember] = useState({});
  const [avatar, setAvatar] = useState(null);
  const dispatch = useDispatch();

  const handleSubmitFrequentlyUsed = (data) => {
    if (avatar) data.avatar = avatar;
    // 送資料
    // console.log(data);
    dispatch(setOpenDrawer({ ...openDrawer, title: '約定帳號', content: 'default' }));
    dispatch(setClickMoreOptions({ click: false, button: '', target: null }));
  };

  const handleSelectAvatar = (file) => setAvatar(file);

  useEffect(() => {
    if (clickMoreOptions.target) {
      const currenTarget = designedAccounts.find((member) => member.acctId === clickMoreOptions.target);
      setTargetMember(currenTarget);
      setValue('nickname', currenTarget.acctName);
    }
  }, [clickMoreOptions.target]);

  return (
    <div className="editDesignedAccountArea">
      <div className="accountArea">
        <span>帳號</span>
        <p>{`${targetMember.bankName} ${targetMember.acctId}`}</p>
      </div>
      <form>
        <Avatar src={targetMember.acctImg} name={watch('nickname')} onPreview={handleSelectAvatar} />
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
    </div>
  );
};

export default TransferDesignedAccount;
