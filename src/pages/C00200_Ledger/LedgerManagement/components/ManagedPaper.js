import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import { EditAccountIcon, DeleteIcon } from 'assets/images/icons';
import { showCustomPrompt, showError } from 'utilities/MessageModal';
import { TextTwoColumnFiled, ButtonTwoColumnFiled } from './ManagedColumn';
import {
  EditLedgerNameForm,
  EditNickNameForm,
  EditAccountForm,
} from './EditForm';

export default () => {
  const location = useLocation();
  const history = useHistory();
  const { state } = location;
  // Guard
  if (!state) return null;
  useEffect(() => {
    if (!state) showError('未取得狀態資訊', () => history.goBack());
  }, []);

  //   列表 - 欄位設定
  const HEADER_CONFIG = {
    label: state.ledgerName,
    value: '',
    isEdited: state.owner,
  };
  const TEXT_CINFIG = [
    {
      label: '連結帳號',
      value: `(${state.bankeeAccount.bankCode})${state.bankeeAccount.accountNumber}`,
    },
    { label: '建立日期', value: state.createDate },
    { label: '類型', value: state.ledgerTypeName },
    {
      label: '目前帳本金額',
      value: `${state.bankeeAccount.accountCurrency} ${state.ledgerAmount}`,
    },
    {
      label: '我的暱稱',
      value: state.memberNickName,
      isEdited: true,
      onEditClick: () => {
        showCustomPrompt({
          title: '編輯暱稱',
          message: <EditNickNameForm callback={(data) => console.log(data)} />,
        });
      },
    },
    {
      label: '我的綁定帳號',
      value: '',
      isEdited: true,
      isHide: state.owner,
      onEditClick: () => {
        showCustomPrompt({
          title: '編輯綁定帳號',
          message: <EditAccountForm callback={(data) => console.log(data)} />,
        });
      },
    },
  ];
  //   按鈕 - 欄位設定
  const BUTTON_CONFIG = [
    {
      label: '分享明細',
      icon: <EditAccountIcon />,
      callBack: () => {
        console.log('分享明細');
        history.push('/ShareLedgerDetail');
      },
    },
    {
      label: '終止帳本',
      icon: <DeleteIcon />,
      callBack: () => {
        console.log('終止帳本');
        history.push('/AbortLedgerConfirm');
      },
    },
  ];

  //   點擊 - 編輯帳本名稱
  const onLedgerNameEditClick = () => {
    showCustomPrompt({
      title: '編輯帳本名稱',
      message: <EditLedgerNameForm callback={(data) => console.log(data)} />,
    });
  };

  return (
    <Box>
      <Paper>
        <Box p={1}>
          <Box height={35}>
            <TextTwoColumnFiled
              label={HEADER_CONFIG.label}
              value={HEADER_CONFIG.value}
              isEdited={HEADER_CONFIG.isEdited}
              onEditClick={onLedgerNameEditClick}
            />
          </Box>
          <Divider />
          {TEXT_CINFIG.map((item) => (
            <Box key={item.label} display={item.isHide ? 'none' : 'block'}>
              <TextTwoColumnFiled {...item} />
            </Box>
          ))}
          <Divider />
          {state.owner
            && BUTTON_CONFIG.map((item) => (
              <ButtonTwoColumnFiled key={item.label} {...item} />
            ))}
        </Box>
      </Paper>
    </Box>
  );
};
