import { useEffect, useState } from 'react';
import parse from 'html-react-parser';
// import { qAndAApi } from 'apis';
import { getQACategory, getQASubCategory } from 'pages/S00600_QandA/api';

/* Elements */
import {
  FEIBTabContext,
  FEIBTabList,
  FEIBTab,
} from 'components/elements';
import Accordion from 'components/Accordion';
import Layout from 'components/Layout/Layout';

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
    const { code, data } = await getQASubCategory(param);
    // eslint-disable-next-line no-console
    if (code === '0000') {
      console.log('取得 QA 內容回傳', data);
      setQAcontent(data);
    }
    setShow(true);
  };

  const getQATab = async () => {
    const { code, data } = await getQACategory({});
    // eslint-disable-next-line no-console
    if (code === '0000') {
      console.log('取得 QA 分類回傳', data);
      setTabs(data);
      setTabValue(data[0]);
    }
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
        { parse(item.answer.replace(/\u2028/gi, '')) }
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

  useEffect(() => {
    getQATab();
  }, []);

  useEffect(() => {
    getQAContent(tabValue);
  }, [tabValue]);

  return (
    <Layout title="常見問題">
      <QandAWrapper>
        <FEIBTabContext value={tabValue}>
          { renderTabs() }
          <div style={{ visibility: show ? 'visible' : 'hidden' }}>
            { renderQAContent() }
          </div>
        </FEIBTabContext>
      </QandAWrapper>
    </Layout>
  );
};

export default QandA;
