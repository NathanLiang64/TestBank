import Box from '@material-ui/core/Box';
import plus from 'assets/images/icons/addIconGrey.svg';
import { useTheme } from 'styled-components';

export default ({ callback = () => {} }) => {
  const theme = useTheme();
  return (
    <Box
      onClick={callback}
      width={60}
      height={60}
      borderRadius={50}
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor={theme.colors.background.lightest}
      boxShadow={`1px 1px ${theme.colors.background.lightness}`}
    >
      <Box
        width={30}
        height={30}
        component="img"
        alt="新增成員按鈕"
        src={plus}
      />
    </Box>
  );
};
