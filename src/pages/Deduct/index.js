import { useHistory } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';

/* Elements */
import {
  FEIBButton,
} from 'components/elements';
import Accordion from 'components/Accordion';

/* Style */
import DeductWrapper from './deduct.style';

import AccordionContent from './accordionContent';

const Deduct = () => {
  const history = useHistory();
  const toDealPage = () => {
    history.push('/deduct1');
  };

  useCheckLocation();
  usePageInfo('/api/deduct');

  return (
    <DeductWrapper>
      <p className="titleLabel">您的已申辦自動扣繳區</p>
      <div className="tableContainer">這邊放表格</div>
      <p className="titleLabel">您的當日申辦自動扣繳區</p>
      <div className="tableContainer">這邊放表格</div>
      <Accordion space="both" open>
        <AccordionContent />
      </Accordion>
      <FEIBButton onClick={toDealPage}>新增</FEIBButton>
    </DeductWrapper>
  );
};

export default Deduct;
