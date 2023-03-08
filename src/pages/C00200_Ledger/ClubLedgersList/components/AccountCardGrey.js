import Box from '@material-ui/core/Box';
import plus from 'assets/images/icons/addIconGrey.svg';
import AccountCardGreyWrapper from './AccountCardGrey.style';

const AccountCardGrey = ({ title = '', callback = () => {} }) => (
  <AccountCardGreyWrapper>
    <Box className="flex-center" flexDirection="column" onClick={callback}>
      <Box>{title}</Box>
      <Box className="plusWrapper" my={1}>
        <img src={plus} alt="plus" />
      </Box>
    </Box>
  </AccountCardGreyWrapper>
);

export default AccountCardGrey;
