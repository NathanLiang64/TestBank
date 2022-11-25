import { useState, useEffect } from 'react';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { startFunc } from 'utilities/AppScriptProxy';

/* Elements */
import {
  FEIBInput, FEIBInputLabel, FEIBErrorMessage,
} from 'components/elements';
import Layout from 'components/Layout/Layout';
import { showCustomPrompt } from 'utilities/MessageModal';

/* Styles */
import { CreateRounded, KeyboardArrowRightRounded } from '@material-ui/icons';
import Avatar from 'assets/images/avatar.png';
import SettingList from './T00100_settingList';
import ProfileWrapper from './T00100.style';
import { getNickName, updateNickName, uploadAvatar } from './api';

/**
 * T00100 個人化首頁
 */
const T00100 = () => {
  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    nickName: yup.string().required('請輸入您的名稱'),
  });
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [nickName, setNickName] = useState('');
  const [uuid, setUuid] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(Avatar);

  // 上傳大頭貼
  const uploadAvatarImg = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      showCustomPrompt({ title: '請選擇檔案' });
      return;
    }
    if (!file.type.includes('image')) {
      showCustomPrompt({ title: '檔案格式錯誤，僅限 JPG, JPEG, PNG 格式圖檔' });
      return;
    }
    if (file.size / 1024 > 1024) {
      showCustomPrompt({ title: '檔案大小必須小於 1024 KB' });
      return;
    }
    const response = await uploadAvatar(file);
    console.log(response);
    if (response === 'OK') {
      showCustomPrompt({ title: '上傳成功' });
      setAvatarUrl(
        `${process.env.REACT_APP_AVATAR_URL}/${uuid}.jpg`,
      );
    }
    if (response?.code) {
      showCustomPrompt({ title: `${response?.message}，錯誤碼：${response?.code}` });
    }
  };

  const onSubmit = async (data) => {
    const param = {
      nickName: data.nickName,
    };
    const response = await updateNickName(param);
    console.log(response);
    if (typeof response === 'string') {
      setNickName(data.nickName);
    }
  };

  const renderForm = () => (
    <form id="nickNameForm" onSubmit={handleSubmit(onSubmit)} style={{ paddingBottom: '0' }}>
      <FEIBInputLabel htmlFor="nickName">您的名稱</FEIBInputLabel>
      <Controller
        name="nickName"
        defaultValue=""
        control={control}
        render={({ field }) => (
          <FEIBInput
            {...field}
            type="text"
            id="nickName"
            name="nickName"
            placeholder="請輸入您的名稱"
            error={!!errors.nickName}
          />
        )}
      />
      <FEIBErrorMessage>{errors.nickName?.message}</FEIBErrorMessage>
    </form>
  );

  const showEditNickNameDialog = () => {
    reset();
    setValue('nickName', nickName);
    showCustomPrompt({
      title: '編輯名稱',
      message: renderForm(),
      okContent: '完成',
      onOk: handleSubmit(onSubmit),
    });
  };

  const fetchNickName = async () => {
    const { code, data, message } = await getNickName({});
    if (code === '0000') {
      setNickName(data.nickName || '');
      setUuid(data.uuid);
      setAvatarUrl(
        `${process.env.REACT_APP_AVATAR_URL}/${data.uuid}.jpg`,
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
        <div className="avatarContainer">
          <img src={avatarUrl} onError={() => setAvatarUrl(Avatar)} alt="" key={avatarUrl} />
          <div className="penIconContainer">
            <div className="penIconBackground">
              <CreateRounded />
            </div>
          </div>
          <label htmlFor="avatar-input">
            <input
              type="file"
              accept="image/*"
              name="upload_file"
              id="avatar-input"
              onChange={uploadAvatarImg}
            />
          </label>
        </div>
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
