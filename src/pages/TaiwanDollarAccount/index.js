/* eslint-disable object-curly-newline */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/* Elements */
import Layout from 'components/Layout/Layout';
import AccountOverview from 'components/AccountOverview';

/* Reducers & JS functions */
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { loadFuncParams } from 'utilities/BankeePlus';
import { stringDateCodeFormatter } from 'utilities/Generator';
import { getAccountSummary, getTransactionDetails } from './api';
import { setAccounts, setSelectedAccount } from './ModelReducer';

/**
 * C00300 台幣帳戶首頁
 */
const TaiwanDollarAccount = () => {
  const startParams = loadFuncParams(); // Function Controller 提供的參數
  let defaultAccount = startParams; // 預設台幣帳號

  const model = useSelector((state) => state.ntdAccountSummaryReducer.accounts);
  const selectedAccount = useSelector((state) => state.ntdAccountSummaryReducer.selectedAccount);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const dispatch = useDispatch();

  /**
   * 頁面啟動，初始化
   */
  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    if (!model) {
      // 首次加載時取得用戶所有帳號
      const acctData = await getAccountSummary({ CCY: 'NTD' }); // TODO：取得本人的所有台幣的存款帳戶摘要資訊
      const newModel = acctData.map((acct) => ({
        cardInfo: acct,
        // 以下屬性在 selectedAccount 變更時取得。
        panelInfo: null,
        transactions: null,
      }));
      dispatch(setAccounts(newModel));
      defaultAccount = model.accounts[0].cardInfo.acctId;
    }
    // 以啟動參數(台幣帳號)為預設值；若沒有設，則以第一個帳號為預設值。
    dispatch(setSelectedAccount(defaultAccount ?? defaultAccount));

    dispatch(setWaittingVisible(false));
  }, []);

  /**
   * 根據當前帳戶取得交易明細資料及優惠利率數字
   */
  useEffect(async () => {
    // console.log(selectedAccount);
    const index = model.findIndex((act) => act.cardInfo.acctId === selectedAccount);
    const account = model[index];
    setSelectedIndex(index);

    // 取得優惠利率資訊
    if (account.panelInfo === null) {
      // TODO: 取得優惠利率資訊
    }

    // 取得帳戶交易明細（三年內的前25筆即可）
    if (account.transactions === null) {
      const today = new Date();
      const beginDay = new Date(today.getFullYear() - 3, today.getMonth(), today.getDate);
      const requestData = {
        account: selectedAccount,
        beginDT: stringDateCodeFormatter(beginDay), // '20210301',
        endDT: stringDateCodeFormatter(today), // '20220531',
      };
      const transData = await getTransactionDetails(requestData);

      account.transactions = transData;
    }
  }, [selectedAccount]);

  /**
   * 當使用者滑動卡片時的事件處理。
   */
  const handleChangeAccount = (swiper) => {
    const account = model[swiper.activeIndex];
    dispatch(setSelectedAccount(account.cardInfo.acctId));
  };

  /**
   * 頁面輸出
   */
  console.log(model, selectedAccount);
  return model ? (
    <Layout title="台幣活存">
      <AccountOverview
        accounts={[model.cardInfo]}
        onAccountChange={handleChangeAccount}
        detailsLink="/taiwanDollarAccountDetails" // TODO: 應改為 funcID
        cardColor="purple"
        funcList={[
          { fid: 'D00100', title: '轉帳', params: { selectedAccount } }, // /transferStatic
          { fid: 'D00300', title: '無卡提款', params: { selectedAccount } }, // /cardLessATM
        ]}
        moreFuncs={[
          { fid: null, title: '定存', icon: 'fixedDeposit' },
          { fid: 'E00100', title: '換匯', params: { selectedAccount }, icon: 'exchange' },
          { fid: null, title: '存摺封面下載', icon: 'coverDownload' },
          // { title: '存摺封面下載', path: 'http://114.32.27.40:8080/test/downloadPDF', icon: 'system_update' },
        ]}
        panelInfo={model[selectedIndex].panelInfo}
        details={model[selectedIndex].transactions}
      />
    </Layout>
  ) : <div />;
};

export default TaiwanDollarAccount;
