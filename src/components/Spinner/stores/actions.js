import * as types from './types';

export const setShowSpinner = (boolean) => ({
  type: types.SET_SHOW_SPINNER,
  payload: boolean,
});
