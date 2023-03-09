/* eslint-disable no-unused-vars */
import { useEffect } from 'react';

import Layout from 'components/Layout/Layout';
import { FEIBBorderButton } from 'components/elements';
import InvitationCard from '../InvitationCard/InvitationCard';
import PageWrapper from './InvitationContainer.style';

const InvitationContainer = () => {
  console.log('InvitationContainer');
  // 要錢卡 mock data
  const data = {
    cardType: 'INVITE',
    ledgerName: '帳本名稱',
    requester: '發起要錢',
    target: '被要錢',
    amount: '1200',
    type: '2',
    memo: '要錢說明欄',
  };

  const onClick = () => {
    console.log('onClick');
  };
  useEffect(() => {
  }, []);
  return (
    <Layout title={data.cardType === 'REQUEST' ? '你的成員來要錢嚕' : '加入帳本'} goBackFunc={() => {}}>
      <PageWrapper>
        <InvitationCard data={data} />
        {data.cardType === 'REQUEST' ? <FEIBBorderButton>立即轉帳</FEIBBorderButton> : <FEIBBorderButton>加入帳本</FEIBBorderButton>}
      </PageWrapper>
    </Layout>
  );
};

export default InvitationContainer;
