import { bonusInfo, transferConfirm } from './mockData';

export const getBonusInfo = () => {
  console.log('api /getBonusInfo', {bonusInfo});
  return bonusInfo;
};

export const transfer = (data) => {
  console.log('api /transfer', {data});
  return transferConfirm;
};
