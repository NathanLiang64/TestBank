/* eslint-disable no-unused-vars */
import { callAPI } from 'utilities/axios';

// 要錢卡/邀請卡 mock data
const data = {
  imageId: 5, // number, 1 ~ 5
  ledgerName: '這裡填入帳本名稱',
  sendMemberId: 'uuidSendMember',
  sendMemberName: '發出人',
  receiveMemberId: 'uuidReceiveMember',
  receiveMemberName: '接收人',
  amount: 12000,
  type: '2',
  memo: '要錢說明欄',
};

/**
 * 取得要錢卡相關資料
 * @param {{
 * sendid: string
 * receiveid: string
 * txid: string
 * isOwner: boolean
 * isSelf: boolean
 * }} param param
 * @returns {{
 * imageId: number
 * ledgerName: string
 * sendMemberId: string
 * sendMemberName: string
 * receiveMemberId: string
 * receiveMemberName: string
 * amount: number
 * type: string
 * memo: string
 * transInbank: string
 * transInaccount: string
 * }}
 */
export const cardMsg = async (param) => {
  console.log('cardMsg', param);
  // const response = await callAPI('ledger/cardMsg', param); // TODO api connect
  const response = {
    code: '0000',
    data,
  };

  return response.data;
};

/**
 * 取得邀請卡資訊
 * @param {{inviteToken: string}} param inviteToken
 * @returns {
 * ledgerName: string
 * sendMemberName: string
 * }
 */
export const getLedger = (param) => {
  console.log('getLedger', param);

  const response = {
    code: '0000',
    data: {
      ledgerOwner: {
        memberNickName: 'ownerName',
      },
      ledgerName: 'ledgerName',
    },
  };

  return {
    sendMemberName: response.data.ledgerOwner,
    ledgerName: response.data.ledgerName,
  };
};
