import { useState } from 'react';
import { useHistory } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

/* Elements */
import {
  FEIBInput, FEIBInputLabel, FEIBButton, FEIBErrorMessage,
} from 'components/elements';
import Dialog from 'components/Dialog';

/* Styles */
import { CreateRounded, KeyboardArrowRightRounded } from '@material-ui/icons';
import Avatar from 'assets/images/avatar.png';
import SettingList from './settingList';
import ProfileWrapper from './profile.style';

const Profile = () => {
  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    userName: yup
      .string()
      .required('請輸入您的名稱'),
  });
  const {
    handleSubmit, control, formState: { errors }, reset, setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const history = useHistory();

  const [userName, setUserName] = useState('Joyce Horng');
  const [showChangeUserNameDialog, setShowChangeUserNameDialog] = useState(false);

  const showEditUserNameDialog = () => {
    reset();
    setValue('userName', userName);
    setShowChangeUserNameDialog(true);
  };

  const onSubmit = (data) => {
    setUserName(data.userName);
    setShowChangeUserNameDialog(false);
  };

  const toPage = (route) => {
    if (route) {
      history.push(route);
    }
  };

  const renderEntryList = () => SettingList.map((item) => (
    <div className="entryList" key={item.name} onClick={() => toPage(item.route)}>
      {item.name}
      <KeyboardArrowRightRounded />
    </div>
  ));

  const renderForm = () => (
    <form id="userNameForm" onSubmit={handleSubmit(onSubmit)}>
      <FEIBInputLabel htmlFor="userName">您的名稱</FEIBInputLabel>
      <Controller
        name="userName"
        defaultValue=""
        control={control}
        render={({ field }) => (
          <FEIBInput
            {...field}
            type="text"
            id="userName"
            name="userName"
            placeholder="請輸入您的名稱"
            error={!!errors.userName}
          />
        )}
      />
      <FEIBErrorMessage>{errors.userName?.message}</FEIBErrorMessage>
    </form>
  );

  useCheckLocation();
  usePageInfo('/api/profile');

  return (
    <ProfileWrapper>
      <div className="avatarContainer">
        <img src={Avatar} alt="" />
        <div className="penIconContainer">
          <div className="penIconBackground">
            <CreateRounded />
          </div>
        </div>
      </div>
      <div className="userName">
        <span>{ userName }</span>
        <CreateRounded onClick={showEditUserNameDialog} />
      </div>
      { renderEntryList() }
      <Dialog
        isOpen={showChangeUserNameDialog}
        onClose={() => setShowChangeUserNameDialog(false)}
        title="編輯名稱"
        content={renderForm()}
        action={(<FEIBButton type="submit" form="userNameForm">完成</FEIBButton>)}
      />
    </ProfileWrapper>
  );
};

export default Profile;
