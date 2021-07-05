import { useState } from 'react';
import { useCheckLocation, usePageInfo } from 'hooks';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

/* Elements */
import {
  FEIBSwitch, FEIBButton, FEIBSwitchLabel, FEIBCollapse,
} from 'components/elements';
import Dialog from 'components/Dialog';
import ConfirmButtons from 'components/ConfirmButtons';
import { ExpandMoreOutlined } from '@material-ui/icons';
import Alert from 'components/Alert';
import PasswordInput from 'components/PasswordInput';
import Accordion from 'components/Accordion';

/* Styles */
import theme from 'themes/theme';
import NoticeSettingWrapper from './noticeSetting.style';

const NoticeSetting1 = () => {
  /**
   *- 資料驗證
   */
  const schema = yup.object().shape({
    password: yup
      .string()
      .required('請輸入網銀密碼')
      .min(8, '您輸入的網銀密碼長度有誤，請重新輸入。')
      .max(20, '您輸入的網銀密碼長度有誤，請重新輸入。'),
  });
  const {
    handleSubmit, watch, control, formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const noticeTypeArray = ['deposit', 'creditCard', 'loan', 'tradeSafity', 'socialFeedback'];
  const [openDialog, setOpenDialog] = useState(false);
  const [openResultDialog, setOpenResultDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState('是否將通知關閉');
  const [toggleAll, setToggleAll] = useState(false);
  const [noticeData, setNoticeData] = useState({
    deposit: {
      label: '存款',
      on: true,
      data: [
        {
          label: '活期性存款入/扣帳通知',
          on: false,
        },
        {
          label: '台幣預約轉帳交易提醒通知',
          on: false,
        },
      ],
    },
    creditCard: {
      label: '信用卡',
      on: true,
      data: [
        {
          label: '刷卡消費通知',
          on: false,
        },
        {
          label: '帳單繳款截止日通知',
          on: false,
        },
        {
          label: '繳款成功通知',
          on: false,
        },
        {
          label: '自動扣繳通知',
          on: false,
        },
        {
          label: '自動扣繳失敗通知',
          on: false,
        },
      ],
    },
    loan: {
      label: '貸款',
      on: true,
      data: [
        {
          label: '應繳本息通知',
          on: false,
        },
        {
          label: '應繳本息扣款通知',
          on: false,
        },
      ],
    },
    tradeSafity: {
      label: '交易安全',
      on: true,
      data: [
        {
          label: '網路/行動銀行登入通知',
          on: false,
        },
      ],
    },
    socialFeedback: {
      label: '社群圈回饋',
      on: true,
      data: [
        {
          label: '社群圈每月回饋通知',
          on: false,
        },
      ],
    },
  });
  // const [password, setPassword] = useState('');

  const onSubmit = (data) => {
    // eslint-disable-next-line no-console
    console.log(data);
    setOpenResultDialog(true);
  };

  const handleToggleDialog = (bool) => {
    setOpenDialog(bool);
  };

  const handleCollapseChange = (itemLabel) => {
    const newNoticeData = { ...noticeData };
    newNoticeData[itemLabel].on = !newNoticeData[itemLabel].on;
    setNoticeData({ ...newNoticeData });
  };

  const handleSwitchChange = (switchItem, index, noticeType) => {
    const newNoticeData = { ...noticeData };
    newNoticeData[noticeType].data[index].on = !switchItem.on;
    setNoticeData({ ...newNoticeData });
  };

  const handleAllSwitchsChange = (on) => {
    const newNoticeData = { ...noticeData };
    noticeTypeArray.forEach((noticeType) => {
      newNoticeData[noticeType].data.forEach((item) => {
        const data = item;
        data.on = on;
      });
    });
  };

  // const handlePasswordChange = (event) => {
  //   setPassword(event.target.value);
  // };

  const renderIconButton = (show) => (show ? <ExpandMoreOutlined style={{ fontSize: '3rem', color: 'white' }} /> : <ExpandMoreOutlined style={{ fontSize: '3rem', color: theme.colors.primary.light }} />);

  const renderNoticeSwitches = (switchItem, index, noticeType) => (
    <FEIBSwitchLabel
      key={switchItem.label}
      control={
        (
          <FEIBSwitch
            onChange={() => {
              handleSwitchChange(switchItem, index, noticeType);
            }}
            checked={switchItem.on}
          />
        )
      }
      label={switchItem.label}
    />
  );

  // const handleSaveNoticeSetting = () => {
  //   setOpenResultDialog(true);
  // };

  useCheckLocation();
  usePageInfo('/api/noticeSetting');

  return (
    <NoticeSettingWrapper className="settingPage" fullScreen>
      <div className="noticeContainer all">
        <FEIBSwitchLabel
          control={
            (
              <FEIBSwitch
                onChange={() => {
                  const onOffText = toggleAll ? '關閉' : '開啟';
                  setDialogContent(`是否將所有通知${onOffText}？`);
                  setOpenDialog(true);
                }}
                checked={toggleAll}
              />
            )
          }
          label="全部通知開啟/關閉"
          $hasBorder
        />
      </div>
      {
        noticeTypeArray.map((noticeItem) => (
          <div
            key={noticeItem}
            className="noticeContainer"
          >
            <button
              type="button"
              className={noticeData[noticeItem].on ? 'sectionLabel on' : 'sectionLabel'}
              onClick={() => {
                handleCollapseChange(noticeItem);
              }}
            >
              <span>{noticeData[noticeItem].label}</span>
              { renderIconButton(noticeData[noticeItem].on) }
            </button>
            <FEIBCollapse in={noticeData[noticeItem].on}>
              {
                noticeData[noticeItem].data.map((switchItem, index) => (
                  renderNoticeSwitches(switchItem, index, noticeItem)
                ))
              }
            </FEIBCollapse>
          </div>
        ))
      }
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ padding: '0 1.6rem 2.4rem', marginTop: '1rem' }}>
          <PasswordInput
            label="網銀密碼"
            id="password"
            name="password"
            control={control}
            errorMessage={errors.password?.message}
          />
          <Accordion space="bottom">
            <p>一些注意事項</p>
          </Accordion>
          <FEIBButton
            type="submit"
            disabled={!watch('password')}
          >
            確認
          </FEIBButton>
        </div>
      </form>
      {/* 確定起用或關閉全部 */}
      <Dialog
        isOpen={openDialog}
        onClose={() => {
          handleToggleDialog(false);
        }}
        content={dialogContent}
        action={
          (
            <ConfirmButtons
              mainButtonOnClick={() => {
                handleAllSwitchsChange(!toggleAll);
                setToggleAll(!toggleAll);
                handleToggleDialog(false);
              }}
              subButtonOnClick={() => handleToggleDialog(false)}
            />
          )
        }
      />
      {/* 設定成功 */}
      <Dialog
        isOpen={openResultDialog}
        onClose={() => setOpenResultDialog(false)}
        content={(
          <>
            <Alert state="success">設定成功</Alert>
            <div>
              <p>您的訊息通知設定已經更新囉！</p>
            </div>
          </>
        )}
        action={(
          <FEIBButton
            onClick={() => {
              setOpenResultDialog(false);
            }}
          >
            確定
          </FEIBButton>
        )}
      />
    </NoticeSettingWrapper>
  );
};

export default NoticeSetting1;
