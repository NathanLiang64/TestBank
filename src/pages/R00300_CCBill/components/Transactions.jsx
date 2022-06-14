import { useRef, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import uuid from 'react-uuid';

import { ArrowNextIcon } from 'assets/images/icons';
import { FEIBTabContext, FEIBTabList, FEIBTab } from 'components/elements';
import Loading from 'components/Loading';
import InformationList from 'components/InformationList';
import InformationTape from 'components/InformationTape';
import Badge from 'components/Badge';
import EmptyData from 'components/EmptyData';
import {
  currencySymbolGenerator, dateFormatter, stringToDate, timeFormatter,
} from 'utilities/Generator';
import { getThisMonth, getMonthList } from 'utilities/MonthGenerator';
import { setModal, setModalVisible } from 'stores/reducers/ModalReducer';

import { getTransactionDetails } from '../api';
import TransactionsWrapper, { PopUpWrapper } from './Transactions.style';

const backlogMap = new Map();

const Transactions = ({ bills }) => {
  const scrollArea = useRef();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [displayList, setDisplayList] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(getThisMonth());

  const handleTransactionClick = (t) => {
    dispatch(setModal({
      title: '消費明細',
      content: (
        <PopUpWrapper>
          <Badge label={t.meno ?? t.description} value={`-${currencySymbolGenerator(t.currency ?? 'TWD', t.amount)}`} />
          <div>
            <InformationList title="交易時間" content={`${dateFormatter(stringToDate(t.txnDate))} ${timeFormatter(t.txnTime)}`} />
            <InformationList title="帳務時間" content={dateFormatter(stringToDate(t.bizDate))} />
          </div>
        </PopUpWrapper>
      ),
    }));
    dispatch(setModalVisible(true));
  };

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
          onClick={() => handleTransactionClick(log[i])}
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
