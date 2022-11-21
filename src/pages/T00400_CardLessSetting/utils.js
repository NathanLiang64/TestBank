import { showError } from 'utilities/MessageModal';

export const checkQLStatus = async (status) => {
  switch (status) {
    case '0':
      await showError('裝置未綁定');
      return false;
    case '3':
      await showError('已在其它裝置綁定');
      return false;
    case '4':
      await showError('本裝置已綁定其他帳號');
      return false;
    default:
      return true;
  }
};
