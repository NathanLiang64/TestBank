import { callAPI } from 'utilities/axios';
import { loadLocalData } from 'utilities/Generator';

/**
 * 取得所有分行清單。
 * @returns {*} [{
     branchNo: 分行代碼,
     branchCode: 分行轉帳代碼,
     branchName: 分行名稱,
   }, ...]
 */
export const getBranchCode = async () => {
  const branches = loadLocalData('BranchList', async () => {
    const response = await callAPI('/api/v1/getAllBranches');
    return response.data;
  });
  return branches;
};
