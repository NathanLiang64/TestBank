export const state = {
  accountTxId: null,
  bankAccount: '0004300499008956', //
  bankCode: '805', //
  bankeeMember: {
    memberNickName: 'AAA', //
  },
  countAmount: '49,187',
  editable: true,
  ledgerTxId: '44177', //
  owner: true,
  paymentstatus: 0,
  txDate: '2022-02-22',
  txDesc: '尚未編輯',
  txStatus: 1, // 0: 不明, 1: 已入帳, 2: 未入帳
  txUsage: '1',
  type: 0,
  txUsageName: null,
  txnAmount: '800',
};

export const mockWriteOffListRt = {
  ledgertx: [
    {
      ledgerTxId: '000',
      txDate: '20220222',
      txAmount: '800',
      txUsage: '1',
      txUsageName: '食',
      bankCode: '812',
      bankAccount: '0000888899980001',
      txDesc: '車票',
      editable: true,
      txStatus: 2, // 0: 不明, 1: 已入帳, 2: 未入帳
      owner: true,
      type: '123',
      bankeeMember: {
        memberNickName: 'AAA',
      },
    },
    {
      ledgerTxId: '001',
      txDate: '20220222',
      txAmount: '800',
      txUsage: '3',
      txUsageName: '住',
      bankCode: '812',
      bankAccount: '0000888899980002',
      txDesc: '車票',
      editable: true,
      txStatus: 2, // 0: 不明, 1: 已入帳, 2: 未入帳
      owner: true,
      type: '123',
      bankeeMember: {
        memberNickName: 'BBB',
      },
    },
  ],
}; // DEBUG mock data
