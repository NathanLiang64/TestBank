import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import { ArrowNextIcon, EditIcon } from 'assets/images/icons';

// 文字列元件(兩欄)
export const TextTwoColumnFiled = ({
  label = '',
  value = '',
  isEdited = false,
  onEditClick = () => {},
}) => (
  <Box display="flex" justifyContent="space-between" m={1}>
    <Box>{label}</Box>
    <Box display="flex">
      <Box>{value}</Box>
      <Box ml={1} display={isEdited ? 'block' : 'none'} onClick={onEditClick}>
        <EditIcon />
      </Box>
    </Box>
  </Box>
);

// 按鈕列元件(兩欄)
export const ButtonTwoColumnFiled = ({ label, icon, callBack = () => {} }) => (
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
    <Divider />
  </>
);
