import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Main from 'components/Layout';
import Layout from 'components/Layout/Layout';
import MemberAccountCard from 'components/MemberAccountCard';
import { showCustomDrawer, showCustomPrompt, showPrompt } from 'utilities/MessageModal';
import { Func } from 'utilities/FuncID';
import { setDrawerVisible, setModalVisible, setWaittingVisible } from 'stores/reducers/ModalReducer';
import { AddIcon } from 'assets/images/icons';
import EmptyData from 'components/EmptyData';
import uuid from 'react-uuid';
import {
  datetimeToString, getCurrenyInfo, getCurrenyName, currencySymbolGenerator,
} from 'utilities/Generator';
import NoticeEditor from './E00400_NoticeEditor';
import PageWrapper from './E00400.style';
import {
  addNoticeItem, getAllNotices, getExchangeRateInfo, removeNoticeItem,
} from './api';

/**
 * E00400 外幣到價通知設定
 */
const Page = () => {
  const [notiLists, setNotiLists] = useState();
  const dispatch = useDispatch();

  const fetchExRateList = async () => {
    const generateCurrencyOptions = (list) => list.map((item) => {
      const {code, name} = getCurrenyInfo(item.ccycd);
      return {
        label: `${name} ${code}`, value: code, brate: item.brate, srate: item.srate,
      };
    });
    dispatch(setWaittingVisible(true));
    const exRateList = await getExchangeRateInfo();
    dispatch(setWaittingVisible(false));
    const currentTime = datetimeToString(new Date());
    return {currencyOptions: generateCurrencyOptions(exRateList), currentTime};
  };

  // 新增通知設定
  const addnewAccount = async () => {
    if (notiLists.length >= 5) {
      showPrompt('已達設定數量上限 (五筆)');
      return;
    }

    const {currencyOptions, currentTime} = await fetchExRateList();
    const onSubmit = async (param) => {
      dispatch(setDrawerVisible(false));
      const {isSuccess} = await addNoticeItem(param);
      if (isSuccess) {
        setNotiLists((prevLists) => {
          const updatedLists = [...prevLists];
          updatedLists.push(param);
          return updatedLists;
        });
      }
    };

    await showCustomDrawer({
      title: '新增外幣到價通知',
      content: <NoticeEditor onSubmit={onSubmit} currencyOptions={currencyOptions} currentTime={currentTime} />,
      noScrollable: true,
    });
  };

  // 編輯通知設定
  const editAccount = async (noti) => {
    const {currencyOptions, currentTime} = await fetchExRateList();
    const onSubmit = async (newNoti) => {
      dispatch(setDrawerVisible(false));
      const {isSuccess} = await removeNoticeItem(noti); // 1. 先移除既有的設定
      if (isSuccess) {
        const res = await addNoticeItem(newNoti); // 2. 再新增更新後的設定
        if (res.isSuccess) {
          setNotiLists((prevList) => {
            const updatedList = [...prevList];
            const index = updatedList.findIndex(({currency, direction}) => noti.currency === currency && noti.direction === direction);
            updatedList[index] = newNoti;
            return updatedList;
          });
        }
      }
    };

    await showCustomDrawer({
      title: '編輯外幣到價通知',
      content: <NoticeEditor initData={noti} onSubmit={onSubmit} currencyOptions={currencyOptions} currentTime={currentTime} />,
      noScrollable: true,
    });
  };

  // 移除通知設定
  const removeAccount = async (noti) => {
    await showCustomPrompt({
      title: '系統訊息',
      message: '您確定要刪除此通知設定',
      okContent: '確定刪除',
      onOk: async () => {
        dispatch(setModalVisible(false));
        const {isSuccess} = await removeNoticeItem(noti);
        if (isSuccess) {
          setNotiLists((prevLists) => {
            const updatedNotiLists = prevLists.filter(({direction, currency}) => (
              noti.currency !== currency || noti.direction !== direction
            ));
            return updatedNotiLists;
          });
        }
      },
      cancelContent: '我再想想',
      onCancel: () => {},
    });
  };

  // 渲染設定通知列表
  const renderMemberCards = () => {
    if (!notiLists) return null;
    if (!notiLists.length) return <EmptyData content="尚無已設定的通知" height="70vh" />;
    return notiLists.map((noti) => (
      <MemberAccountCard
        key={uuid()}
        name={getCurrenyName(noti.currency)}
        subTitle={`匯率${noti.direction ? '低於' : '高於'} (含) : ${currencySymbolGenerator(noti.currency, noti.price)}`}
        hasNewTag={noti.isNew}
        disabledAvatar={false}
        moreActions={[
          { lable: '編輯', type: 'edit', onClick: () => editAccount(noti) },
          { lable: '刪除', type: 'delete', onClick: () => removeAccount(noti) },
        ]}
      />
    ));
  };

  useEffect(() => {
    getAllNotices().then((res) => setNotiLists(res));
  }, []);

  return (
    <Layout fid={Func.E004} title="外幣到價通知設定">
      <Main small>
        <PageWrapper>
          <button type="button" aria-label="新增外幣到價通知設定" className="addMemberButtonArea" onClick={addnewAccount}>
            <div className="addMemberButtonIcon">
              <AddIcon />
            </div>
            <span className="addMemberButtonText">新增 (最多可設定五筆)</span>
          </button>
          {renderMemberCards()}
        </PageWrapper>
      </Main>
    </Layout>
  );
};

export default Page;
