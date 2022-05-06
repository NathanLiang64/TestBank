import { CircularProgress } from '@material-ui/core';
import LoadingWrapper from './loading.style';

const Loading = ({
  space,
  color,
  isFullscreen,
  isCentered,
}) => (
  <LoadingWrapper
    $space={space}
    $color={color}
    $isFullscreen={isFullscreen}
    $isCentered={isCentered}
  >
    <CircularProgress color="inherit" />
  </LoadingWrapper>
);

export default Loading;
