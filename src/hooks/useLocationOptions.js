import { useEffect, useState, useMemo } from 'react';
import { getCountyList } from 'pages/T00700_BasicInformation/api';

export const useLocationOptions = (watchedCountyName) => {
  const [locationLists, setLocationLists] = useState([]);

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
    setLocationLists(countyListRes);
  }, []);

  return {
    countyOptions,
    districtOptions,
  };
};
