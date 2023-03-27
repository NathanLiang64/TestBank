import { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router';
import { Box } from '@material-ui/core';
import { useTheme } from 'styled-components';
import Layout from 'components/Layout/Layout';
import CreditCard from 'components/CreditCard';
import { useDispatch } from 'react-redux';
import { PersonalIcon } from 'assets/images/icons';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { showError } from 'utilities/MessageModal';
import { useNavigation } from 'hooks/useNavigation';
import { Func } from 'utilities/FuncID';
import PageWrapper from './ClubLedgersList.style';
import { getAllLedgers, start } from './api';
// import { getAllLedgers } from './constants/mockData';
import AccountCardGrey from './components/AccountCardGrey';
import LEDGER_IMG from './images/ledger.png';
import { memberImage } from '../utils/images';

export default () => {
  const isMounted = useRef(false);
  const history = useHistory();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { goHome } = useNavigation();
  // 狀態設定
  const [ledgerList, setLedgerList] = useState([]);
  const [hasLedgerData, setHasLedgerData] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
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
      goHome();
      return null;
    }
    const resFromGetAllLedgers = await getAllLedgers();
    const { ledger = [] } = resFromGetAllLedgers;
    setLedgerList(ledger);
    setHasLedgerData(ledger.length !== 0);
    setIsInitializing(false);
    return null;
  };
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      init();
    } else {
      dispatch(setWaittingVisible(false));
    }
  }, [isInitializing]);

  return (
    <Layout title="社群帳本" fid={Func.C002} goBackFunc={() => history.goBack()}>
      <PageWrapper>
        {hasLedgerData || (
          <Box mb={3} textAlign="center">
            <Box width="80%" component="img" src={LEDGER_IMG} alt="帳本首圖" />
          </Box>
        )}
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
                    <Box display="flex" alignItems="center">
                      <Box display={owner ? 'block' : 'none'} mr={1}>
                        {memberImage({
                          isOwner: true,
                          style: { width: '30px', height: '30px' },
                        })}
                      </Box>
                      <Box>{ledgerName}</Box>
                    </Box>
                  )}
                  color={
                    Object.keys(theme.colors.card)[ledgerColor]
                    || Object.keys(theme.colors.card)[0]
                  }
                  annotation={(
                    <Box display="flex" alignItems="center">
                      <PersonalIcon />
                      <Box ml={1}>{sumOfMembers}</Box>
                    </Box>
                  )}
                  balance={parseInt(ledgerAmount.replace(/,/g, ''), 10)}
                  fixHeight
                />
              </Box>
            );
          })}
        <Box mb={1}>
          <AccountCardGrey
            title={hasLedgerData ? '' : '擁有自己的第一本帳本'}
            callback={onAddLedgerClick}
          />
        </Box>
      </PageWrapper>
    </Layout>
  );
};
