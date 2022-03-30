export const SET_ACCOUNTS = 'set_accounts';
export const SET_SELECTED_ACCOUNT = 'set_selected_account';

/*
  ** Sample Data **
  {
    accounts: [{
      cardInfo: {
        acctBranch: '信義分行',
        acctName: '保時捷車友會',
        acctId: '04300490004059',
        acctType: '004',
        acctBalx: 2000000,
        ccyCd: 'TWD',
      },
      panelInfo: {
        interbankWithdrawal: 3,
        interbankTransfer: 5,
        interest: 3,
        interestRate: 2.6,
        interestRateLimit: '5萬',
      },
      transactions: [...],
    }],
    selectedAccount: '04300490004059',
  }
 */
const initState = {
  accounts: null,
  selectedAccount: null,
};

export const ModelReducer = (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_ACCOUNTS:
      return {
        ...state,
        accounts: payload,
      };
    case SET_SELECTED_ACCOUNT:
      return {
        ...state,
        selectedAccount: payload,
      };
    default:
      return state;
  }
};

export const setAccounts = (value) => ({
  type: SET_ACCOUNTS,
  payload: value,
});

export const setSelectedAccount = (value) => ({
  type: SET_SELECTED_ACCOUNT,
  payload: value,
});

export default ModelReducer;
