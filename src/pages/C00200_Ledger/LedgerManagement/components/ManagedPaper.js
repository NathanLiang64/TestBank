import { useHistory } from 'react-router';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import { EditAccountIcon, DeleteIcon } from 'assets/images/icons';
import { TextTwoColumnFiled, ButtonTwoColumnFiled } from './ManagedColumn';
import usePopupForm from '../customHooks/usePopupForm';

export default () => {
  const history = useHistory();

  const { showPopupForm: showNameForm } = usePopupForm({
    title: '編輯帳本名稱',
  });
  const { showPopupForm: showNickNameForm } = usePopupForm({
    title: '編輯暱稱',
  });
  const { showPopupForm: showAccountForm } = usePopupForm({
    title: '編輯我的綁定帳號',
  });

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
        showNickNameForm((data) => console.log(data));
      },
    },
    {
      label: '我的綁定帳號',
      value: '',
      isEdited: true,
      onEditClick: () => {
        showAccountForm((data) => console.log(data));
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
    showNameForm((data) => console.log(data));
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
