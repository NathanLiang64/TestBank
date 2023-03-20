import { callAPI } from 'utilities/axios';
import { handleTxUsageText } from '../utils/usgeType';

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
 * }}
 */
export const getInvoice = async (type) => {
  console.log('getInvoice', type);
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
  const pageModel = {
    invoiceDate: response.txDate,
    owner: response.memberNickName,
    invoiceAmount: response.txnAmount,
    property: handleTxUsageText(response.txUsage),
    memo: response.txDesc,
    ledgerTxId: response.ledgerTxId,
  };
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
