import { useHistory } from 'react-router';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import { EditAccountIcon, DeleteIcon } from 'assets/images/icons';
import { showCustomPrompt } from 'utilities/MessageModal';
import { TextTwoColumnFiled, ButtonTwoColumnFiled } from './ManagedColumn';
import {
  EditLedgerNameForm,
  EditNickNameForm,
  EditAccountForm,
} from './EditForm';

export default () => {
  const history = useHistory();

  //   列表 - 欄位設定
  const TEXT_CINFIG = [
    { label: '連結帳號', value: '' },
    { label: '建立日期', value: '' },
    { label: '類型', value: '' },
    { label: '目前帳本金額', value: '' },
    {
      label: '我的暱稱',
      value: '',
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
              label="帳本名稱"
              isEdited
              onEditClick={onLedgerNameEditClick}
            />
          </Box>
          <Divider />
          {TEXT_CINFIG.map((item) => (
            <TextTwoColumnFiled key={item.label} {...item} />
          ))}
          <Divider />
          {BUTTON_CONFIG.map((item) => (
            <ButtonTwoColumnFiled key={item.label} {...item} />
          ))}
        </Box>
      </Paper>
    </Box>
  );
};
