import { useRef, useState, useEffect } from 'react';
import uuid from 'react-uuid';

import { ArrowNextIcon } from 'assets/images/icons';
import { FEIBTabContext, FEIBTabList, FEIBTab } from 'components/elements';
import Loading from 'components/Loading';
import InformationTape from 'components/InformationTape';
import EmptyData from 'components/EmptyData';
import { currencySymbolGenerator } from 'utilities/Generator';

import { getTransactionDetails } from '../api';
import TransactionsWrapper from './Transactions.style';

const backlogMap = new Map();

const Transactions = ({ bills }) => {
  const scrollArea = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [displayList, setDisplayList] = useState([]);

  const thisMonth = () => {
    const tmp = new Date().toLocaleDateString('UTC', { year: 'numeric', month: '2-digit' }).split('/');
    return `${tmp[1]}${tmp[0]}`;
  };
  const [selectedMonth, setSelectedMonth] = useState(thisMonth());

  useEffect(async () => {
    let log = backlogMap.get(selectedMonth);
    if (!log) {
      setIsLoading(true);
      const response = await getTransactionDetails({ startDate: `${selectedMonth}01`, endDate: `${selectedMonth}31` });
      backlogMap.set(selectedMonth, response);
      log = response;
    }

    const list = [];
    for (let i = 0; i < ((!isExpanded && log.length > 3) ? 3 : log.length); i++) {
      list.push((
        <InformationTape
          key={uuid()}
          topLeft={log[i].description}
          topRight={currencySymbolGenerator(log[i].currency ?? 'TWD', log[i].amount)}
          bottomLeft={`${log[i].txnDate.slice(4, 6)}/${log[i].txnDate.slice(6, 8)} | 卡-${bills?.accountNo.slice(-4)}`}
        />
      ));
    }
    setDisplayList(list);
    if (scrollArea?.current) scrollArea.current.scrollTo({ top: 0, behavior: 'smooth' });
    setIsLoading(false);
  }, [selectedMonth, isExpanded]);

  const handleOnTabChange = (_, id) => {
    setSelectedMonth(id);
  };

  const getMonthList = () => {
    const list = [];
    const date = new Date();
    for (let i = 0; i < 6; i++) {
      const tmp = date.toLocaleDateString('UTC', { year: 'numeric', month: '2-digit' }).split('/');
      list.push(`${tmp[1]}${tmp[0]}`);
      date.setMonth(date.getMonth() - 1);
    }
    return list;
  };

  return (
    <TransactionsWrapper>
      { bills ? (
        <>
          <FEIBTabContext value={selectedMonth}>
            <FEIBTabList $size="small" $type="fixed" onChange={handleOnTabChange}>
              { getMonthList().map((m) => <FEIBTab key={uuid()} label={`${m.slice(4, 6)}月`} value={m} />)}
            </FEIBTabList>
          </FEIBTabContext>
          { displayList?.length > 0 ? (
            <>
              <div className="info-tape-wrapper" ref={scrollArea}>
                { isLoading ? <Loading space="both" isCentered /> : displayList }
              </div>

              { !isExpanded && (
              <div className="toolbar">
                <button type="button" className="btn-icon" onClick={() => setIsExpanded(true)}>
                  更多明細
                  <ArrowNextIcon />
                </button>
              </div>
              )}

            </>
          ) : (
            <div style={{ height: '20rem', marginTop: '6rem' }}>
              <EmptyData />
            </div>
          )}
        </>
      ) : <Loading space="both" isCentered /> }
    </TransactionsWrapper>
  );
};

export default Transactions;
