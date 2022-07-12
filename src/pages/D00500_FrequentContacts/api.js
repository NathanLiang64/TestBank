import { addFavAccount, updateFavAccount, removeFavAccount } from 'apis/transferApi';

/**
   * 呼叫 API 新增登記帳戶
   */
const handleAdd = async (card) => {
  const params = {
    inBank: card?.bankId,
    inAcct: card?.accountId,
    nickName: card?.accountName,
  };
  try {
    await addFavAccount(params);
    return true;
  } catch (error) {
    // TODO: You may want to remove below line in production.
    console.warn('Error returned from updateFavAccount', error);
    return false;
  }
};

/**
   * 呼叫 API 更新帳戶資訊
   */
const handleEdit = async (card) => {
  const params = {
    email: card?.email,
    inBank: card?.bankId,
    inAcct: card?.accountId,
    nickName: card?.accountName,
    orgBankId: card?.bankId,
    orgAcctId: card?.accountId,
  };
  try {
    await updateFavAccount(params);
    return true;
  } catch (error) {
    // TODO: You may want to remove below line in production.
    console.warn('Error returned from updateFavAccount', error);
    return false;
  }
};

/**
   * 呼叫 API 移除登記帳戶
   */
const handleRemove = async (card) => {
  const params = {
    email: card?.email,
    inBank: card?.bankId,
    inAcct: card?.accountId,
    nickName: card?.accountName,
  };
  try {
    await removeFavAccount(params);
    return true;
  } catch (error) {
    // TODO: You may want to remove below line in production.
    console.warn('Error returned from removeFavAccount', error);
    return false;
  }
};

export { handleAdd, handleEdit, handleRemove };
