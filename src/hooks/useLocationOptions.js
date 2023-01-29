import { useEffect, useState, useMemo } from 'react';
import { callAPI } from 'utilities/axios';

// NOTE ========== 已棄用，暫時保留待刪除 ==========
export const useLocationOptions = (watchedCountyName) => {
  const [locationLists, setLocationLists] = useState([]);

  /**
   * 縣市鄉鎮資料
   * @returns {[{
   *   countyName: String, // 縣市名稱
   *   countyCode: String, // 縣市代碼
   *   cities: [{
   *     cityName: String, // 鄉鎮名稱
   *     cityCode: String, // 鄉鎮代碼
   *   }], // 鄉鎮市清單
   * }]
   * }
   */
  const getCountyList = async () => {
    const response = await callAPI('/common/queryCounty');
    return response.data;
  };

  // 縣市選單
  const countyOptions = useMemo(() => {
    if (locationLists.length) {
      return locationLists.map(({ countyName }) => ({
        label: countyName,
        value: countyName,
      }));
    }
    return [];
  }, [locationLists]);

  // 鄉鎮市區選單
  const districtOptions = useMemo(() => {
    const foundDistrictOption = locationLists.find(
      ({ countyName }) => countyName === watchedCountyName,
    );
    if (foundDistrictOption) {
      return foundDistrictOption.cities.map(({ cityName }) => ({
        label: cityName,
        value: cityName,
      }));
    }
    return [];
  }, [watchedCountyName, locationLists]);

  useEffect(async () => {
    const countyListRes = await getCountyList();
    if (countyListRes) setLocationLists(countyListRes);
  }, []);

  return {
    countyOptions,
    districtOptions,
  };
};
