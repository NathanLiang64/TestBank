import uuid from 'react-uuid';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import { setDrawer, setDrawerVisible } from 'stores/reducers/ModalReducer';

import AccountCard from 'components/AccountCard';
import { accountOverviewCardVarient } from 'utilities/Generator';

import AccountCardListWrapper from './AccountCardList.style';

/**
 * C00100 帳戶總覽之下方帳戶列表元件
 */
const AccountCardList = ({ data }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  // 累加帳戶金額
  const accumulateBalance = (list) => list.reduce((accumulate, item) => accumulate + Math.abs(item.balance), 0);

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

  // 產生子帳戶下拉選單
  const renderSubAccountDrawer = (accounts) => {
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
            history.push('/C00600', { focusToAccountNo: card.accountNo });
          };
          return (
            <AccountCard
              key={uuid()}
              cardName={card.alias ?? '存錢計畫'}
              percent={Math.round((card.balance / subTotalBalance) * 100)}
              onClick={onClick}
              {...card}
            />
          );
        }) }
      </div>
    );
  };

  return (
    <AccountCardListWrapper>
      { mainList.map((card) => {
        let annotation;
        let funcID;
        let onClick = () => history.push(`/${funcID}`);

        switch (card.type) {
          case 'M': // 母帳戶
            funcID = 'C00300';
            break;
          case 'F': // 外幣帳戶
            funcID = 'C00400';
            break;
          case 'S': // 證券戶
            funcID = 'C00400';
            break;
          case 'C': // 子帳戶
            onClick = () => {
              dispatch(setDrawer({ title: '選擇計畫', content: renderSubAccountDrawer(subAccounts) }));
              dispatch(setDrawerVisible(true));
            };
            break;
          case 'CC': // 信用卡
            annotation = '已使用額度';
            funcID = 'C00700';
            break;
          case 'L': // 貸款
            funcID = 'L00100';
            break;
          default:
            annotation = null;
            funcID = null;
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
