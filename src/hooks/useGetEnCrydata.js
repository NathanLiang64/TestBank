import { useEffect } from 'react';
import { getEnCrydata, switchLoading } from '../utilities/BankeePlus';

const useGetEnCrydata = () => useEffect(() => {
  switchLoading(true);
  getEnCrydata();
}, []);

export default useGetEnCrydata;
