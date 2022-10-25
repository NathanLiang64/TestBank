import uuid from 'react-uuid';
// import { useDispatch } from 'react-redux';
// import { setDrawer, setDrawerVisible } from 'stores/reducers/ModalReducer';

import AccountCard from 'components/AccountCard';
import { accountOverviewCardVarient } from 'utilities/Generator';
import { startFunc } from 'utilities/AppScriptProxy';

import { showDrawer } from 'utilities/MessageModal';
import AccountCardListWrapper from './AccountCardList.style';

/**
 * C00100 帳戶總覽之下方帳戶列表元件
 * 首先，先過濾帳戶列表，因為：
 *   1. 子帳戶、外幣帳戶、貸款會有多個，必須加總起來，且點擊後，會出現下拉式選單。
 *      - 只有一個時不會有選單，直接進入下一頁。
 *   2. 依照spec，帳戶總覽不呈現社群帳本。
 * 最後，再依金額排序。
 */
const AccountCardList = ({ data, isDebt }) => {
  // const dispatch = useDispatch();

  // 累加帳戶金額
  const accumulateBalance = (list) => list.reduce((accumulate, item) => accumulate + Math.abs(item.balance), 0);

  // 子帳戶、外幣帳戶、貸款除外
  const mainList = data.filter((account) => account.type !== 'C' && account.type !== 'F' && account.type !== 'L');

  // 子帳戶，且 《不包含》 社群帳本
  const subAccounts = data.filter((account) => account.type === 'C' && account.purpose !== 1);
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
      balance: accumulateBalance(foreignAccounts),
    });

    // 依金額從大到小排序。
    foreignAccounts.sort((a, b) => b.balance - a.balance);
  }

  // 貸款
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

  // 總金額，用於計算百分比
  const totalBalance = accumulateBalance(mainList);

  // 負債的金額是負值，將金額轉正，以便後續處理。
  mainList.forEach((account) => { account.balance = Math.abs(account.balance); });

  // 依金額從大到小排序。
  mainList.sort((a, b) => b.balance - a.balance);

  // 產生下拉選單(子帳戶／外幣帳戶／貸款)
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
        { accounts.map((card) => {
          const onClick = () => {
            startFunc(funcId, { focusToAccountNo: card.accountNo }); // TODO 從 存錢計畫 返回時的處理。
          };
          return (
            <button
              key={uuid()}
              type="button"
              title={`前往${card.alias ?? '存錢計畫'}`}
              aria-label={`前往${card.alias ?? '存錢計畫'}`}
              onClick={onClick}
            >
              <AccountCard
                cardName={card.alias ?? '存錢計畫'}
                percent={subTotalBalance > 0 ? Math.round((card.balance / subTotalBalance) * 100) : 0}
                hasShadow
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
      { mainList.map((account) => {
        let annotation;
        let funcID;
        let onClick = () => startFunc(funcID); // TODO 從 存錢計畫 返回時的處理。
        const cardInfo = accountOverviewCardVarient(account.type);

        switch (account.type) {
          case 'M': // 母帳戶
          case 'F': // 外幣帳戶 數量為1時不開drawer
            onClick = () => (foreignAccounts.length === 1 ? startFunc(funcID) : showDrawer('選擇帳戶', renderSubAccountDrawer(foreignAccounts, funcID)));
            break;
          case 'S': // 證券戶
            onClick = () => {
              startFunc('moreTranscations', {
                acctBalx: account.balance,
                accBranch: account.accountNo.slice(0, 3),
                acctId: account.accountNo,
                acctName: account.alias,
                acctType: account.type,
                ccyCd: account.currency,
                cardColor: cardInfo.color,
              });
            };
            break;

          case 'C': // 子帳戶 數量為1時不開drawer
            funcID = 'C00600';
            onClick = () => (subAccounts.length === 1 ? startFunc(funcID, { focusToAccountNo: subAccounts[0].accountNo }) : showDrawer('選擇計畫', renderSubAccountDrawer(subAccounts, funcID)));
            // {
            //   // dispatch(setDrawer({ title: '選擇計畫', content: renderSubAccountDrawer(subAccounts), shouldAutoClose: true }));
            //   // dispatch(setDrawerVisible(true));
            // };
            break;
          case 'CC': // 信用卡
            annotation = '已使用額度';
            funcID = 'C00700';
            break;
          case 'L': // 貸款 數量為1時不開drawer
            funcID = 'L00100';
            onClick = () => (loanAccounts.length === 1 ? startFunc(funcID) : showDrawer('選擇計畫', renderSubAccountDrawer(loanAccounts, funcID)));
            break;
          default:
            annotation = null;
            funcID = null;
            onClick = null;
        }

        return (
          <button
            key={uuid()}
            type="button"
            title={`前往${account.alias ?? cardInfo.name}`}
            aria-label={`前往${account.alias ?? cardInfo.name}`}
            onClick={onClick}
          >
            <AccountCard // 會依 card.type 決定顏色。
              cardName={account.alias ?? cardInfo.name}
              percent={totalBalance > 0 ? Math.round((account.balance / totalBalance) * 100) : 0} // TODO 可能因為捨進位問題，會不等於100
              annotation={annotation}
              hasShadow
              isShowAccoutNo={!isDebt}
              {...account}
            />
          </button>
        );
      })}
    </AccountCardListWrapper>
  );
};

export default AccountCardList;
