/* eslint-disable no-use-before-define */
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

/* Elements */
import Layout from 'components/Layout/Layout';
import FavoriteBlockButton from 'components/FavoriteBlockButton';
import { FEIBTabContext, FEIBTabList, FEIBTab } from 'components/elements';
import { iconGenerator } from 'pages/Favorite/favoriteGenerator';

/* Reducers & JS functions */
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
// import { showPrompt } from 'utilities/MessageModal';
import { startFunc } from 'utilities/AppScriptProxy';
import { getMoreList } from './api';
import MoreWrapper from './more.style';

/**
 * B00600 更多單元功能
 */
const More = () => {
  const dispatch = useDispatch();
  const funcListRef = useRef();

  const [funcGroups, setFuncGroups] = useState([]);
  const [currentGroup, setCurrentGroup] = useState();
  const [sectionPosition, setSectionPosition] = useState([]);

  /**
   * 頁面啟動，初始化
   */
  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    // 取得 Function Controller 提供的 keepDdata(model)
    const funcItemsData = sessionStorage.getItem('funcItems');

    // 首次加載時取得用戶所有外幣的存款帳戶摘要資訊
    let groups;
    if (!funcItemsData) {
      groups = await getMoreList();
      sessionStorage.setItem('funcItems', JSON.stringify(groups));
    } else {
      groups = JSON.parse(funcItemsData);
    }
    setFuncGroups(groups);
    setCurrentGroup((groups && groups.length) ? groups[0].groupKey : '');

    dispatch(setWaittingVisible(false));
  }, []);

  /**
   * 當單元功能分類(Section)變更時，調整 TAB頁籤 底線位置。
   */
  const handleChangeTabs = (event, value) => {
    const target = document.querySelector(`.${value}`);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  /**
   * 滾動單元功能清單時，調整 TAB頁籤 底線位置。
   */
  const handleScrollContent = () => {
    const { scrollTop } = funcListRef?.current;
    const target = sectionPosition.find((section) => section.position >= scrollTop);
    setCurrentGroup(target?.id);
  };

  /**
   * 滾動單元功能清單時，以單元功能分類(Section)調整 TAB頁籤 底線位置。
   */
  useEffect(() => {
    if (funcListRef?.current) {
      const categories = Array.from(funcListRef?.current?.children);
      const groupPosition = categories.map((section) => (
        { id: section.className, position: section.offsetTop }
      ));
      setSectionPosition(groupPosition);
    }
  }, [funcListRef?.current]);

  /**
   * 顯示指定分類的單元功能項目清單。
   * @param {*} group
   */
  const renderFuncGroup = (group) => {
    const doStartFunc = (funcCode) => {
      // TODO 不可執行的功能，例：純卡戶 執行 申請信用卡。
      // TODO 但 純卡戶 執行轉帳，則是由 Funciton Manager 提供資訊，由 Funciton Controller 詢問是否立即申請。
      startFunc(funcCode);
    };

    // TODO 加上「new」的圖示，可以用 上線時間 判斷，例：在一個月內都會出現。
    return (
      <section key={group.groupKey} className={group.groupKey}>
        <h3 className="title">{group.groupName}</h3>
        <div className="blockGroup">
          {
            group.items.map((item) => (
              <FavoriteBlockButton
                key={item.actKey}
                icon={iconGenerator(item.actKey)}
                label={item.name}
                onClick={() => doStartFunc(item.actKey)}
                noBorder
              />
            ))
          }
        </div>
      </section>
    );
  };

  /**
   * 頁面輸出
   */
  return (
    <Layout title="更多">
      <MoreWrapper small>
        <FEIBTabContext value={currentGroup}>
          <FEIBTabList $size="small" onChange={handleChangeTabs}>
            {
              funcGroups.map((group) => (
                <FEIBTab key={group.groupKey} label={group.groupName} value={group.groupKey} />
              ))
            }
          </FEIBTabList>
        </FEIBTabContext>
        <div className="mainContent" ref={funcListRef} onScroll={handleScrollContent}>
          {
            funcGroups.map((group) => (renderFuncGroup(group)))
          }
        </div>
      </MoreWrapper>
    </Layout>
  );
};

export default More;
