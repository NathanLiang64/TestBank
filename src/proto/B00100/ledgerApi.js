/* eslint-disable no-unused-vars */
import { callAPI } from 'utilities/axios';

/**
 * 社群帳本API測試
 */
export const ledgerApiTest = async () => {
  // let uuidtoken = sessionStorage.getItem('ledger_uuidtoken');
  // if (!uuidtoken) {
  //   // *** 一定要執行 ***
  //   const getKeyRs = await callAPI('/ledger/getKey', { // 不能重複取值！
  //     data: {
  //       uuidtoken: null,
  //       key: sessionStorage.getItem('publicKey'),
  //       type: 2, // 裝置類型(1.Web, 2.iOS, 3.Android, 0.Unknown)
  //     },
  //   });
  //   uuidtoken = getKeyRs.data.uuidtoken;
  //   sessionStorage.setItem('ledger_uuidtoken', uuidtoken);

  // *** 一定要執行 ***
  // Bankee會員在登入後，進入帳本的登入
  const bankeeLoginRs = await callAPI('/ledger/login');

  // // 登入（訪客？）
  // const response = await callAPI('/ledger/memberLogin', {
  //   data: {
  //     token: uuidtoken,
  //     deviceName: 'SM-S9060',
  //     osVersion: 'Android|13|1.0.15',
  //     push: '',
  //     mudid: '',
  //   },
  // }).data;
  // }

  // // 帳本首頁
  // const initListRs = await callAPI('/ledger/getListItems');

  // // 我的帳本清單(可取得 ledgerId)
  // const getLedgerList = await callAPI('/ledger/getLedgerList');

  // // 確認是否可再新增帳本
  // const checkAdd = await callAPI('/ledger/checkAdd');

  // // 取得可連結帳號清單、使用條款與加開子帳號權限
  // const accountList = await callAPI('/ledger/accountList', { filterbind: true });

  // // 我的帳本清單
  // const openLedger = await callAPI('/ledger/openLedger', { ledgerId: '453' });

  // // 修改帳本名稱(Owner才有效)
  // const setLedgerName = await callAPI('/ledger/setLedgerName', { name: 'A177-ID453' });

  // // 變更在帳本中所使用的暱稱。
  // const setNickname = await callAPI('/ledger/setNickname', { name: 'ID923' });

  // // 修改公告內容
  // const setAnnouncement = await callAPI('/ledger/setAnnouncement', { message: 'A177-Announcement' });

  // // 取得帳本交易明細清單
  // const getLedgerTxn = await callAPI('/ledger/getLedgerTxn', { sync: true });
};
