import { useState, useEffect } from 'react';
import uuid from 'react-uuid';

import { ArrowNextIcon } from 'assets/images/icons';
import { FEIBTabContext, FEIBTabList, FEIBTab } from 'components/elements';
import InformationTape from 'components/InformationTape';

import TransactionsWrapper from './Transactions.style';

const Transactions = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [displayList, setDisplayList] = useState();

  useEffect(async () => {
    setDisplayList([
      <InformationTape topLeft="A" topRight="B" bottomLeft="C" />,
    ]);
  }, []);

  const thisMonth = () => {
    const tmp = new Date().toLocaleDateString('UTC', { year: 'numeric', month: '2-digit' }).split('/');
    return `${tmp[1]}${tmp[0]}`;
  };
  const [selectedMonth, setSelectedMonth] = useState(thisMonth());

  const handleOnTabChange = (_, id) => {
    setSelectedMonth(id);
  };

  const getMonthList = () => {
    const list = [];
    const date = new Date();
    for (let i = 0; i < 6; i++) {
      const tmp = date.toLocaleDateString(undefined, { year: 'numeric', month: '2-digit' }).split('/');
      list.push(`${tmp[1]}${tmp[0]}`);
      date.setMonth(date.getMonth() - 1);
    }
    return list;
  };

  return (
    <TransactionsWrapper>
      <FEIBTabContext value={selectedMonth}>
        <FEIBTabList $size="small" $type="fixed" onChange={handleOnTabChange}>
          { getMonthList().map((m) => <FEIBTab key={uuid()} label={`${m.slice(4, 6)}月`} value={m} />)}
        </FEIBTabList>
      </FEIBTabContext>

      <div className="info-tape-wrapper">
        { displayList }
      </div>

      { !isExpanded && (
        <div className="toolbar">
          <button type="button" className="btn-icon" onClick={() => setIsExpanded(true)}>
            更多明細
            <ArrowNextIcon />
          </button>
        </div>
      )}
    </TransactionsWrapper>
  );
};

export default Transactions;
