import { callAPI } from 'utilities/axios';

/**
 * 取得帳本收款管理交易清單
 * @param {{type: number}} type 表 Owner/Partner 請/收/付 款管理 -- 1: Owner 請款管理 | 2: Owner 收款管理 | 3: Partner 付款管理 | 4: Partner 請款管理
 * @returns {{
 * invoiceDate: string
 * owner: string
 * invoiceAmount: string
 * property: string
 * memo: string
 * ledgerTxId: string
 * ledgerName: string
 * bank: string
 * account: string
 * sendId: string
 * receiveid: string
 * isOwner: boolean
 * isSelf: boolean
* }[]}
 */
export const getInvoice = async (type) => {
  let response;

  switch (type) {
    case 1: // Owner 請款管理
      response = await callAPI('/ledger/owner/getPayoutList');
      break;
    case 2: // Owner 收款管理
      response = await callAPI('/ledger/owner/getChargeList');
      break;
    case 3: // Partner 付款管理
      response = await callAPI('/ledger/partner/getPaidList', {selfOnly: true});
      break;
    case 4: // Partner 請款管理
      response = await callAPI('/ledger/partner/getChargeList');
      break;
    default:
      break;
  }

  /* 轉換為頁面資料 */
  const pageModel = response.map((res) => ({
    invoiceDate: res.txDate,
    owner: res.memberNickName,
    invoiceAmount: res.txnAmount,
    property: res.txUsage,
    memo: res.txDesc,
    ledgerTxId: res.ledgerTxId,
    ledgerName: res.ledgerName, // TODO 確認回傳中是否有這一項？
    bank: res.bankCode,
    account: res.bankAccount,
    sendId: res.accountTxId, // TODO 確認是否是這一項
    receiveid: res.bankeeMember.memberId,
    isOwner: res.owner,
    isSelf: res.accountTxId === res.bankeeMember.memberId,
  }));
  return pageModel;
};

/**
 * 帳本Owner 取消對 Partner 的收款請求
 * @param {{chargeId: string}} param /owner/getChargeList 的 ledgerTxId
 * @returns {{boolean}}
 */
export const ownerCancelCharge = async (param) => {
  const response = await callAPI('/ledger/owner/cancelCharge', param);
  return response.data;
};

/**
 * 帳本Owner 取消對 Partner 的收款請求
 * @param {{chargeId: string}} param /partner/getChargeList 的 ledgerTxId
 * @returns {{boolean}}
 */
export const partnerCancelCharge = async (param) => {
  const response = await callAPI('/ledger/partner/cancelCharge', param);
  return response.data;
};
