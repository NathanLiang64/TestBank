import { useHistory } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';

/* Elements */
import Header from 'components/Header';
import { FEIBButton, FEIBRadioLabel, FEIBRadio } from 'components/elements';
import Accordion from 'components/Accordion';
import InstallmentTerms from './installmentTerms';
import AccordionContent from './accordionContent';

/* Styles */
import InstalmentWrapper from './instalment.style';

const Instalment2 = () => {
  const stagingPercentage = '6%';

  useCheckLocation();
  usePageInfo('/api/instalment');
  const history = useHistory();

  const renderSelectList = () => {
    const list = ['1 期', '3 期', '6 期', '9 期', '12 期'];
    return (
      <div className="selectList">
        <div>
          選擇晚點付期數
        </div>
        { list.map((item, index) => (
          <p>
            <FEIBRadioLabel value={index} control={<FEIBRadio />} label={item} />
          </p>
        )) }
      </div>
    );
  };

  return (
    <>
      <Header title="晚點付 (總額)" goBack={() => history.replace('/staging1')} />
      <InstalmentWrapper className="InstalmentWrapper" small>
        <form>
          <div>
            <div className="messageBox2">
              <p style={{ width: '100%', textAlign: 'center' }}>
                分期利率
              </p>
              <h2 className="titleText">{ stagingPercentage }</h2>
            </div>
            {renderSelectList()}
            <Accordion title="晚點付約定條款" space="both">
              <InstallmentTerms />
            </Accordion>
            <Accordion space="both">
              <AccordionContent />
            </Accordion>
          </div>
          <FEIBButton
            onClick={() => {
              history.push('/staging3');
            }}
          >
            同意條款並繼續
          </FEIBButton>
        </form>
      </InstalmentWrapper>
    </>
  );
};

export default Instalment2;
