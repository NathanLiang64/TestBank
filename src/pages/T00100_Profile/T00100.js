import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CreateRounded, KeyboardArrowRightRounded } from '@material-ui/icons';

/* Elements */
import Layout from 'components/Layout/Layout';
import Avatar from 'components/Avatar';
import { TextInputField } from 'components/Fields';
import { showCustomPrompt } from 'utilities/MessageModal';
import { startFunc } from 'utilities/AppScriptProxy';
import defaultAvatar from 'assets/images/avatarImage.png';

/* Styles */
import SettingList from './T00100_settingList';
import ProfileWrapper from './T00100.style';
import { validationSchema } from './validationSchema';
import { getNickName, updateNickName, uploadAvatar } from './api';

/**
 * T00100 個人化首頁
 */
const T00100 = () => {
  const {
    handleSubmit,
    control,
    reset,
  } = useForm({
    defaultValues: {nickName: ''},
    resolver: yupResolver(validationSchema),
  });

  const [nickName, setNickName] = useState('');
  const [memberId, setMemberId] = useState();

  const onSubmit = async (values) => {
    const response = await updateNickName(values);
    if (response?.constructor === String) setNickName(values.nickName);
  };

  const showEditNickNameDialog = () => {
    showCustomPrompt({
      title: '編輯名稱',
      message: (
        <TextInputField
          name="nickName"
          control={control}
          placeholder="請輸入您的名稱"
          labelName="您的名稱"
        />
      ),
      okContent: '完成',
      onOk: handleSubmit(onSubmit),
      onClose: () => reset({ nickName }),
    });
  };

  const renderEntryList = () => SettingList.map(({ name, funcID }) => (
    <div className="entryList" key={name} onClick={() => startFunc(funcID)}>
      {name}
      <KeyboardArrowRightRounded />
    </div>
  ));

  useEffect(async () => {
    const data = await getNickName();
    setNickName(data.nickName);
    reset({nickName: data.nickName});
    setMemberId(data.uuid);
  }, []);

  return (
    <Layout title="個人化設定">
      <ProfileWrapper>
        <Avatar memberId={memberId} name={nickName} onNewPhotoLoaded={uploadAvatar} defaultImage={defaultAvatar} />
        <div className="nickName">
          <span>{nickName}</span>
          <CreateRounded onClick={showEditNickNameDialog} />
        </div>
        {renderEntryList()}
      </ProfileWrapper>
    </Layout>
  );
};

export default T00100;
