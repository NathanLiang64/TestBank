import BottomActionWrapper from './bottomAction.style';

const BottomAction = ({ className, children }) => (
  <BottomActionWrapper className={className}>
    {children}
  </BottomActionWrapper>
);

export default BottomAction;
