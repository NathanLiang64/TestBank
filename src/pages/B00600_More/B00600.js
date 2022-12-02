import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

/* Elements */
import { startFunc } from 'utilities/AppScriptProxy';
import EmptyData from 'components/EmptyData';
import Layout from 'components/Layout/Layout';
import FavoriteBlockButton from 'components/FavoriteBlockButton';
import { FEIBTabContext, FEIBTabList, FEIBTab } from 'components/elements';
import { iconGenerator } from 'pages/S00100_Favorite/favoriteGenerator';

/* Reducers & JS functions */
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { getMoreList } from './api';
import MoreWrapper from './B00600.style';
// import B00600AplFxProxy from './B00600_AplFxProxy';

/**
 * B00600 更多單元功能
 */
const More = () => {
  const dispatch = useDispatch();
  const groupsRef = useRef([]);
  const mainContentRef = useRef();
  const [funcGroups, setFuncGroups] = useState([]);
  const [currentGroup, setCurrentGroup] = useState();

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
      sessionStorage.setItem('funcItems', JSON.stringify(groups || []));
    } else groups = JSON.parse(funcItemsData);

    setFuncGroups(groups || []);
    setCurrentGroup((groups && groups.length) ? groups[0].groupKey : '');
    dispatch(setWaittingVisible(false));
  }, []);

  /**
   * 當單元功能分類(Section)變更時，調整 TAB頁籤 底線位置。
   */
  const handleChangeTabs = (_, value) => {
    const scrollTarget = groupsRef.current.find((el) => el.className === value);
    // scrollIntoView 會觸發 scroll 事件 (handleScrollContent)
    // 若提供 {behavior:'smooth'} ，則會在此 function 被觸發後造成多次 re-render
    // 會造成 handleScrollContent 判定異常，故這邊只給預設值，只 re-render 一次就好
    scrollTarget.scrollIntoView();
    const { scrollHeight, scrollTop, offsetHeight } = mainContentRef.current;
    // 當誤差值小於 1 時 則判定為尚未捲動到最底部
    if ((scrollHeight - (scrollTop + offsetHeight) <= 1)) {
      setCurrentGroup(value);
    }
  };

  /**
   * 滾動單元功能清單時，調整 TAB頁籤 底線位置。
   */
  const handleScrollContent = (event) => {
    const { scrollHeight, scrollTop, offsetHeight } = event.target;

    if (!(scrollHeight - (scrollTop + offsetHeight) <= 1)) {
      const foundGroup = groupsRef.current.find((el) => {
        // 設定 1 為誤差值，因為 scrollTo Func 不一定會捲動到 element 的 scrollTop 位置
        const top = el.offsetTop - 1;
        const bottom = top + el.offsetHeight;
        return (scrollTop >= top && scrollTop < bottom);
      });
      if (foundGroup && foundGroup.className !== currentGroup) {
        setCurrentGroup(foundGroup.className);
      }
    }
  };

  /**
   * 顯示指定分類的單元功能項目清單。
   * @param {*} group
   */
  const renderFuncGroup = (group, groupIndex) => {
    const doStartFunc = (funcCode) => {
      // TODO 不可執行的功能，例：純卡戶 執行 申請信用卡。
      // TODO 但 純卡戶 執行轉帳，則是由 Funciton Manager 提供資訊，由 Funciton Controller 詢問是否立即申請。
      startFunc(funcCode);
    };

    // TODO 加上「new」的圖示，可以用 上線時間 判斷，例：在一個月內都會出現。
    return (
      <section
        ref={(el) => { groupsRef.current[groupIndex] = el; }}
        key={group.groupKey}
        className={group.groupKey}
      >
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
        {funcGroups.length ? (
          <>
            <FEIBTabContext value={currentGroup}>
              <FEIBTabList $size="small" onChange={handleChangeTabs}>
                {
              funcGroups.map((group) => (
                <FEIBTab key={group.groupKey} label={group.groupName} value={group.groupKey} />
              ))
            }
              </FEIBTabList>
            </FEIBTabContext>
            <div className="mainContent" ref={mainContentRef} onScroll={handleScrollContent}>
              {
                funcGroups.map((group, groupIndex) => (renderFuncGroup(group, groupIndex)))
              }
            </div>
          </>
        ) : <EmptyData content="查無服務，請確認網路狀態" />}
      </MoreWrapper>
    </Layout>
  );
};

export default More;
