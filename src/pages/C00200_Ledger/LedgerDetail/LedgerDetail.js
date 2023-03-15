import { useState, useRef, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useForm } from 'react-hook-form';
import { useTheme } from 'styled-components';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box } from '@material-ui/core';
import Layout from 'components/Layout/Layout';
import DetailCard from 'components/DetailCard';
import { FEIBButton } from 'components/elements';
import CreditCard from 'components/CreditCard';
import InformationTape from 'components/InformationTape';
import AccountDetailsWrapper from 'components/AccountDetails/accountDetails.style';
import { TextareaField } from 'components/Fields';
import {
  PersonalIcon,
  ArrowNextIcon,
  EditIcon,
  HomeIcon,
} from 'assets/images/icons';
import { customPopup, showError } from 'utilities/MessageModal';
import Loading from 'components/Loading';
// import { getLedgerTxn } from './constants/mockData';
import { getLedgerTxn, openLedger } from './api';
import { validationSchema } from './constants/validationSchema';
import PageWrapper from './LedgerDetail.style';

export default () => {
  const location = useLocation();
  const history = useHistory();
  const timer = useRef();
  const theme = useTheme();
  // 狀態設定
  const { state } = location;
  const [cardInfo, setCardInfo] = useState(state || {});
  const [transactionList, setTransactionList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 畫面初始化
  const init = async () => {
    // 進入頁面時先判斷是否帶入 state -> 若無則返回上一頁
    if (!state) {
      showError('未取得LedgerId', () => history.goBack());
      return null;
    }
    setIsLoading(true);
    await openLedger({ ledgerId: state.ledgerId });
    const res = await getLedgerTxn({ sync: false });
    setIsLoading(false);
    const { txnList = [] } = res;
    setCardInfo((p) => ({ ...p, ledgerAmount: txnList[0]?.countAmount }));
    setTransactionList(txnList);
    return null;
  };

  useEffect(() => {
    init();
  }, []);

  const panelContent = [
    {
      id: 1,
      label: '給錢',
      onClick: () => {
        console.log('給錢');
        history.push('/transferSetting');
      },
    },
    {
      id: 2,
      label: '要錢',
      onClick: () => {
        console.log('要錢');
        history.push('/InvoiceSending');
      },
    },
  ];
  // 表單 - 編輯公告訊息
  const { control, handleSubmit } = useForm({
    defaultValues: { notice: '訊息公告' },
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });
  // 點擊 - 編輯公告訊息
  const onAnnouncementClick = () => {
    customPopup(
      '編輯公告訊息',
      <TextareaField
        control={control}
        name="notice"
        rowsMin={3}
        rowsMax={6}
        limit={30}
      />,
      handleSubmit(({ notice }) => {
        console.log('API REQUEST', notice);
      }),
    );
  };
  // 點擊 - 帳本管理
  const onCardMoreClick = () => {
    console.log('帳本管理');
    history.push('/LedgerManagement');
  };
  // 點擊 - 查看成員
  const onCardMemberClick = () => {
    console.log('查看成員');
    history.push('/MemberManagement');
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
    <Layout title="帳本明細" goBackFunc={() => history.goBack()}>
      <PageWrapper>
        <InformationTape
          className="announcement"
          noShadow
          topLeft={(
            <Box display="flex">
              <HomeIcon />
              <Box ml={1} component="span">
                公告訊息
              </Box>
            </Box>
          )}
          topRight={(
            <Box display="flex" onClick={onAnnouncementClick}>
              <EditIcon />
            </Box>
          )}
        />
        <CreditCard
          cardName={cardInfo.ledgerName}
          onMoreClicked={onCardMoreClick}
          annotation={(
            <Box display="flex" onClick={onCardMemberClick}>
              <Box>
                <PersonalIcon />
              </Box>
              <Box ml={1}>
                <ArrowNextIcon />
              </Box>
            </Box>
          )}
          balance={parseInt(cardInfo.ledgerAmount?.replace(/,/g, ''), 10)}
          color={
            Object.keys(theme.colors.card)[cardInfo.ledgerColor]
            || Object.keys(theme.colors.card)[0]
          }
        />
        <Box
          display="flex"
          justifyContent={cardInfo.isOwner ? 'space-between' : 'center'}
          my={1}
        >
          {panelContent.map((item, index) => (
            <Box
              key={item.id}
              width="49%"
              display={!cardInfo.isOwner && index === 0 ? 'none' : 'block'}
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
