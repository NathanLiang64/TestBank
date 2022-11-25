import { callAPI } from 'utilities/axios';

// 取得使用者暱稱 done
export const getNickName = async (param) => {
  const response = await callAPI('/api/setting/member/getInfo', param);
  return response;
};

// 更新使用者暱稱 done
export const updateNickName = async (param) => {
  const response = await callAPI('/api/setting/member/updateInfo', param);
  return response.data;
};

/**
 * 更新大頭貼
 * @param {String} newImg 新的大頭貼影像，內容為 Base64 字串。
 * @returns
 */
export const uploadAvatar = async (newImg) => {
  const response = await callAPI('/api/community/v1/uploadAvatar', newImg);
  return response.data;
};
