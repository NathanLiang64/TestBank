export const checkQLStatus = (statusCode) => {
  switch (statusCode) {
    case '0':
      return '無裝置綁定，請先進行裝置綁定設定或致電客服';
    case '3':
      return '該帳號已在其它裝置綁定';
    case '4':
      return '本裝置已綁定其他帳號';
    default:
      return null;
  }
};
