import { useEffect, useState } from 'react';
import { useCheckLocation, usePageInfo } from 'hooks';
import { getTabs } from 'apis/qAndAApi';

/* Elements */
import {
  FEIBTabContext,
  FEIBTabList,
  FEIBTab,
  FEIBTabPanel,
} from 'components/elements';
import Accordion from 'components/Accordion';
/* Styles */
import QandAWrapper from './QandA.style';

const QandA = () => {
  const [tabs, setTabs] = useState([]);
  const [tabValue, setTabValue] = useState('0');
  const [qAcontent, setQAcontent] = useState([]);

  const getQAContent = async (key) => {
    const { initData } = await getTabs('/api/qAndA');
    const result = initData.tabContent
      .find((item) => item.key === Number(key))
      .contentList;
    setQAcontent(result);
  };

  const handleTabChange = (event, type) => {
    setTabValue(type);
    getQAContent(type);
  };

  const renderTabs = () => (
    <FEIBTabList onChange={handleTabChange}>
      {
        tabs.map((item) => (
          <FEIBTab key={item.key} label={item.tabLabel} value={item.key.toString()} />
        ))
      }
    </FEIBTabList>
  );

  const renderQAContent = () => (
    qAcontent.map((item) => (
      <Accordion title={item.label} key={item.key} space="bottom" open={Number(item.key) === 0}>
        {item.content}
      </Accordion>
    ))
  );

  useCheckLocation();
  usePageInfo('/api/qAndA');

  useEffect(async () => {
    // 取得 tabs
    const response = await getTabs('/api/qAndA');
    setTabs(response.initData.tabs);
    getQAContent(0);
  }, []);

  return (
    <QandAWrapper>
      <FEIBTabContext value={tabValue}>
        { renderTabs() }
        {
          tabs.map((item) => (
            <FEIBTabPanel key={item.key} value={item.key.toString()}>
              { renderQAContent() }
            </FEIBTabPanel>
          ))
        }
      </FEIBTabContext>
    </QandAWrapper>
  );
};

export default QandA;