import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { CreateRounded, KeyboardArrowRightRounded } from '@material-ui/icons';

/* Elements */
// eslint-disable-next-line no-unused-vars
import { getNickName, updateNickName, uploadAvatar } from 'pages/T00100_Profile/api';
import Layout from 'components/Layout/Layout';
import Avatar from 'components/Avatar';
import { TextInputField } from 'components/Fields';
import { showCustomPrompt } from 'utilities/MessageModal';
import { startFunc } from 'utilities/AppScriptProxy';
import defaultAvatar from 'assets/images/avatar.png';

/* Styles */
import SettingList from './T00100_settingList';
import ProfileWrapper from './T00100.style';
import { validationSchema } from './validationSchema';

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
  const [avatarUrl, setAvatarUrl] = useState(defaultAvatar);

  const onSubmit = async (values) => {
    const response = await updateNickName(values);
    if (typeof response === 'string') setNickName(values.nickName);
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

  const fetchNickName = async () => {
    const { code, data, message } = await getNickName();
    if (code === '0000') {
      setNickName(data.nickName);
      reset({nickName: data.nickName});
      setAvatarUrl(
        `${process.env.REACT_APP_AVATAR_IMG_URL}/pf_${data.uuid}_b.jpg?timestamp=${Date.now()}`,
      );
    } else {
      showCustomPrompt({ title: `取得暱稱與大頭照發生錯誤(${code})：${message}` });
    }
  };

  const renderEntryList = () => SettingList.map(({ name, funcID }) => (
    <div className="entryList" key={name} onClick={() => startFunc(funcID)}>
      {name}
      <KeyboardArrowRightRounded />
    </div>
  ));

  useEffect(() => {
    fetchNickName();
  }, []);

  return (
    <Layout title="個人化設定">
      <ProfileWrapper>
        <Avatar src={avatarUrl} name={nickName} />
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
