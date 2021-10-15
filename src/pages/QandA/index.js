import { useEffect, useState } from 'react';
import { useCheckLocation, usePageInfo } from 'hooks';
import parse from 'html-react-parser';
import { qAndAApi } from 'apis';

/* Elements */
import {
  FEIBTabContext,
  FEIBTabList,
  FEIBTab,
} from 'components/elements';
import Accordion from 'components/Accordion';
/* Styles */
import QandAWrapper from './QandA.style';

const QandA = () => {
  const [show, setShow] = useState(false);
  const [tabs, setTabs] = useState([]);
  const [tabValue, setTabValue] = useState('會員申請');
  const [qAcontent, setQAcontent] = useState([{
    title: '--',
    subItems: [
      {
        question: '--',
        answer: '--',
      },
    ],
  }]);

  const getQAContent = async (cat) => {
    const param = { cat };
    const qaContentResponse = await qAndAApi.getQASubCategory(param);
    // eslint-disable-next-line no-console
    console.log('取得 QA 內容回傳', qaContentResponse);
    setQAcontent(qaContentResponse);
    setShow(true);
  };

  const getQATab = async () => {
    const tabResponse = await qAndAApi.getQACategory({});
    // eslint-disable-next-line no-console
    console.log('取得 QA 分類回傳', tabResponse);
    setTabs(tabResponse);
    setTabValue(tabResponse[0]);
  };

  const handleTabChange = (event, type) => {
    if (type !== tabValue) {
      setTabValue(type);
    }
  };

  const renderTabs = () => (
    <FEIBTabList onChange={handleTabChange} $size="small" $type="fixed">
      {
        tabs.map((item) => (
          <FEIBTab key={item} label={item} value={item} />
        ))
      }
    </FEIBTabList>
  );

  const renderAccordion = (subItems) => (
    subItems.map((item) => (
      <Accordion title={item.question} key={item.question} className="customAccordion">
        { parse(item.answer) }
      </Accordion>
    ))
  );

  const renderQAContent = () => (
    qAcontent.map((item) => (
      <div key={item.title}>
        <div className="subTitle">
          { item.title }
        </div>
        { renderAccordion(item.subItems) }
      </div>
    ))
  );

  useCheckLocation();
  usePageInfo('/api/qAndA');

  useEffect(() => {
    getQATab();
  }, []);

  useEffect(() => {
    getQAContent(tabValue);
  }, [tabValue]);

  return (
    <QandAWrapper>
      <FEIBTabContext value={tabValue}>
        { renderTabs() }
        <div style={{ visibility: show ? 'visible' : 'hidden' }}>
          { renderQAContent() }
        </div>
      </FEIBTabContext>
    </QandAWrapper>
  );
};

export default QandA;
