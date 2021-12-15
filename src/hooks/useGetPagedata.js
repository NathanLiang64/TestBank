import { useEffect } from 'react';
import { getPagedata } from '../utilities/BankeePlus';

const useGetPagedata = () => useEffect(() => getPagedata(), []);

export default useGetPagedata;
