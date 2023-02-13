/**
 * /* Elements
 *
 * @format
 */
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { getExchangeRateInfo } from 'pages/E00200_ExchangeRate/api';
import Layout from 'components/Layout/Layout';
import { E00200Table } from 'pages/E00200_ExchangeRate/E00200_Content';
import { Func } from 'utilities/FuncID';

/* Styles */
import ExchangeRateWrapper from './E00200.style';

const ExchangeRate = () => {
  const [exchangeRate, setExchangeRate] = useState([]);
  const dispatch = useDispatch();

  // 取得匯率資訊
  const fetchExchangeRateInfo = async () => {
    dispatch(setWaittingVisible(true));
    const res = await getExchangeRateInfo({});
    setExchangeRate(res);
    dispatch(setWaittingVisible(false));
  };

  useEffect(() => {
    fetchExchangeRateInfo();
  }, []);

  return (
    <Layout fid={Func.E002} title="匯率">
      <ExchangeRateWrapper>
        <E00200Table exchangeRate={exchangeRate} />
      </ExchangeRateWrapper>
    </Layout>
  );
};

export default ExchangeRate;
