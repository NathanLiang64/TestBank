import { Box } from '@material-ui/core';
import { useTheme } from 'styled-components';
import Layout from 'components/Layout/Layout';
import CreditCard from 'components/CreditCard';
import { PersonalIcon, HomeIcon } from 'assets/images/icons';
import PageWrapper from './ClubLedgersList.style';
import { MOCK_DATA } from './constants';
import AccountCardGrey from './components/AccountCardGrey';

export default () => {
  const theme = useTheme();
  return (
    <Layout title="社群帳本" goBackFunc={() => {}}>
      <PageWrapper>
        <Box mb={1}>
          <AccountCardGrey />
        </Box>
        {MOCK_DATA.map((item) => (
          <Box key={item.id} mb={1}>
            <CreditCard
              cardName={(
                <Box component="span">
                  <Box
                    component="span"
                    display={item.isHost ? 'inline-block' : 'none'}
                  >
                    <HomeIcon />
                    <Box
                      component="span"
                      ml={0.5}
                      color={theme.colors.card.purple}
                    >
                      主揪
                    </Box>
                  </Box>
                  <Box component="span" ml={1} color="point">
                    {item.account}
                  </Box>
                </Box>
              )}
              color={item.color}
              annotation={(
                <Box component="span">
                  <PersonalIcon />
                  <Box component="span" ml={1} color="point">
                    {item.partySize}
                  </Box>
                </Box>
              )}
              balance={item.amount}
            />
          </Box>
        ))}
      </PageWrapper>
    </Layout>
  );
};
