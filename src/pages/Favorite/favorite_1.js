/* eslint-disable */

// 新增我的最愛
import { useEffect, useState } from 'react';
import FavoriteBlockButton from 'components/FavoriteBlockButton';
import { FEIBTab, FEIBTabContext, FEIBTabList } from 'components/elements';
import { getFavoriteList } from 'apis/favoriteApi';
import { iconGenerator } from './favoriteGenerator';

const Favorite1 = () => {
  const [tabId, setTabId] = useState('account');
  const [favoriteList, setFavoriteList] = useState([]);

  const renderBlock = (blocks) => blocks.map((block) => (
    <FavoriteBlockButton
      key={block.id}
      icon={iconGenerator(block.id)}
      label={block.label}
      disabled={block.disabled}
    />
  ));

  const renderBlockGroup = (group) => group.map((section) => (
    <section key={section.id} className={section.group}>
      <h3 className="title">{section.groupName}</h3>
      <div className="blockGroup">
        { renderBlock(section.blocks) }
      </div>
    </section>
  ));

  const renderTabList = (tabs) => tabs.map((tab) => (
    <FEIBTab key={tab.id} label={tab.groupName} value={tab.group} />
  ));

  useEffect(() => {
    getFavoriteList().then((response) => setFavoriteList(response.favoriteList));
  }, []);

  useEffect(() => {
    const target = document.querySelector(`.${tabId}`);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  }, [tabId]);

  return (
    <div className="addFavoritePage">
      <FEIBTabContext value={tabId}>
        <FEIBTabList $size="small" onChange={(event, value) => setTabId(value)}>
          { renderTabList(favoriteList) }
        </FEIBTabList>
      </FEIBTabContext>

      <div className="mainContent">
        { renderBlockGroup(favoriteList) }
      </div>
    </div>
  );
};

export default Favorite1;
