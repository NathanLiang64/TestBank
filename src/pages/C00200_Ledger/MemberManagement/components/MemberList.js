import { useState } from 'react';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import PersonIcon from '@material-ui/icons/Person';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import { useTheme } from 'styled-components';
import { showAnimationModal } from 'utilities/MessageModal';
import { kickout } from '../api';

export default ({ title = '', list = [], isLedgerOwner = false }) => {
  const theme = useTheme();
  // 狀態設定
  const [listViewModel, setListViewModel] = useState(list);
  // 刪除成員(是主揪的話 UI才有移除按鈕)
  const onDeleteClick = async (id) => {
    const resFromKickout = await kickout(id);
    showAnimationModal({
      isSuccess: resFromKickout,
      successTitle: '設定成功',
      errorTitle: '設定失敗',
    });
    if (resFromKickout) {
      setListViewModel((p) => {
        const newList = p.filter((item) => item.groupMemberId !== id);
        setListViewModel(newList);
      });
    }
  };
  return (
    <Box
      bgcolor={theme.colors.background.lightest}
      mb={1}
      borderRadius="20px 20px 0px 0px"
    >
      <List disablePadding>
        <Box
          bgcolor={theme.colors.card.purple}
          borderRadius="20px 20px 0px 0px"
        >
          <ListItem>{`${title} (${listViewModel.length})`}</ListItem>
          <Divider />
        </Box>
        {listViewModel.map((item) => (
          <Box key={item.memberId}>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  {item.isOwner ? (
                    <PersonOutlineIcon fontSize="large" />
                  ) : (
                    <PersonIcon fontSize="large" />
                  )}
                </Avatar>
              </ListItemAvatar>
              {item.memberNickName}
              <ListItemSecondaryAction>
                <Box
                  display={isLedgerOwner && !item.isOwner ? 'block' : 'none'}
                  onClick={() => onDeleteClick(item.groupMemberId)}
                >
                  <IconButton edge="end" aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
          </Box>
        ))}
      </List>
    </Box>
  );
};
