/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary */
import uuid from 'react-uuid';
import AccountCard from 'components/AccountCard';
import { accountOverviewCardVarient, getCurrenyInfo } from 'utilities/Generator';

import { showDrawer } from 'utilities/MessageModal';
import { Func } from 'utilities/FuncID';
import { useNavigation } from 'hooks/useNavigation';
import AccountCardListWrapper from './AccountCardList.style';
import AccountCardGrey from './AccountCardGrey';

/**
 * C00100 帳戶總覽之下方帳戶列表元件
 * 首先，先過濾帳戶列表，因為：
 *   1. 子帳戶、外幣帳戶、證券、貸款會有多個，必須加總起來，且點擊後，會出現下拉式選單。
 *      - 只有一個時不會有選單，直接進入下一頁。
 *   2. 依照spec，帳戶總覽不呈現社群帳本。
 * 最後，再依金額排序。
 */
const AccountCardList = ({
  data, isDebt, necessaryType, totalBalanceF2N,
}) => {
  // const dispatch = useDispatch();
  const {startFunc} = useNavigation();

  // 證券 start function
  const sAccStartFunc = (account, cardColor) => {
    const functionParam = {
      ...account,
      cardColor,
    };
    startFunc('moreTranscations', functionParam);
  };

  // 累加帳戶金額
  const accumulateBalance = (list) => list.reduce((accumulate, item) => accumulate + Math.abs(item.balance), 0);

  // 帳戶列表
  const mainList = [];

  // 主帳戶：台幣主帳戶包含所有子帳戶
  const mainAccount = data.filter((account) => ['M', 'C'].includes(account.type));
  if (mainAccount.length > 0) {
    mainList.push({
      type: 'M',
      accountNo: null,
      balance: accumulateBalance(mainAccount),
    });
  }

  // 子帳戶，且 只有『存錢計畫』
  // const subAccounts = data.filter((account) => account.type === 'C' && account.purpose === 2);
  const subAccounts = [];
  if (subAccounts.length > 0) {
    mainList.push({
      type: 'C',
      accountNo: null,
      balance: accumulateBalance(subAccounts),
    });

    // 依金額從大到小排序。
    subAccounts.sort((a, b) => b.balance - a.balance);
  }

  // 外幣帳戶
  const foreignAccounts = data.filter((account) => account.type === 'F');
  if (foreignAccounts.length > 0) {
    mainList.push({
      type: 'F',
      accountNo: null,
      balance: totalBalanceF2N, // 金額由後端直接加總
    });

    // 依金額從大到小排序。
    foreignAccounts.sort((a, b) => b.balance - a.balance);
  }

  // 證券
  const stockAccounts = data.filter((account) => account.type === 'S');
  if (stockAccounts.length > 0) {
    mainList.push({
      type: 'S',
      accountNo: null,
      balance: accumulateBalance(stockAccounts),
    });

    stockAccounts.sort((a, b) => b.balance - a.balance);
  }

  // 貸款: 以 assetTypes 回傳有包含為準顯示彩卡
  const loanAccounts = data.filter((account) => account.type === 'L');
  if (loanAccounts.length > 0) {
    mainList.push({
      type: 'L',
      accountNo: null,
      balance: accumulateBalance(loanAccounts),
    });

    // 依金額從大到小排序。
    loanAccounts.sort((a, b) => b.balance - a.balance);
  }

  // 信用卡: 以 assetTypes 回傳有包含為準顯示彩卡
  const ccAccounts = data.filter((account) => account.type === 'CC');
  if (ccAccounts.length > 0) {
    mainList.push(...ccAccounts.map((account) => ({
      ...account,
    })));
  }

  // 總金額，用於計算百分比
  const totalBalance = accumulateBalance(mainList);

  // 負債的金額是負值，將金額轉正，以便後續處理。
  mainList.forEach((account) => { account.balance = Math.abs(account.balance); });

  /**
   * 主陣列依金額從大到小排序，若金額相同且非同種卡片，排序依照：
   * 正：臺幣>證券>外幣
   * 負：信用卡>貸款
   */
  // 檢查mainList中有無所有需要的type，無則加入
  const checkType = () => necessaryType.map((type) => {
    const found = mainList.some((item) => item.type === type);

    if (!found) {
      mainList.push({
        balance: 0,
        purpose: 0,
        accountNo: null,
        alias: '',
        currency: 'NTD',
        type,
        isEmpty: true,
      });
    }

    return mainList;
  }).slice(-1)[0];
  // 排列補齊type後的list
  checkType().sort((a, b) => {
    if (a.balance === b.balance) {
      // 有特定key且為true的話排後面，且依照key的value的順序排序
      if (a.isEmpty || b.isEmpty) {
        return (
          b.isEmpty && necessaryType.indexOf(a.type) - necessaryType.indexOf(b.type)
        );
      }
      // 依照value的順序排序（依照necessaryType陣列順序）
      return necessaryType.indexOf(a.type) - necessaryType.indexOf(b.type);
    }
    // 依照大小排序
    // return b.balance - a.balance;
    // 依照設定排序
    const sortConfig = ['M', 'S', 'F', 'CC', 'L'];
    return sortConfig.indexOf(a.type) - sortConfig.indexOf(b.type);
  });

  // 產生下拉選單(子帳戶／外幣帳戶／貸款 / 證券)
  const renderSubAccountDrawer = (accounts, funcId) => {
    const subTotalBalance = accumulateBalance(accounts);
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2.4rem',
          paddingInline: '1.6rem',
          marginBottom: '4rem',
        }}
      >
        {accounts.map((card) => {
          const cardColor = accountOverviewCardVarient(card.type);
          const onClick = () => {
            if (card.type === 'S') {
              sAccStartFunc(card, cardColor); // 前往證券帳戶明細
              return;
            }
            if (card.type === 'F') startFunc(funcId, { defaultCurrency: card.currency }); // 前往外幣帳戶總覽之指定幣別
            if (card.type === 'C') startFunc(funcId, { focusToAccountNo: card.accountNo }); // TODO 從 存錢計畫 返回時的處理。
          };

          let cardName;
          switch (card.type) {
            case 'F': // 外幣帳戶
              cardName = getCurrenyInfo(card.currency).name;
              break;
            case 'S': // 證券戶
              cardName = '證券交割戶';
              break;
            case 'C': // 子帳戶
              cardName = '存錢計畫';
              break;
            case 'L': // 貸款
              cardName = '貸款';
              break;
            default:
              cardName = '';
              break;
          }
          return (
            <button
              key={uuid()}
              type="button"
              title={`前往${cardName}`}
              aria-label={`前往${cardName}`}
              onClick={onClick}
            >
              <AccountCard
                cardName={cardName}
                percent={subTotalBalance > 0 ? Math.round((card.balance / subTotalBalance) * 100) : 0}
                hasShadow
                dollarSign={card.currency}
                {...card}
              />
            </button>
          );
        }) }
      </div>
    );
  };

  return (
    <AccountCardListWrapper>
      {mainList.map((account) => {
        let annotation;
        let funcID;
        let cardName;
        let onClick = () => startFunc(funcID); // TODO 從 存錢計畫 返回時的處理。
        const cardInfo = accountOverviewCardVarient(account.type);

        const handleCOnClick = () => {
          if (subAccounts.length === 0) startFunc(funcID);
          if (subAccounts.length === 1) {
            startFunc(funcID, { focusToAccountNo: subAccounts[0].accountNo });
          } else showDrawer('選擇計畫', renderSubAccountDrawer(subAccounts, funcID));
        };

        switch (account.type) {
          case 'M': // 母帳戶
            cardName = '臺幣帳戶';
            funcID = Func.C003.id;
            break;
          case 'F': // 外幣帳戶 數量為1時不開drawer
            cardName = '外幣帳戶';
            funcID = Func.C004.id;
            onClick = () => (startFunc(funcID));
            break;
          case 'S': // 證券戶 數量為1時不開drawer
            cardName = '證券交割戶';
            onClick = () => (account.isEmpty || stockAccounts.length === 1 ? sAccStartFunc(stockAccounts[0], cardInfo.color) : showDrawer('選擇帳戶', renderSubAccountDrawer(stockAccounts)));
            break;
          case 'C': // 子帳戶 數量為1時不開drawer
            cardName = '子帳戶';
            funcID = Func.C006.id;
            onClick = () => handleCOnClick();
            break;
          case 'CC': // 信用卡
            cardName = '信用卡';
            annotation = '已使用額度';
            funcID = Func.C007.id;
            onClick = () => (startFunc(funcID));
            break;
          case 'L': // 貸款 數量為1時不開drawer
            cardName = '貸款';
            funcID = Func.L001.id;
            onClick = () => (account.isEmpty || loanAccounts.length === 1 ? startFunc(funcID) : showDrawer('選擇計畫', renderSubAccountDrawer(loanAccounts, funcID)));
            break;
          default:
            cardName = '';
            annotation = null;
            funcID = null;
            onClick = null;
            break;
        }

        return (
          <button
            key={uuid()}
            type="button"
            title={`前往${cardName}`}
            aria-label={`前往${cardName}`}
            onClick={onClick}
          >
            {account.isEmpty ? <AccountCardGrey type={account.type} /> : (
              <AccountCard // 會依 card.type 決定顏色。
                cardName={cardName}
                percent={totalBalance > 0 ? Math.round((account.balance / totalBalance) * 100) : 0} // TODO 可能因為捨進位問題，會不等於100
                annotation={annotation}
                hasShadow
                isShowAccoutNo={!isDebt}
                {...account}
              />
            )}

          </button>
        );
      })}
      {/* {!isDebt && <p className="warning_text">陌生電話先求證，轉帳交易須謹慎</p>} */}
    </AccountCardListWrapper>
  );
};

export default AccountCardList;
