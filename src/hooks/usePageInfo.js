import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { headerApi } from 'apis';
import { setTitle } from 'components/Header/stores/actions';

const usePageInfo = (apiUrl) => {
  const dispatch = useDispatch();
  const { doGetPageInfo } = headerApi;
  useEffect(async () => {
    const response = await doGetPageInfo(apiUrl);
    dispatch(setTitle(response.title));
  }, []);
};

export default usePageInfo;
