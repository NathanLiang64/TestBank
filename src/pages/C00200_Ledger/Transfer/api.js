import { transferConfirm } from './mockData';

export const preTransfer = (param) => {
  console.log('api /preTransfer', {param});
  const response = '';

  return response; // DEBUG mock data
};

export const transfer = (data) => {
  console.log('api /transfer', {data});
  return transferConfirm; // DEBUG mock data
};
