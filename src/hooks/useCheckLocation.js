import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setIsHomePage } from 'components/Header/stores/actions';

const useCheckLocation = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const checkCurrentLocation = (path) => {
    if (path === '/') {
      dispatch(setIsHomePage(true));
    } else {
      dispatch(setIsHomePage(false));
    }
    if (path === '/regularPwdModify') {
      // if (state) {
      dispatch(setIsHomePage(true));
      // }
    }
  };
  useEffect(() => checkCurrentLocation(pathname), []);
};

export default useCheckLocation;
