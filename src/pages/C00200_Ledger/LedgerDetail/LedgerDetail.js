import { useState, useRef, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useTheme } from 'styled-components';
import { Box } from '@material-ui/core';
import Layout from 'components/Layout/Layout';
import DetailCard from 'components/DetailCard';
import { FEIBButton } from 'components/elements';
import CreditCard from 'components/CreditCard';
import InformationTape from 'components/InformationTape';
import AccountDetailsWrapper from 'components/AccountDetails/accountDetails.style';
import {
  PersonalIcon,
  ArrowNextIcon,
  EditIcon,
  HomeIcon,
} from 'assets/images/icons';
import {
  showCustomPrompt,
  showError,
  showAnimationModal,
} from 'utilities/MessageModal';
import Loading from 'components/Loading';
// import { getLedgerTxn } from './constants/mockData';
import { Func } from 'utilities/FuncID';
import { getLedgerTxn, openLedger, setAnnouncement } from './api';
import { EditNotifyForm } from './components/EditForm';
import PageWrapper from './LedgerDetail.style';

export default () => {
  const location = useLocation();
  const history = useHistory();
  const timer = useRef();
  const theme = useTheme();
  const isMounted = useRef(false);
  // 狀態設定
  const { state } = location;
  const [viewModel, setViewModel] = useState(state || {});
  const [notify, setNotify] = useState('');
  const [transactionList, setTransactionList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInit, setIsInit] = useState(true);

  // 畫面初始化
  const init = async () => {
    // 進入頁面時先判斷是否帶入 state -> 若無則返回上一頁
    if (!state) {
      showError('未取得LedgerId', () => history.goBack());
      return null;
    }
    setIsLoading(true);
    const resFromOpenLedger = await openLedger({ ledgerId: state.ledgerId });
    setViewModel((p) => ({ ...p, ...resFromOpenLedger }));
    setNotify(resFromOpenLedger?.ledgerPublisher?.publishDesc);
    const resFromLedgerTxn = await getLedgerTxn({ sync: false });
    setIsLoading(false);
    const { txnList = [] } = resFromLedgerTxn;
    setTransactionList(txnList);
    setIsInit(false);
    return null;
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      history.push(location.pathname, viewModel);
    }
  }, [viewModel]);

  const panelContent = [
    {
      id: 1,
      label: '給錢',
      onClick: () => {
        console.log('給錢', state);
        history.push('/transferSetting', state);
      },
    },
    {
      id: 2,
      label: '要錢',
      onClick: () => {
        console.log('要錢', state);
        if (state.owner) {
          history.push('/paymentRequest', state);
        } else {
          history.push('/InvoiceSending', state);
        }
      },
    },
  ];
  // 點擊 - 編輯公告訊息
  const onAnnouncementClick = () => {
    showCustomPrompt({
      title: '編輯公告訊息',
      message: (
        <EditNotifyForm
          memoDefaultValue={notify}
          callback={async (data) => {
            const res = await setAnnouncement({ message: data });
            if (res) setNotify(data);
            showAnimationModal({
              isSuccess: res,
              successTitle: '設定成功',
              errorTitle: '設定失敗',
            });
          }}
        />
      ),
    });
  };
  // 點擊 - 帳本管理
  const onCardMoreClick = () => {
    console.log('帳本管理', state);
    history.push('/LedgerManagement', state);
  };
  // 點擊 - 查看成員
  const onCardMemberClick = () => {
    console.log('查看成員', state);
    history.push('/MemberManagement', state);
  };
  // 點擊 - 單筆明細
  const onDetailClick = (e, item) => {
    e.stopPropagation();
    console.log('查看明細', item);
    history.push('/RecordDetail', item);
  };
  // 滾動 - 明細清單 -> 滾動至視圖底部時 呼叫API新增明細
  const isDetectBottom = false;
  const onDetailScroll = (e) => {
    if (!isDetectBottom) return;
    const { clientHeight, scrollHeight, scrollTop } = e.target;
    const isBottom = scrollTop + clientHeight + 60 > scrollHeight;
    if (isBottom && !isLoading) {
      setIsLoading(true);
      timer.current = setTimeout(() => {
        setIsLoading(false);
        setTransactionList((p) => [...p, ...[]]);
      }, 1e3);
    }
  };

  // Prevent Memory Leak
  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <Layout title="帳本明細" fid={Func.C002} goBackFunc={() => history.push('/C00200')}>
      <PageWrapper>
        <InformationTape
          className="announcement"
          noShadow
          topLeft={(
            <Box display="flex">
              <HomeIcon />
              <Box ml={1} component="span">
                {!notify && !isInit ? '主揪尚未設定公告' : notify}
              </Box>
            </Box>
          )}
          topRight={(
            <Box
              display={viewModel?.owner ? 'flex' : 'none'}
              onClick={onAnnouncementClick}
            >
              <EditIcon />
            </Box>
          )}
        />
        <CreditCard
          cardName={viewModel.ledgerName}
          onMoreClicked={onCardMoreClick}
          annotation={(
            <Box display="flex" onClick={onCardMemberClick}>
              <Box mr={1}>
                <PersonalIcon />
              </Box>
              <Box>
                <ArrowNextIcon />
              </Box>
            </Box>
          )}
          balance={parseInt(viewModel.ledgerAmount?.replace(/,/g, ''), 10)}
          color={
            Object.keys(theme.colors.card)[viewModel.ledgerColor]
            || Object.keys(theme.colors.card)[0]
          }
          fixHeight
        />
        <Box
          display="flex"
          justifyContent={viewModel.owner ? 'space-between' : 'center'}
          my={1}
        >
          {panelContent.map((item, index) => (
            <Box
              key={item.id}
              width="49%"
              display={!viewModel.owner && index === 0 ? 'none' : 'block'}
            >
              <FEIBButton onClick={item.onClick}>{item.label}</FEIBButton>
            </Box>
          ))}
        </Box>
        <AccountDetailsWrapper>
          <div
            className="transactionDetail"
            style={{ overflowY: 'scroll' }}
            onScroll={(e) => onDetailScroll(e)}
          >
            {transactionList.map((item) => (
              <Box
                key={item.ledgerTxId}
                onClickCapture={(e) => onDetailClick(e, item)}
              >
                <DetailCard
                  amount={Math.abs(item.txnAmount)}
                  balance={item.countAmount}
                  description={item.txDesc}
                  txnDate={item.txDate}
                  cdType={item.txnAmount < 0 && 'c'}
                  memo={
                    item.bankeeMember.memberNickName !== ''
                      ? item.bankeeMember.memberNickName
                      : item.bankAccount
                  }
                  currency={item.txCurrency}
                />
              </Box>
            ))}
            {isLoading && <Loading isCentered space="both" />}
          </div>
        </AccountDetailsWrapper>
      </PageWrapper>
    </Layout>
  );
};
