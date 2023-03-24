import { bonusInfo, transferConfirm } from './mockData';

export const getBonusInfo = () => {
  console.log('api /getBonusInfo', {bonusInfo});
  return bonusInfo;
};

export const preTransfer = (param) => {
  console.log('api /preTransfer', {param});
  const response = '';

  return response;
};

export const transfer = (data) => {
  console.log('api /transfer', {data});
  return transferConfirm;
};
