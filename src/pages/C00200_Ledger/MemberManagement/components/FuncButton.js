import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import PersonAddDisabledIcon from '@material-ui/icons/PersonAddDisabled';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import MailIcon from '@material-ui/icons/Mail';

export default ({ type = 'agree', isDisaply = false, callback = () => {} }) => {
  const ICON_CONFIG = {
    agree: <CheckIcon fontSize="large" />,
    disagree: <CloseIcon fontSize="large" />,
    resend: <MailIcon fontSize="large" />,
    cancel: <PersonAddDisabledIcon fontSize="large" />,
    delete: <CloseIcon fontSize="large" />,
  };
  return (
    <Box display={isDisaply ? 'block' : 'none'} onClick={callback}>
      <IconButton edge="end" aria-label={type}>
        {ICON_CONFIG[type]}
      </IconButton>
    </Box>
  );
};
