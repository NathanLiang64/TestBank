import uuid from 'react-uuid';
import { useDispatch } from 'react-redux';
import { setDrawer, setDrawerVisible } from 'stores/reducers/ModalReducer';

import AccountCard from 'components/AccountCard';
import { accountOverviewCardVarient } from 'utilities/Generator';

import AccountCardListWrapper from './AccountCardList.style';

// 累加帳戶金額
const accumulateBalance = (list) => list.reduce((accumulate, item) => accumulate + Math.abs(item.balance), 0);

// 產生子帳戶下拉選單
const renderSubAccountDrawer = (accounts) => {
  const totalBalance = accumulateBalance(accounts);
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
      { accounts.map((card) => (
        <AccountCard
          key={uuid()}
          cardName={card.alias ?? '存錢計畫'}
          percent={Math.round((card.balance / totalBalance) * 100)}
          {...card}
        />
      )) }
    </div>
  );
};

/**
 * C00100 帳戶總覽之下方帳戶列表元件
 */
const AccountCardList = ({ data }) => {
  const dispatch = useDispatch();

  // 子帳戶除外
  const mainList = data.filter((account) => account.type !== 'C');
  const totalBalance = accumulateBalance(mainList);

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

  // 負債的金額是負值，將金額轉正。
  mainList.forEach((account) => { account.balance = Math.abs(account.balance); });

  // 依金額從大到小排序。
  mainList.sort((a, b) => b.balance - a.balance);

  return (
    <AccountCardListWrapper>
      { mainList.map((card) => {
        let annotation;
        let onClick;

        switch (card.type) {
          case 'C':
            onClick = () => {
              dispatch(setDrawer({ title: '選擇計畫', content: renderSubAccountDrawer(subAccounts) }));
              dispatch(setDrawerVisible(true));
            };
            break;
          case 'CC':
            annotation = '已使用額度';
            break;
          default:
            annotation = null;
            onClick = null;
        }

        return (
          <AccountCard
            key={uuid()}
            cardName={card.alias ?? accountOverviewCardVarient(card.type).name}
            percent={Math.round((card.balance / totalBalance) * 100)}
            annotation={annotation}
            onClick={onClick}
            {...card}
          />
        );
      })}
    </AccountCardListWrapper>
  );
};

export default AccountCardList;
