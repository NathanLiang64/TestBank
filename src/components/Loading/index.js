import { CircularProgress } from '@material-ui/core';
import LoadingWrapper from './loading.style';

const Loading = ({ space, color }) => (
  <LoadingWrapper $space={space} $color={color}>
    <CircularProgress color="inherit" />
  </LoadingWrapper>
);

export default Loading;
