import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import { useTheme } from 'styled-components';
import { showAnimationModal } from 'utilities/MessageModal';
import { memberImage } from '../../utils/images';
import {
  kickout, confirm, resend, cancel,
} from '../api';
import FuncButton from './FuncButton';

export default ({
  title = '',
  list = [],
  setList = () => {},
  listType = 3,
  isLedgerOwner = false,
}) => {
  const theme = useTheme();
  // 分類成員邀請狀態
  const sortMemberList = (memberList) => memberList.filter((i) => i?.memberInviteStatus === listType);
  // 刪除成員
  const onDeleteClick = async (id) => {
    const resFromKickout = await kickout({ partnerId: id });
    showAnimationModal({
      isSuccess: resFromKickout,
      successTitle: '設定成功',
      errorTitle: '設定失敗',
    });
    if (resFromKickout) {
      setList((p) => {
        const newList = p.filter((item) => item?.groupMemberId !== id);
        return newList;
      });
    }
  };
  // 取消邀請
  const onCancelClick = async (token) => {
    const resFromCancel = await cancel({ token });
    showAnimationModal({
      isSuccess: resFromCancel,
      successTitle: '設定成功',
      errorTitle: '設定失敗',
    });
    if (resFromCancel) {
      setList((p) => {
        const newList = p.filter((item) => item?.inviteToken !== token);
        return newList;
      });
    }
  };
  // 重新邀請
  const onResendClick = async (token) => {
    const resFromResend = await resend({ token });
    showAnimationModal({
      isSuccess: resFromResend,
      successTitle: '設定成功',
      errorTitle: '設定失敗',
    });
  };
  // 是否同意成員加入
  const onIsAgreeClick = async (id, isAgree = false) => {
    const resFromConfirm = await confirm({ accept: isAgree, partnerId: id });
    showAnimationModal({
      isSuccess: resFromConfirm,
      successTitle: '設定成功',
      errorTitle: '設定失敗',
    });
    if (resFromConfirm) {
      if (isAgree) {
        // 同意
        setList((p) => {
          const newList = p.map((item) => {
            if (item?.groupMemberId === id) {
              item.memberInviteStatus = 3;
            }
            return item;
          });
          return newList;
        });
      } else {
        // 不同意
        setList((p) => {
          const newList = p.filter((item) => item?.groupMemberId !== id);
          return newList;
        });
      }
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
          <ListItem>{`${title} (${sortMemberList(list).length})`}</ListItem>
          <Divider />
        </Box>
        {sortMemberList(list).map((item) => (
          <Box key={item.memberId || item.inviteToken}>
            <ListItem>
              <ListItemAvatar>
                <Box width={45} height={45}>
                  {memberImage({ isOwner: item.isOwner })}
                </Box>
              </ListItemAvatar>
              {item.memberNickName || item.memberMobile}
              <ListItemSecondaryAction>
                <Box display="flex">
                  {/* 同意成員加入 */}
                  <FuncButton
                    type="agree"
                    isDisaply={[2].includes(listType)}
                    callback={() => onIsAgreeClick(item.groupMemberId, true)}
                  />
                  {/* 不同意成員加入 */}
                  <FuncButton
                    type="disagree"
                    isDisaply={[2].includes(listType)}
                    callback={() => onIsAgreeClick(item.groupMemberId, false)}
                  />
                  {/* 重新邀請 */}
                  <FuncButton
                    type="resend"
                    isDisaply={[1].includes(listType)}
                    callback={() => onResendClick(item.inviteToken)}
                  />
                  {/* 取消邀請 */}
                  <FuncButton
                    type="cancel"
                    isDisaply={[1].includes(listType)}
                    callback={() => onCancelClick(item.inviteToken)}
                  />
                  {/* 刪除成員 */}
                  <FuncButton
                    type="delete"
                    isDisaply={
                      isLedgerOwner && !item.isOwner && [3].includes(listType)
                    }
                    callback={() => onDeleteClick(item.groupMemberId)}
                  />
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
