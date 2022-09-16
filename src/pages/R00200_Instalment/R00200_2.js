/** @format */

import {useHistory} from 'react-router';
import {useCheckLocation, usePageInfo} from 'hooks';

/* Elements */
import Layout from 'components/Layout/Layout';
import {FEIBButton, FEIBRadioLabel, FEIBRadio} from 'components/elements';
import Accordion from 'components/Accordion';
// TODO: 移除
// import InstallmentTerms from './installmentTerms';
import R00200AccordionContent1 from './R00200_accordionContent_1';
import R00200AccordionContent2 from './R00200_accordionContent_2';

/* Styles */
import InstalmentWrapper from './R00200.style';

const R00200_2 = () => {
  const stagingPercentage = '6%';

  useCheckLocation();
  usePageInfo('/api/instalment');
  const history = useHistory();

  const renderSelectList = () => {
    const list = ['1 期', '3 期', '6 期', '9 期', '12 期'];
    return (
      <div className="selectList">
        <div>選擇晚點付期數</div>
        {list.map((item, index) => (
          <p>
            <FEIBRadioLabel value={index} control={<FEIBRadio />} label={item} />
          </p>
        ))}
      </div>
    );
  };

  return (
    <Layout title="晚點付 (總額)">
      <InstalmentWrapper className="InstalmentWrapper" small>
        <form>
          <div>
            <div className="messageBox2">
              <p style={{width: '100%', textAlign: 'center'}}>分期利率</p>
              <h2 className="titleText">{stagingPercentage}</h2>
            </div>
            {renderSelectList()}
            {/* TODO: 晚點付約定條款 與 注意事項 之內容 */}
            <Accordion title="晚點付約定條款" space="both">
              {/* TODO: 移除 */}
              {/* <InstallmentTerms /> */}
              <R00200AccordionContent1 />
            </Accordion>
            <Accordion space="both">
              <R00200AccordionContent2 />
            </Accordion>
          </div>
          <FEIBButton
            onClick={() => {
              history.push('/R002003');
            }}
          >
            同意條款並繼續
          </FEIBButton>
        </form>
      </InstalmentWrapper>
    </Layout>
  );
};

export default R00200_2;
