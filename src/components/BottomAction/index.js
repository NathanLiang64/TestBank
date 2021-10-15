import BottomActionWrapper from './bottomAction.style';

const BottomAction = ({ className, children, position }) => (
  <BottomActionWrapper className={className} $bottomPosition={position}>
    {children}
  </BottomActionWrapper>
);

export default BottomAction;
