import { useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import { ArrowNextIcon } from 'assets/images/icons';
import LinkIcon from '@material-ui/icons/Link';
import CropFreeIcon from '@material-ui/icons/CropFree';
import { customPopup, showAnimationModal } from 'utilities/MessageModal';
import { shareMessage } from 'utilities/AppScriptProxy';
import { useTheme } from 'styled-components';
import InvitationQrCode from './InvitationQrCode';
import { inviteSend } from '../api';

// 列表欄位
export const ListColumn = ({
  label,
  icon,
  callBack = () => {},
  showDivider = true,
}) => (
  <>
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      height={35}
      m={1}
      onClick={callBack}
    >
      <Box display="flex">
        <Box>{icon}</Box>
        <Box ml={1}>{label}</Box>
      </Box>
      <Box>
        <ArrowNextIcon />
      </Box>
    </Box>
    <Box display={showDivider ? 'block' : 'none'}>
      <Divider />
    </Box>
  </>
);

export const InvitationList = () => {
  const theme = useTheme();
  // 狀態設定
  const [invitationUrl, setInvitationUrl] = useState(null);
  // 取得邀請好友url
  const fetchInvitationUrl = async () => {
    const resFromInviteSend = await inviteSend({ type: 'S' });
    setInvitationUrl(resFromInviteSend);
  };
  // 初始設定
  useEffect(() => {
    fetchInvitationUrl();
  }, []);
  // 列表設定
  const CONFIG = [
    {
      label: '發送邀請連結',
      icon: <LinkIcon />,
      showDivider: true,
      callBack: () => {
        if (!invitationUrl) {
          showAnimationModal({
            isSuccess: false,
            errorTitle: '設定失敗',
            errorDesc: '未取得邀請連結',
          });
          return null;
        }
        shareMessage(invitationUrl);
        return null;
      },
    },
    {
      label: '秀QRCode',
      icon: <CropFreeIcon />,
      showDivider: false,
      callBack: () => {
        if (!invitationUrl) {
          showAnimationModal({
            isSuccess: false,
            errorTitle: '設定失敗',
            errorDesc: '未取得邀請連結',
          });
          return null;
        }
        customPopup('邀請好友QRCode', <InvitationQrCode url={invitationUrl} />);
        return null;
      },
    },
  ];

  return (
    <Box>
      <Box bgcolor={theme.colors.background.lightest} p={1} borderRadius={20}>
        {CONFIG.map((item) => (
          <ListColumn
            key={item.label}
            label={item.label}
            callBack={item.callBack}
            icon={item.icon}
            showDivider={item.showDivider}
          />
        ))}
      </Box>
      <Box color="red" textAlign="center" my={3} fontWeight={300}>
        邀請連結有效期限皆為3天~
      </Box>
    </Box>
  );
};
