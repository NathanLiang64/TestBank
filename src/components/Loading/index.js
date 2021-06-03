import { CircularProgress } from '@material-ui/core';
import LoadingWrapper from './loading.style';

const Loading = ({ space }) => (
  <LoadingWrapper
    $space={space}
  >
    <CircularProgress color="inherit" />
  </LoadingWrapper>
);

export default Loading;
