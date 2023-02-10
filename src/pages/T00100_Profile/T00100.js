import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CreateRounded, KeyboardArrowRightRounded } from '@material-ui/icons';

/* Elements */
import Layout from 'components/Layout/Layout';
import Avatar from 'components/Avatar';
import { TextInputField } from 'components/Fields';
import { showCustomPrompt } from 'utilities/MessageModal';
import defaultAvatar from 'assets/images/avatarImage.png';
import { Func } from 'utilities/FuncID';

/* Styles */
import { useNavigation } from 'hooks/useNavigation';
import { useDispatch } from 'react-redux';
import { setModalVisible } from 'stores/reducers/ModalReducer';
import SettingList from './T00100_settingList';
import ProfileWrapper from './T00100.style';
import { validationSchema } from './validationSchema';
import { getNickname, updateNickname, uploadAvatar } from './api';

/**
 * T00100 個人化首頁
 */
const T00100 = () => {
  const {
    handleSubmit,
    control,
    reset,
  } = useForm({
    defaultValues: {nickname: ''},
    resolver: yupResolver(validationSchema),
  });

  const { startFunc } = useNavigation();
  const [nickname, setNickname] = useState('');
  const [memberId, setMemberId] = useState();
  const dispatch = useDispatch();

  const onSubmit = async (values) => {
    dispatch(setModalVisible(false));
    await updateNickname(values.nickname);
    setNickname(values.nickname);
  };

  const showEditNickNameDialog = () => {
    showCustomPrompt({
      title: '編輯名稱',
      message: (
        <TextInputField
          name="nickname"
          control={control}
          inputProps={{ maxLength: 20, placeholder: '請輸入您的名稱' }}
          labelName="您的名稱"
        />
      ),
      okContent: '完成',
      onOk: handleSubmit(onSubmit),
      onClose: () => reset({ nickname }),
      noDismiss: true,
    });
  };

  const renderEntryList = () => SettingList.map(({ name, funcID }) => (
    <div className="entryList" key={name} onClick={() => startFunc(funcID)}>
      {name}
      <KeyboardArrowRightRounded />
    </div>
  ));

  useEffect(async () => {
    const data = await getNickname();
    setNickname(data.nickname);
    reset({nickname: data.nickname});
    setMemberId(data.uuid);
  }, []);

  return (
    <Layout fid={Func.T001} title="個人化設定">
      <ProfileWrapper>
        <Avatar memberId={memberId} name={nickname} onNewPhotoLoaded={uploadAvatar} defaultImage={defaultAvatar} />
        <div className="nickname">
          <span>{nickname}</span>
          <CreateRounded onClick={showEditNickNameDialog} />
        </div>
        {renderEntryList()}
      </ProfileWrapper>
    </Layout>
  );
};

export default T00100;
