const cacheData = {
  banks: null,
  branches: null,
  accounts: null,
  freqAccts: null,
  agreAccts: null,
};

export default function CacheReducer(state = cacheData, action) {
  const { type, data } = action;
  switch (type) {
    case 'setBanks': return { ...state, banks: data };
    case 'setBranches': return { ...state, branches: data };
    case 'setAccounts': return { ...state, accounts: data };
    case 'setFreqAccts': return { ...state, freqAccts: data };
    case 'setAgreAccts': return { ...state, agreAccts: data };

    default:
      return state;
  }
}

export function setBanks(data) { return { type: 'setBanks', data }; }

export function setBranches(data) { return { type: 'setBranches', data }; }

export function setAccounts(data) { return { type: 'setAccounts', data }; }

export function setFreqAccts(data) { return { type: 'setFreqAccts', data }; }

export function setAgreAccts(data) { return { type: 'setAgreAccts', data }; }
