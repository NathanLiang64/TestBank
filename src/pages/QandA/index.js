import { useCheckLocation, usePageInfo } from 'hooks';

/* Styles */
import QandAWrapper from './QandA.style';

const QandA = () => {
  useCheckLocation();
  usePageInfo('/api/qAndA');

  return (
    <QandAWrapper>
      123
    </QandAWrapper>
  );
};

export default QandA;
