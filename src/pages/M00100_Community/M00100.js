import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

/* Elements */
import Layout from 'components/Layout/Layout';
import Avatar from 'components/Avatar';
import CopyTextIconButton from 'components/CopyTextIconButton';
import { FEIBButton, FEIBIconButton } from 'components/elements';

/* Reducers & JS functions */
import { setModalVisible, setWaittingVisible } from 'stores/reducers/ModalReducer';
import { showCustomPrompt } from 'utilities/MessageModal';
import { reloadHeadshot, shareMessage } from 'utilities/AppScriptProxy';
import { ArrowNextIcon, EditIcon } from 'assets/images/icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { TextareaField, TextInputField } from 'components/Fields';
import { useDispatch } from 'react-redux';
import { switchZhNumber, toCurrency } from 'utilities/Generator';
import { Func } from 'utilities/FuncID';
import { useNavigation, loadFuncParams } from 'hooks/useNavigation';
import {
  getSummary,
  updateAvatar,
  updateNickname,
  updateEssay,
} from './api';
import NetworkWrapper from './M00100.style';
import { validationSchema } from './validationSchema';

/**
 * 社群圈首頁
 */
const CommunityPage = () => {
  const [summary, setSummary] = useState();
  const dispatch = useDispatch();
  const { startFunc } = useNavigation();
  const renderText = (value) => ((value !== null) ? value : '-');
  const defaultEssay = '點擊「成為Bankee會員」申辦Bankee數位存款帳戶，享活存利率2.6%！';
  const shareMessageContent = () => `${summary?.essay ?? defaultEssay} ${process.env.REACT_APP_RECOMMEND_URL}${summary.memberNo}`;

  const { control, reset, handleSubmit } = useForm({
    defaultValues: { nickname: '', essay: defaultEssay },
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    const startParams = await loadFuncParams(); // Function Controller 提供的參數
    // 取得 Function Controller 提供的 keepData(model)
    let model;
    if (startParams && (typeof startParams === 'object')) {
      model = startParams;
    } else {
      model = {
        summary: null, // 社群圈摘要資訊
      };
    }

    // 首次加載時取得社群圈摘要資訊
    if (!model.summary) {
      model.summary = await getSummary();
    }
    setSummary(model.summary);
    const {nickname, essay} = model.summary;
    reset({nickname, essay: essay ?? defaultEssay}); // 點選社群圈"編輯"分享內容時，應該顯示預設文字

    dispatch(setWaittingVisible(false));
  }, []);

  /**
   * 編輯暱稱
   */
  const showNicknameEditDialog = async () => {
    const body = (
      <div id="nickNameForm" style={{ paddingBottom: '2.4rem' }}>
        <TextInputField
          control={control}
          name="nickname"
          labelName="您的名稱"
          inputProps={{ maxLength: 20, placeholder: '請輸入您的名稱' }}
        />
      </div>
    );
    const onOk = async ({ nickname }) => {
      dispatch(setModalVisible(false));
      await updateNickname(nickname);
      setSummary({ ...summary, nickname }); // 變更暱稱(Note:一定要換新物件，否則不會觸發更新，造成畫面不會重刷！)
      reset({ nickname, essay: summary.essay });
    };

    await showCustomPrompt({
      titile: '暱稱',
      message: body,
      onOk: handleSubmit(onOk),
      onClose: () => reset({ nickname: summary.nickname, essay: summary.essay }),
      noDismiss: true,
    });
  };

  /**
   * 編輯 您的分享文案
   */
  const showEssayEditDialog = async () => {
    const body = (
      <TextareaField
        control={control}
        name="essay"
        labelName="您的分享文案"
        placeholder="請輸入您的分享文案"
        rowsMin={3}
        rowsMax={10}
      />
    );
    const onOk = async ({ essay }) => {
      dispatch(setModalVisible(false));
      const renewEssay = essay !== '' ? essay : defaultEssay;
      setSummary({ ...summary, essay: renewEssay }); // 變更分享文案(Note:一定要換新物件，否則不會觸發更新，造成畫面不會重刷！)
      await updateEssay(renewEssay);
      reset({nickname: summary.nickname, essay: renewEssay}); // 重設預設文字為所輸入之文字，若user清空文字則顯示defaultEssay
    };
    await showCustomPrompt({
      title: '分享內容',
      message: body,
      onOk: handleSubmit(onOk),
      onClose: () => reset({nickname: summary.nickname, essay: summary.essay ?? defaultEssay}),
      noDismiss: true,
    });
  };

  /**
   * 頁面輸出
   */

  const onNewPhotoLoaded = async (newImg) => {
    const { isSuccess } = await updateAvatar(newImg);
    if (isSuccess) reloadHeadshot();
  };

  return (
    <Layout fid={Func.M001} title="社群圈">
      <NetworkWrapper>
        <div className="infoContainer">
          <Avatar
            memberId={summary?.uuid}
            name={summary?.nickname}
            editable
            onNewPhotoLoaded={onNewPhotoLoaded}
          />
          <div className="nickname">
            <span className="name">{renderText(summary?.nickname)}</span>
            <FEIBIconButton $fontSize={1.6} onClick={showNicknameEditDialog}>
              <EditIcon />
            </FEIBIconButton>
          </div>
          <span className="level">
            {`等級 ${renderText(summary?.socailLevel)}`}
          </span>
        </div>
        <div className="contentCard promo">
          <div className="title">推薦好友加入社群圈</div>
          <div className="mainBlock">
            <div className="subTitle">我的推薦碼</div>
            <div className="code">
              <span>{renderText(summary?.memberNo)}</span>
              <CopyTextIconButton
                copyText={summary?.memberNo || ''}
                displayMessage="已複製推薦碼"
              />
            </div>
          </div>
          <div className="subTitle shareTitle">分享內容</div>
          <div className="essay">
            <span>
              {renderText(summary?.essay ? summary.essay : defaultEssay)}
            </span>
            <FEIBIconButton $fontSize={1.6} onClick={showEssayEditDialog}>
              <EditIcon />
            </FEIBIconButton>
          </div>
          <FEIBButton onClick={() => shareMessage(shareMessageContent())}>
            分享推薦碼
          </FEIBButton>
        </div>
        <div className="contentCard">
          <div className="title">
            <div
              className="search"
              onClick={() => startFunc('M00200', null, { summary })}
            >
              <span>查詢</span>
              <ArrowNextIcon />
            </div>
            社群圈概況
          </div>
          <div className="overviewContent">
            <div className="overviewItem">
              <div className="subTitle">點擊人數</div>
              <div className="num">
                {renderText(summary?.community.hitTimes)}
              </div>
            </div>
            <div className="overviewItem">
              <div className="subTitle">申請中人數</div>
              <div className="num">
                {renderText(summary?.community.applying)}
              </div>
            </div>
            <div className="overviewItem">
              <div className="subTitle">已核可人數</div>
              <div className="num">
                {renderText(summary?.community.approved)}
              </div>
            </div>
          </div>
        </div>
        <div className="contentCard">
          <div className="title">社群圈回饋</div>
          <div className="overviewContent twoColumn">
            <div
              className="overviewItem"
              onClick={() => startFunc('depositPlus', null, { summary })}
            >
              <div className="subTitle">
                優惠存款額度
                <ArrowNextIcon />
              </div>
              <div className="num">
                {`${switchZhNumber(summary?.bonusInfo.amount)}`}
              </div>
            </div>
            <div
              className="overviewItem"
              onClick={() => startFunc('C007002', null, { summary })}
            >
              <div className="subTitle">
                信用卡回饋
                <ArrowNextIcon />
              </div>
              <div className="num">
                {`NT$${toCurrency(summary?.bonusInfo.profit)}`}
              </div>
            </div>
            {/* <div className="overviewItem"> */}
            {/*  <div className="subTitle">貸款社群回饋</div> */}
            {/*  <div className="num">{renderText(feedback.loan)}</div> */}
            {/* </div> */}
          </div>
        </div>
      </NetworkWrapper>
    </Layout>
  );
};

export default CommunityPage;
