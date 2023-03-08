import { useState, useRef } from 'react';
import { useHistory } from 'react-router';
import { useForm } from 'react-hook-form';
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
import { customPopup } from 'utilities/MessageModal';
import { addDetailCard, MAIN_CARD_CONFIG } from './constants/mockData';
import { validationSchema } from './constants/validationSchema';
import PageWrapper from './LedgerDetail.style';

export default () => {
  const history = useHistory();
  const timer = useRef();
  const [transactionList, setTransactionList] = useState(addDetailCard(20));
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
  const onDetailClick = (e) => {
    e.stopPropagation();
    console.log('查看明細');
    history.push('/RecordDetail');
  };
  // 滾動 - 明細清單 -> 滾動至視圖底部時 呼叫API新增明細
  const onDetailScroll = (e) => {
    const { clientHeight, scrollHeight, scrollTop } = e.target;
    const isBottom = scrollTop + clientHeight + 60 > scrollHeight;
    if (isBottom) {
      // debounce: 去抖動
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        setTransactionList((p) => [...p, ...addDetailCard(20)]);
      }, 300);
    }
  };

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
          cardName={MAIN_CARD_CONFIG.name}
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
          balance={MAIN_CARD_CONFIG.balance}
        />
        <Box display="flex" justifyContent="space-between" my={1}>
          {panelContent.map((item) => (
            <Box key={item.id} width="49%">
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
              <Box key={item.id} onClickCapture={(e) => onDetailClick(e)}>
                <DetailCard
                  amount={item.amount}
                  balance={item.balance}
                  description={item.description}
                  txnDate={item.txnDate}
                  cdType={item.cdType}
                  memo={item.memo}
                  currency="NTD"
                />
              </Box>
            ))}
          </div>
        </AccountDetailsWrapper>
      </PageWrapper>
    </Layout>
  );
};
