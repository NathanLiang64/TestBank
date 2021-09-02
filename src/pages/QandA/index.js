/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useCheckLocation, usePageInfo } from 'hooks';
import { qAndAApi } from 'apis';

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
    console.log(key);
    // const { initData } = await getTabs('/api/qAndA');
    // const result = initData.tabContent
    //   .find((item) => item.key === Number(key))
    //   .contentList;
    // setQAcontent(result);
  };

  const getQATab = async () => {
    const tabResponse = await qAndAApi.getQACategory({});
    console.log(tabResponse);
  };

  const handleTabChange = (event, type) => {
    setTabValue(type);
    getQAContent(type);
  };

  const renderTabs = () => (
    <FEIBTabList onChange={handleTabChange} $size="small" $type="fixed">
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
    getQATab();
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
