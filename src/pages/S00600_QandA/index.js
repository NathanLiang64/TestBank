import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { getQACategory, getQASubCategory } from 'pages/S00600_QandA/api';

/* Elements */
import Layout from 'components/Layout/Layout';
import {
  FEIBTabContext,
  FEIBTabList,
  FEIBTab,
} from 'components/elements';
import Accordion from 'components/Accordion';

/* Styles */
import QandAWrapper from './QandA.style';

const QandA = () => {
  const dispatch = useDispatch();

  const [tabs, setTabs] = useState();
  const [tabValue, setTabValue] = useState();
  const [categoryData, setCategoryData] = useState();

  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    const categories = await getQACategory();
    setTabs(categories);
    setTabValue(categories[0]);

    dispatch(setWaittingVisible(false));
  }, []);

  useEffect(async () => {
    const data = (tabValue) ? await getQASubCategory({ cat: tabValue }) : null;
    setCategoryData(data);
  }, [tabValue]);

  const QAContent = () => (
    <>
      {categoryData?.map((category) => (
        <div key={category.title}>
          <div className="subTitle">
            { category.title }
          </div>

          <div>
            {category.subItems?.map((subItem) => (
              <Accordion title={subItem.question} key={subItem.question} className="customAccordion">
                { parse(subItem.answer.replace(/\u2028/gi, '')) }
              </Accordion>
            ))}
          </div>
        </div>
      ))}
    </>
  );

  return (
    <Layout title="常見問題">
      <QandAWrapper>
        <FEIBTabContext value={tabValue}>
          <FEIBTabList onChange={(e, type) => setTabValue(type)} $size="small" $type="fixed">
            {tabs?.map((item) => (<FEIBTab key={item} label={item} value={item} />))}
          </FEIBTabList>

          <QAContent />
        </FEIBTabContext>
      </QandAWrapper>
    </Layout>
  );
};

export default QandA;
