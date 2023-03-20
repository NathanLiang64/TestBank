/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';

import Layout from 'components/Layout/Layout';
import { FEIBBorderButton } from 'components/elements';
import { useHistory } from 'react-router';
import InvitationCard from '../InvitationCard/InvitationCard';
import PageWrapper from './InvitationContainer.style';
import { cardMsg, getLedger } from './api';

/**
 * 要錢卡/邀請卡 容器
 */
const InvitationContainer = (props) => {
  const { location, match } = props;
  const [isInviteCard, setIsInviteCard] = useState();
  const [model, setModel] = useState();
  const history = useHistory();

  const onClick = () => {
    console.log('onClick');
    if (isInviteCard === true) {
      // 跳轉至 JoinSetting
      console.log('to /joinSetting', {param: model.inviteToken});
      history.push('/joinSetting', model.inviteToken);
    } else {
      // TODO 跳轉至 Transfer
      const param = 'transferData';
      console.log('to /transferSetting', {param});
      history.push('/transferSetting', param);
    }
  };

  const handleInvitationType = () => {
    const pathName = location.pathname;

    if (pathName.includes('joinLedger')) {
      return true;
    }
    return false;
  };

  /* 判斷是否為邀請卡，取得頁面資料 */
  useEffect(async () => {
    const isInvite = handleInvitationType(); // 自 "pathname" 判斷是否為邀請卡
    setIsInviteCard(isInvite);
    if (isInvite === true) {
      // 邀情卡：自 path 取得 token
      console.log('邀情卡');
      const inviteToken = match.params.invite_token;
      const response = await getLedger(); // TODO 確認param: ledgerId? inviteToken?
      setModel({inviteToken, ...response});
    } else {
      // 要錢卡
      console.log('要錢卡');
      const response = await cardMsg();
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
