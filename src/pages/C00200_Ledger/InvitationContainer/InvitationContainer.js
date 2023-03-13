import { useEffect, useState } from 'react';

import Layout from 'components/Layout/Layout';
import { FEIBBorderButton } from 'components/elements';
import InvitationCard from '../InvitationCard/InvitationCard';
import PageWrapper from './InvitationContainer.style';
import { cardMsg } from './api';

/**
 * 要錢卡/邀請卡 容器
 */
const InvitationContainer = () => {
  const [isInviteCard, setIsInviteCard] = useState();
  const [model, setModel] = useState();

  const onClick = () => {
    console.log('onClick');
    if (isInviteCard === true) {
      // TODO 跳轉至 JoinSetting
      console.log('to /joinSetting');
    } else {
      // TODO 跳轉至 Transfer
      console.log('to /transferSetting');
    }
  };

  /* 判斷是否為邀請卡，取得頁面資料 */
  useEffect(() => {
    const isInvite = true; // TODO 判斷是否為邀請卡
    setIsInviteCard(isInvite);
    if (isInvite === true) {
      // 邀情卡：自deeplink取得data？
      console.log('邀情卡');
      const response = cardMsg();
      setModel(response);
    } else {
      // 要錢卡
      console.log('要錢卡');
      const response = cardMsg();
      setModel(response);
    }
  }, []);
  return (
    model ? (
      <Layout title={isInviteCard === true ? '加入帳本' : '你的成員來要錢嚕'} goBackFunc={() => {}}>
        <PageWrapper>
          <InvitationCard data={{model, isInviteCard}} />
          {isInviteCard ? <FEIBBorderButton onClick={onClick}>加入帳本</FEIBBorderButton> : <FEIBBorderButton onClick={onClick}>立即轉帳</FEIBBorderButton>}
        </PageWrapper>
      </Layout>
    ) : <></>
  );
};

export default InvitationContainer;
