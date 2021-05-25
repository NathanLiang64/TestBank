import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCheckLocation, usePageInfo } from 'hooks';
import { ArrowForwardIos } from '@material-ui/icons';
import DebitCard from 'components/DebitCard';
import DetailCard from 'components/DetailCard';
import Avatar from 'assets/images/logo.jpg';
import DepositOverviewWrapper from './depositOverview.style';

const DepositOverview = () => {
  const [interestRateTitle, setInterestRateTitle] = useState('優惠利率');
  const [interestRateContent, setInterestRateContent] = useState('2.6%');

  const fakeDetailCardList = [
    {
      id: 1,
      avatar: null,
      title: '12月的伙食費',
      type: 'income',
      date: '12/08',
      sender: 'Amanda Wilkins',
      amount: 1200,
      balance: 212489283,
    },
    {
      id: 2,
      avatar: Avatar,
      title: '跨行轉入',
      type: 'income',
      date: '12/08',
      sender: '345-17282981',
      amount: 2650,
      balance: 212489874,
    },
    {
      id: 3,
      avatar: null,
      title: '自行轉出',
      type: 'spend',
      date: '12/05',
      sender: '345-17282981',
      amount: 1345,
      balance: 154563832,
    },
    {
      id: 4,
      avatar: null,
      title: '日式壽司',
      type: 'spend',
      date: '12/04',
      sender: '043-23924824',
      amount: 1200,
      balance: 154561422,
    },
    {
      id: 5,
      avatar: null,
      title: '業績獎金',
      type: 'income',
      date: '12/01',
      sender: '國易股份有限公司',
      amount: 200000,
      balance: 154560221,
    },
  ];

  const handleClickInterestRatePanel = () => {
    if (interestRateTitle === '優惠利率') {
      setInterestRateTitle('累積利息');
      setInterestRateContent('$3');
    } else {
      setInterestRateTitle('優惠利率');
      setInterestRateContent('2.6%');
    }
  };

  const renderDetailCardList = (list) => (
    list.map((card) => {
      const {
        id,
        avatar,
        title,
        type,
        date,
        sender,
        amount,
        balance,
      } = card;
      return (
        <DetailCard
          key={id}
          avatar={avatar}
          title={title}
          type={type}
          date={date}
          sender={sender}
          amount={amount}
          balance={balance}
        />
      );
    })
  );

  useCheckLocation();
  usePageInfo('/api/depositOverview');

  return (
    <DepositOverviewWrapper>
      <DebitCard
        type="original"
        branch="信義分行"
        cardName="保時捷車友會"
        account="043-004-99001234"
        balance={2000000}
      />

      <div className="infoPanel">
        <div className="panelItem">
          <h3>免費跨提/轉</h3>
          <p>3/5</p>
        </div>
        <div className="panelItem" onClick={handleClickInterestRatePanel}>
          <h3>{interestRateTitle}</h3>
          <p>{interestRateContent}</p>
        </div>
        <div className="panelItem">
          <h3>優惠利率額度</h3>
          <p>5萬</p>
        </div>
      </div>

      <div className="transactionDetail">
        { renderDetailCardList(fakeDetailCardList) }
        <Link className="moreButton" to="/">
          更多明細
          <ArrowForwardIos />
        </Link>
      </div>

    </DepositOverviewWrapper>
  );
};

export default DepositOverview;
