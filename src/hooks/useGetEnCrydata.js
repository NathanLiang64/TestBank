import { useEffect } from 'react';
import { getEnCrydata } from '../utilities/BankeePlus';

const useGetEnCrydata = () => useEffect(() => getEnCrydata(), []);

export default useGetEnCrydata;
