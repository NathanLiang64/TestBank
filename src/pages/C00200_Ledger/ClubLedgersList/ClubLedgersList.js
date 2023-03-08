import { useHistory } from 'react-router';
import { Box } from '@material-ui/core';
import { useTheme } from 'styled-components';
import Layout from 'components/Layout/Layout';
import CreditCard from 'components/CreditCard';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { PersonalIcon, HomeIcon } from 'assets/images/icons';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import PageWrapper from './ClubLedgersList.style';
import { generateMockData } from './constants';
import AccountCardGrey from './components/AccountCardGrey';
import LEDGER_IMG from './images/ledger.png';

export default () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const theme = useTheme();
  // 設定 - 開發測試用
  const DEV_TEST_CONFIG = {
    hasLedgerData: true,
  };
  const { hasLedgerData } = DEV_TEST_CONFIG;
  // 點擊 - 新增帳本
  const onAddLedgerClick = () => {
    history.push('CreateLedgerForm');
  };
  // 點擊 - 帳本
  const onLedgerClick = (obj) => {
    console.log(obj);
    history.push('/LedgerDetail');
  };
  // 初始化
  const init = async () => {
    dispatch(setWaittingVisible(true));
    setTimeout(() => dispatch(setWaittingVisible(false)), 300);
  };
  useEffect(() => {
    init();
  }, []);

  return (
    <Layout title="社群帳本" goBackFunc={() => history.goBack()}>
      <PageWrapper>
        {hasLedgerData || (
          <Box mb={3} textAlign="center">
            <Box width="80%" component="img" src={LEDGER_IMG} alt="帳本首圖" />
          </Box>
        )}
        <Box mb={1}>
          <AccountCardGrey
            title={hasLedgerData ? '' : '擁有自己的第一本帳本'}
            callback={onAddLedgerClick}
          />
        </Box>
        {hasLedgerData
          && generateMockData(10).map((item) => (
            <Box key={item.id} mb={1} onClick={() => onLedgerClick(item)}>
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
                        color={theme.colors.text.brand}
                      >
                        主揪
                      </Box>
                    </Box>
                    <Box component="span" ml={1}>
                      {item.account}
                    </Box>
                  </Box>
                )}
                color={item.color}
                annotation={(
                  <Box component="span">
                    <PersonalIcon />
                    <Box component="span" ml={1}>
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
