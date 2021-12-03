import { useCheckLocation, usePageInfo } from 'hooks';

/* Styles */
import InstalmentWrapper from './instalment.style';

const Instalment = () => {
  const title = 123;

  useCheckLocation();
  usePageInfo('/api/instalment');

  return (
    <InstalmentWrapper>
      { title }
    </InstalmentWrapper>
  );
};

export default Instalment;
