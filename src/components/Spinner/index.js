import { useSelector } from 'react-redux';
// import { useSelector, useDispatch } from 'react-redux';
// import { setShowSpinner } from './stores/actions';
import SpinnerWrapper from './spinner.style';

const Spinner = () => {
  const isShow = useSelector(({ spinner }) => spinner.showSpinner);
  // const dispatch = useDispatch();
  // dispatch(setShowSpinner(false));
  return (
    <SpinnerWrapper className={isShow ? 'show' : ''}>
      <div className="loader" />
    </SpinnerWrapper>
  );
};

export default Spinner;
