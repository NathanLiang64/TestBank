import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Box } from '@material-ui/core';
import { useTheme } from 'styled-components';
import Layout from 'components/Layout/Layout';
import CreditCard from 'components/CreditCard';
import { useDispatch } from 'react-redux';
import { PersonalIcon, HomeIcon } from 'assets/images/icons';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { showError } from 'utilities/MessageModal';
import PageWrapper from './ClubLedgersList.style';
import { getAllLedgers, start } from './api';
// import { getAllLedgers } from './constants/mockData';
import AccountCardGrey from './components/AccountCardGrey';
import LEDGER_IMG from './images/ledger.png';

export default () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const theme = useTheme();
  // 狀態設定
  const [ledgerList, setLedgerList] = useState([]);
  const [hasLedgerData, setHasLedgerData] = useState(false);
  // 點擊 - 新增帳本
  const onAddLedgerClick = () => {
    const allowCreateNewLedger = ledgerList.filter((i) => i.owner)?.length < 8;
    if (!allowCreateNewLedger) {
      showError('帳本建立最多8本', () => {});
      return null;
    }
    history.push('CreateLedgerForm');
    return null;
  };
  // 點擊 - 帳本
  const onLedgerClick = (obj) => {
    console.log(obj);
    history.push('/LedgerDetail', obj);
  };
  // 初始化
  const init = async () => {
    dispatch(setWaittingVisible(true));
    const resFromStart = await start();
    if (!resFromStart) {
      history.goBack();
      return null;
    }
    const resFromGetAllLedgers = await getAllLedgers();
    const { ledger = [] } = resFromGetAllLedgers;
    setLedgerList(ledger);
    setHasLedgerData(ledger.length !== 0);
    dispatch(setWaittingVisible(false));
    return null;
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
          && ledgerList.map((item) => {
            const {
              ledgerAmount,
              ledgerColor,
              owner,
              sumOfMembers,
              ledgerId,
              ledgerName,
            } = item;
            return (
              <Box key={ledgerId} mb={1} onClick={() => onLedgerClick(item)}>
                <CreditCard
                  cardName={(
                    <Box component="span">
                      <Box
                        component="span"
                        display={owner ? 'inline-block' : 'none'}
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
                        {ledgerName}
                      </Box>
                    </Box>
                  )}
                  color={
                    Object.keys(theme.colors.card)[ledgerColor]
                    || Object.keys(theme.colors.card)[0]
                  }
                  annotation={(
                    <Box component="span">
                      <PersonalIcon />
                      <Box component="span" ml={1}>
                        {sumOfMembers}
                      </Box>
                    </Box>
                  )}
                  balance={parseInt(ledgerAmount.replace(/,/g, ''), 10)}
                />
              </Box>
            );
          })}
      </PageWrapper>
    </Layout>
  );
};
