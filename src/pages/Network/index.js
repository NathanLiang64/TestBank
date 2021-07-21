import { useState } from 'react';
import { useCheckLocation, usePageInfo } from 'hooks';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

/* Elements */
import {
  FEIBInput, FEIBInputLabel, FEIBButton, FEIBErrorMessage, FEIBIconButton, FEIBTextarea,
} from 'components/elements';
import CopyTextIconButton from 'components/CopyTextIconButton';
import Dialog from 'components/Dialog';

/* Styles */
// eslint-disable-next-line no-unused-vars
import { CreateRounded, KeyboardArrowRightRounded } from '@material-ui/icons';
import Avatar from 'assets/images/avatar.png';
import NetworkWrapper from './network.style';

const Network = () => {
  const [textareaLength, setTextareaLength] = useState(0);
  const [nickName, setNickName] = useState('Joyce Horng');
  const [shareContent, setShareContent] = useState('點擊「成為Bankee會員」申辦Bankee數位存晚帳戶，想活存利率2.6%！');
  const [showEditNickNameDialog, setShowEditNickNameDialog] = useState(false);
  const [showEditShareContentDialog, setShowEditShareContentDialog] = useState(false);

  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    nickName: yup
      .string()
      .when('shareContent', {
        is: () => showEditNickNameDialog,
        then: yup.string().required('請輸入您的名稱'),
        otherwise: yup.string().notRequired(),
      }),
    shareContent: yup
      .string()
      .notRequired(),
  }, [['nickName', 'shareContent']]);
  const {
    handleSubmit, control, formState: { errors }, reset, setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const getTextareaLength = (textLength) => {
    setTextareaLength(textLength);
  };

  const showEditUserNameDialog = () => {
    reset();
    setValue('nickName', nickName);
    setShowEditNickNameDialog(true);
  };

  const onNickNameSubmit = (data) => {
    setNickName(data.nickName);
    setShowEditNickNameDialog(false);
  };

  const showEditContentDialog = () => {
    reset();
    setValue('shareContent', shareContent);
    setTextareaLength(shareContent.length);
    setShowEditShareContentDialog(true);
  };

  const onShareContentSubmit = (data) => {
    console.log(data);
    setShareContent(data.shareContent);
    setShowEditShareContentDialog(false);
  };

  // 編輯暱稱表單
  const renderForm = () => (
    <form id="nickNameForm" onSubmit={handleSubmit(onNickNameSubmit)} style={{ paddingBottom: '2.4rem' }}>
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
      <FEIBButton type="submit">完成</FEIBButton>
    </form>
  );

  // 編輯暱稱 Dialog
  const renderEditNickNameDialog = () => (
    <Dialog
      isOpen={showEditNickNameDialog}
      onClose={() => setShowEditNickNameDialog(false)}
      title="暱稱"
      content={renderForm()}
    />
  );

  const renderTextareaForm = () => (
    <form id="shareContentForm" onSubmit={handleSubmit(onShareContentSubmit)} style={{ paddingBottom: '2.4rem' }}>
      <FEIBInputLabel htmlFor="shareContent" style={{ marginBottom: '.8rem' }}>您的分享內容</FEIBInputLabel>
      <Controller
        name="shareContent"
        defaultValue=""
        control={control}
        render={({ field }) => (
          <FEIBTextarea
            {...field}
            onChange={(e) => {
              field.onChange(e.target.value);
              getTextareaLength(e.target.textLength);
            }}
            type="text"
            id="shareContent"
            name="shareContent"
            placeholder="請輸入您的分享文案"
            maxLength="200"
          />
        )}
      />
      <div style={{ textAlign: 'right', color: textareaLength < 200 ? '#042C5C' : '#FF5F5F', fontSize: '1.2rem' }}>
        <span>
          字數限制（
          { textareaLength }
          /200）
        </span>
      </div>
      <FEIBErrorMessage />
      <FEIBButton type="submit">完成</FEIBButton>
    </form>
  );

  // 編輯分享內容 Dialog
  const renderEditShareContentDialog = () => (
    <Dialog
      isOpen={showEditShareContentDialog}
      onClose={() => setShowEditShareContentDialog(false)}
      title="分享內容"
      content={renderTextareaForm()}
    />
  );

  useCheckLocation();
  usePageInfo('/api/network');

  return (
    <NetworkWrapper>
      <div className="infoContainer">
        <div className="avatarContainer">
          <img src={Avatar} alt="" />
          <div className="penIconContainer">
            <div className="penIconBackground">
              <CreateRounded />
            </div>
          </div>
        </div>
        <div className="nickName">
          <span>{ nickName }</span>
          <CreateRounded onClick={showEditUserNameDialog} />
        </div>
        <div className="level">
          <span>等級 3</span>
        </div>
      </div>
      <div className="contentCard promo">
        <div className="title">推薦好友加入社群圈</div>
        <div className="mainBlock">
          <div className="subTitle">我的推薦碼</div>
          <div className="code">
            <span>
              630FG3
            </span>
            <CopyTextIconButton copyText="630FG3" />
          </div>
        </div>
        <div className="subTitle shareTitle">分享內容</div>
        <div className="shareContent">
          <span>
            { shareContent }
          </span>
          <CreateRounded style={{ fontSize: '2.13rem' }} onClick={showEditContentDialog} />
        </div>
        <FEIBButton>分享推薦碼</FEIBButton>
      </div>
      <div className="contentCard">
        <div className="title">
          <div className="search">
            <span>
              查詢
            </span>
            <FEIBIconButton>
              <KeyboardArrowRightRounded />
            </FEIBIconButton>
          </div>
          社群圈概況
        </div>
        <div className="overviewContent">
          <div className="overviewItem">
            <div className="subTitle">點擊人數</div>
            <div className="num">79</div>
          </div>
          <div className="overviewItem">
            <div className="subTitle">申請中人數</div>
            <div className="num">0</div>
          </div>
          <div className="overviewItem">
            <div className="subTitle">已核可人數</div>
            <div className="num">2</div>
          </div>
        </div>
      </div>
      <div className="contentCard">
        <div className="title">
          社群圈回饋
        </div>
        <div className="overviewContent">
          <div className="overviewItem">
            <div className="subTitle">
              優惠利率額度
              <FEIBIconButton>
                <KeyboardArrowRightRounded />
              </FEIBIconButton>
            </div>
            <div className="num">5 萬</div>
          </div>
          <div className="overviewItem">
            <div className="subTitle">
              信用卡分潤
              <FEIBIconButton>
                <KeyboardArrowRightRounded />
              </FEIBIconButton>
            </div>
            <div className="num">NT $60</div>
          </div>
          <div className="overviewItem">
            <div className="subTitle">貸款社群回饋</div>
            <div className="num">XXXXX</div>
          </div>
        </div>
      </div>
      { renderEditNickNameDialog() }
      { renderEditShareContentDialog() }
    </NetworkWrapper>
  );
};

export default Network;
