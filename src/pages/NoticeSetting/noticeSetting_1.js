import { useState } from 'react';
import { useHistory } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';

/* Elements */
import {
  FEIBSwitch, FEIBIconButton, FEIBInputLabel, FEIBInput, FEIBButton,
} from 'components/elements';
import Dialog from 'components/Dialog';
import ConfirmButtons from 'components/ConfirmButtons';
import { Collapse, FormControlLabel } from '@material-ui/core';
import { ExpandMoreOutlined, ErrorOutline } from '@material-ui/icons';

/* Styles */
import theme from 'themes/theme';
import NoticeSettingWrapper from './noticeSetting.style';

const NoticeSetting1 = () => {
  const history = useHistory();
  const noticeTypeArray = ['deposit', 'creditCard', 'loan', 'tradeSafity', 'socialFeedback'];
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState('是否將通知關閉');
  const [handleClickMainButton, setHandleClickMainButton] = useState(() => () => { console.log('test'); });
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
  const [password, setPassword] = useState('');
  const [buttonType, setButtonType] = useState(true);

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

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const renderIconButton = (show) => (show ? <ExpandMoreOutlined style={{ fontSize: '3rem', color: 'white' }} /> : <ExpandMoreOutlined style={{ fontSize: '3rem', color: theme.colors.primary.light }} />);

  const renderNoticeSwitches = (switchItem, index, noticeType) => (
    <FormControlLabel
      key={switchItem.label}
      control={
        (
          <FEIBSwitch
            onChange={() => {
              setButtonType(false);
              const onOffText = switchItem.on ? '關閉' : '開啟';
              setDialogContent(`是否將${switchItem.label}${onOffText}？`);
              setHandleClickMainButton(() => () => handleSwitchChange(switchItem, index, noticeType));
              setOpenDialog(true);
            }}
            checked={switchItem.on}
          />
        )
      }
      label={switchItem.label}
      labelPlacement="start"
    />
  );

  // const [dialogButton, setDialogButton] = useState((
  //   <ConfirmButtons
  //     mainButtonOnClick={() => {
  //       handleClickMainButton();
  //       handleToggleDialog(false);
  //     }}
  //     subButtonOnClick={() => handleToggleDialog(false)}
  //   />
  // ));

  const handleSaveNoticeSetting = () => {
    setButtonType(true);
    if (!password) {
      setDialogContent('請輸入網銀密碼');
      setOpenDialog(true);
      return;
    }
    history.push('/noticeSetting2');
  };

  useCheckLocation();
  usePageInfo('/api/noticeSetting');

  return (
    <NoticeSettingWrapper>
      <div className="noticeContainer all">
        <FormControlLabel
          control={
            (
              <FEIBSwitch
                onChange={() => {
                  const onOffText = toggleAll ? '關閉' : '開啟';
                  setDialogContent(`是否將所有通知${onOffText}？`);
                  setButtonType(false);
                  setHandleClickMainButton(() => () => {
                    handleAllSwitchsChange(!toggleAll);
                    setToggleAll(!toggleAll);
                  });
                  setOpenDialog(true);
                }}
                checked={toggleAll}
              />
            )
          }
          label="全部通知開啟/關閉"
          labelPlacement="start"
        />
      </div>
      {
        noticeTypeArray.map((noticeItem) => (
          <div key={noticeItem} className="noticeContainer">
            <div className={noticeData[noticeItem].on ? 'sectionLabel on' : 'sectionLabel'}>
              <span>{noticeData[noticeItem].label}</span>
              <FEIBIconButton
                $fontSize={2.4}
                $iconColor={theme.colors.primary.brand}
                onClick={() => handleCollapseChange(noticeItem)}
              >
                {renderIconButton(noticeData[noticeItem].on)}
              </FEIBIconButton>
            </div>
            <Collapse in={noticeData[noticeItem].on}>
              {
                noticeData[noticeItem].data.map((switchItem, index) => (
                  renderNoticeSwitches(switchItem, index, noticeItem)
                ))
              }
            </Collapse>
          </div>
        ))
      }
      <FEIBInputLabel $color={theme.colors.primary.brand} style={{ marginTop: '2rem' }}>網銀密碼</FEIBInputLabel>
      <FEIBInput
        type="password"
        name="password"
        value={password}
        $color={theme.colors.primary.dark}
        $borderColor={theme.colors.primary.brand}
        onChange={handlePasswordChange}
      />
      <div className="tip">
        <span>
          注意事項
        </span>
        <ErrorOutline />
      </div>
      <FEIBButton onClick={handleSaveNoticeSetting}>
        確定送出
      </FEIBButton>
      <Dialog
        isOpen={openDialog}
        onClose={() => {
          handleToggleDialog(false);
        }}
        content={dialogContent}
        action={
          buttonType ? (
            <FEIBButton onClick={() => handleToggleDialog(false)}>
              確定
            </FEIBButton>
          ) : (
            <ConfirmButtons
              mainButtonOnClick={() => {
                handleClickMainButton();
                handleToggleDialog(false);
              }}
              subButtonOnClick={() => handleToggleDialog(false)}
            />
          )
          // dialogButton
        }
      />
    </NoticeSettingWrapper>
  );
};

export default NoticeSetting1;
