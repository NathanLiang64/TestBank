/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { startFunc } from 'utilities/AppScriptProxy';
import { getNickName, updateNickName, uploadAvatar } from 'pages/T00100_Profile/api';

/* Elements */
import {
  FEIBInput, FEIBInputLabel, FEIBButton, FEIBErrorMessage,
} from 'components/elements';
import Layout from 'components/Layout/Layout';
import Dialog from 'components/Dialog';

/* Styles */
import { CreateRounded, KeyboardArrowRightRounded } from '@material-ui/icons';
import Avatar from 'assets/images/avatar.png';
import SettingList from './T00100_settingList';
import ProfileWrapper from './profile.style';

const Profile = () => {
  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    nickName: yup
      .string()
      .required('請輸入您的名稱'),
  });
  const {
    handleSubmit, control, formState: { errors }, reset, setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [nickName, setNickName] = useState('');
  const [uuid, setUuid] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(Avatar);
  const [showChangeNickNameDialog, setShowChangeNickNameDialog] = useState(false);
  const [dialogMessageModal, setDialogMessageModal] = useState({
    open: false,
    content: '',
  });

  // 關閉訊息彈窗
  const closeMessageDialog = () => {
    setDialogMessageModal({
      open: false,
      content: '',
    });
  };

  // 開啟訊息彈窗
  const openMessageDialog = (content) => {
    setDialogMessageModal({
      open: true,
      content,
    });
  };

  // 上傳大頭貼
  const uploadAvatarImg = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      openMessageDialog('請選擇檔案');
      return;
    }
    if (!file.type.includes('image')) {
      openMessageDialog('檔案格式錯誤，僅限 JPG, JPEG, PNG 格式圖檔');
      return;
    }
    if ((file.size / 1024) > 1024) {
      openMessageDialog('檔案大小必須小於 1024 KB');
      return;
    }
    const response = await uploadAvatar(file);
    console.log(response);
    if (response === 'OK') {
      openMessageDialog('上傳成功');
      setAvatarUrl(`${process.env.REACT_APP_AVATAR_IMG_URL}/pf_${uuid}_b.jpg?timestamp=${Date.now()}`);
    }
    if (response?.code) {
      openMessageDialog(`${response?.message}，錯誤碼：${response?.code}`);
    }
  };

  const showEditNickNameDialog = () => {
    reset();
    setValue('nickName', nickName);
    setShowChangeNickNameDialog(true);
  };

  const fetchNickName = async () => {
    const { code, data, message } = await getNickName({});
    if (code === '0000') {
      setNickName(data.nickName || '');
      setUuid(data.uuid);
      setAvatarUrl(`${process.env.REACT_APP_AVATAR_IMG_URL}/pf_${data.uuid}_b.jpg?timestamp=${Date.now()}`);
    } else {
      openMessageDialog(`取得暱稱與大頭照發生錯誤(${code})：${message}`);
    }
  };

  const onSubmit = async (data) => {
    const param = {
      nickName: data.nickName,
    };
    const response = await updateNickName(param);
    console.log(response);
    if (typeof (response) === 'string') {
      setNickName(data.nickName);
      setShowChangeNickNameDialog(false);
    }
  };

  const renderEntryList = () => SettingList.map(({ name, funcID }) => (
    <div className="entryList" key={name} onClick={() => startFunc(funcID)}>
      {name}
      <KeyboardArrowRightRounded />
    </div>
  ));

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

  const renderDialog = () => (
    <Dialog
      isOpen={showChangeNickNameDialog}
      onClose={() => setShowChangeNickNameDialog(false)}
      title="編輯名稱"
      content={renderForm()}
      action={(<FEIBButton type="submit" form="nickNameForm">完成</FEIBButton>)}
    />
  );

  // 訊息顯示窗
  const renderMessageDialog = () => (
    <Dialog
      isOpen={dialogMessageModal.open}
      onClose={closeMessageDialog}
      content={<p>{dialogMessageModal.content}</p>}
      action={(
        <FEIBButton onClick={closeMessageDialog}>確定</FEIBButton>
      )}
    />
  );

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
          <span>{ nickName }</span>
          <CreateRounded onClick={showEditNickNameDialog} />
        </div>
        { renderEntryList() }
        { renderDialog() }
        { renderMessageDialog() }
      </ProfileWrapper>
    </Layout>
  );
};

export default Profile;