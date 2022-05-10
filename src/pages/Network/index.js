import { useEffect, useState } from 'react';
// import { useHistory } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Dialog from 'components/Dialog';
import Avatar from 'components/Avatar';
import CopyTextIconButton from 'components/CopyTextIconButton';
import {
  FEIBInput, FEIBInputLabel, FEIBButton, FEIBErrorMessage, FEIBIconButton, FEIBTextarea,
} from 'components/elements';
import { ArrowNextIcon, EditIcon } from 'assets/images/icons';
import { hideName, stringDateFormatter } from 'utilities/Generator';
// import { getNetworkUserInfo, getNetworkOverview, getNetworkFeedback } from 'apis/networkApi';
import { goToFunc } from 'utilities/BankeePlus';
import theme from 'themes/theme';
import NetworkWrapper, { ShareContentForm, RecommendListWrapper } from './network.style';
import mockData from './mockData';

const Network = () => {
  const [textareaLength, setTextareaLength] = useState(0);
  const [userInfo, setUserInfo] = useState({});
  const [overview, setOverview] = useState({});
  const [feedback, setFeedback] = useState({});
  const [openDialog, setOpenDialog] = useState({ open: false, title: '' });
  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    nickName: yup
      .string()
      .when('shareContent', {
        is: openDialog.open && openDialog.title === '暱稱',
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
  // const history = useHistory();

  const getTextareaLength = (textLength) => setTextareaLength(textLength);

  const showEditUserNameDialog = () => {
    reset();
    setValue('nickName', userInfo.nickname);
    setOpenDialog({ open: true, title: '暱稱' });
  };

  const onNickNameSubmit = (data) => {
    setUserInfo({ ...userInfo, nickname: data.nickName });
    setOpenDialog({ ...openDialog, open: false });
  };

  const showEditContentDialog = () => {
    reset();
    setValue('shareContent', userInfo.shareContent);
    setTextareaLength(userInfo.shareContent?.length);
    setOpenDialog({ open: true, title: '分享內容' });
  };

  const onShareContentSubmit = (data) => {
    setUserInfo({ ...userInfo, shareContent: data.shareContent });
    setOpenDialog({ ...openDialog, open: false });
  };

  const showRecommendListDialog = () => {
    setOpenDialog({ open: true, title: '推薦名單' });
  };

  const renderText = (value) => value || '-';

  // 編輯暱稱表單
  const renderNicknameForm = () => (
    <form id="nickNameForm" onSubmit={handleSubmit(onNickNameSubmit)} style={{ paddingBottom: '2.4rem' }}>
      <FEIBInputLabel htmlFor="nickName">您的名稱</FEIBInputLabel>
      <Controller
        name="nickName"
        defaultValue=""
        control={control}
        render={({ field }) => (
          <FEIBInput {...field} type="text" id="nickName" name="nickName" placeholder="請輸入您的名稱" error={!!errors.nickName} />
        )}
      />
      <FEIBErrorMessage>{errors.nickName?.message}</FEIBErrorMessage>
      <FEIBButton type="submit">完成</FEIBButton>
    </form>
  );

  const renderShareContentForm = () => (
    <ShareContentForm onSubmit={handleSubmit(onShareContentSubmit)}>
      <FEIBInputLabel htmlFor="shareContent">您的分享文案</FEIBInputLabel>
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
            $borderColor={textareaLength > 200 && theme.colors.state.danger}
            rowsMin={3}
            rowsMax={10}
            id="shareContent"
            name="shareContent"
            placeholder="請輸入您的分享文案"
          />
        )}
      />
      <span className={`limitText ${textareaLength > 200 ? 'warningColor' : ''}`}>
        字數限制（
        { textareaLength }
        /200）
      </span>
      <FEIBErrorMessage />
      <FEIBButton type="submit" disabled={!textareaLength || textareaLength > 200}>完成</FEIBButton>
    </ShareContentForm>
  );

  const renderRecommendList = () => (
    <RecommendListWrapper>
      <table>
        {/* <caption>說明</caption> */}
        <thead>
          <tr>
            <th>姓名</th>
            <th>核卡完成日期</th>
            <th>開戶完成日期</th>
          </tr>
        </thead>
        <tbody>
          { overview.recommendList?.map((item) => (
            <tr key={item.id}>
              <td className="center">{renderText(hideName(item.name))}</td>
              <td className="center">{stringDateFormatter(item.approvedDate)}</td>
              <td className="center">{stringDateFormatter(item.accountApplyDate)}</td>
            </tr>
          )) }
        </tbody>
      </table>
      <FEIBButton onClick={() => setOpenDialog({ ...openDialog, open: false })}>確認</FEIBButton>
    </RecommendListWrapper>
  );

  // eslint-disable-next-line consistent-return
  const dialogContentController = (dialogTitle) => {
    switch (dialogTitle) {
      case '暱稱':
        return renderNicknameForm();
      case '分享內容':
        return renderShareContentForm();
      case '推薦名單':
        return renderRecommendList();
      default:
        return <></>;
    }
  };

  useCheckLocation();
  usePageInfo('/api/network');

  useEffect(() => {
    /* ========== mock data (for mock api) ========== */
    // getNetworkUserInfo()
    //   .then((data) => setUserInfo(data))
    //   .catch((error) => console.error(error));
    //
    // getNetworkOverview()
    //   .then((data) => setOverview(data))
    //   .catch((error) => console.error(error));
    //
    // getNetworkFeedback()
    //   .then((data) => setFeedback(data))
    //   .catch((error) => console.error(error));

    /* ========== mock data (for prototype) ========== */
    const { getNetworkUserInfo, getNetworkOverview, getNetworkFeedback } = mockData;
    setUserInfo(getNetworkUserInfo);
    setOverview(getNetworkOverview);
    setFeedback(getNetworkFeedback);
  }, []);

  return (
    <NetworkWrapper>
      <div className="infoContainer">
        <Avatar src={userInfo?.avatar} name={userInfo?.nickname} />
        <div className="nickName">
          <span className="name">{renderText(userInfo?.nickname)}</span>
          <FEIBIconButton $fontSize={1.6} onClick={showEditUserNameDialog}>
            <EditIcon />
          </FEIBIconButton>
        </div>
        <span className="level">{`等級 ${renderText(userInfo?.level)}`}</span>
      </div>
      <div className="contentCard promo">
        <div className="title">推薦好友加入社群圈</div>
        <div className="mainBlock">
          <div className="subTitle">我的推薦碼</div>
          <div className="code">
            <span>{renderText(userInfo?.referralCode)}</span>
            <CopyTextIconButton copyText={userInfo?.referralCode || ''} displayMessage="已複製推薦碼" />
          </div>
        </div>
        <div className="subTitle shareTitle">分享內容</div>
        <div className="shareContent">
          <span>{renderText(userInfo?.shareContent)}</span>
          <FEIBIconButton $fontSize={1.6} onClick={showEditContentDialog}>
            <EditIcon />
          </FEIBIconButton>
        </div>
        <FEIBButton>分享推薦碼</FEIBButton>
      </div>
      <div className="contentCard">
        <div className="title">
          <div className="search" onClick={showRecommendListDialog}>
            <span>查詢</span>
            <ArrowNextIcon />
          </div>
          社群圈概況
        </div>
        <div className="overviewContent">
          <div className="overviewItem">
            <div className="subTitle">點擊人數</div>
            <div className="num">{renderText(overview.clicks)}</div>
          </div>
          <div className="overviewItem">
            <div className="subTitle">申請中人數</div>
            <div className="num">{renderText(overview.applying)}</div>
          </div>
          <div className="overviewItem">
            <div className="subTitle">已核可人數</div>
            <div className="num">{renderText(overview.approved)}</div>
          </div>
        </div>
      </div>
      <div className="contentCard">
        <div className="title">社群圈回饋</div>
        <div className="overviewContent twoColumn">
          <div className="overviewItem" onClick={() => goToFunc({ route: 'depositPlus', funcID: '' })}>
            <div className="subTitle">
              優惠利率額度
              <ArrowNextIcon />
            </div>
            <div className="num">{renderText(feedback.interestRateLimit)}</div>
          </div>
          <div className="overviewItem">
            <div className="subTitle">
              信用卡分潤
              <ArrowNextIcon />
            </div>
            <div className="num">
              NT$
              {renderText(feedback.profit)}
            </div>
          </div>
          {/* <div className="overviewItem"> */}
          {/*  <div className="subTitle">貸款社群回饋</div> */}
          {/*  <div className="num">{renderText(feedback.loan)}</div> */}
          {/* </div> */}
        </div>
      </div>

      <Dialog
        isOpen={openDialog.open}
        onClose={() => setOpenDialog({ ...openDialog, open: false })}
        title={openDialog.title}
        content={dialogContentController(openDialog.title)}
      />
    </NetworkWrapper>
  );
};

export default Network;
