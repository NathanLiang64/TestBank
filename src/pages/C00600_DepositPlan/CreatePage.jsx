import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import uuid from 'react-uuid';
import parse from 'html-react-parser';

import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import Layout from 'components/Layout/Layout';
import Main from 'components/Layout';
import Accordion from 'components/Accordion';
import { FEIBButton, FEIBRadioLabel, FEIBRadio } from 'components/elements';
import Loading from 'components/Loading';

import CreatePageWrapper from './CreatePage.style';
import { getDepositPlanProgram, getDepositPlanTerms } from './api';

/**
 * C00600 存錢計畫 新增頁
 */
const DepositPlanCreatePage = () => {
  const dispatch = useDispatch();
  const [programs, setPrograms] = useState();
  const [terms, setTerms] = useState();

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    setPrograms(await getDepositPlanProgram());
    dispatch(setWaittingVisible(false));
  }, []);

  const lazyLoadTerms = async () => {
    if (!terms) setTerms(await getDepositPlanTerms());
  };

  const handleAgreeAndContiune = () => {
    // TODO
    console.debug('handleAgreeAndContiune');
  };

  return (
    <Layout title="新增存錢計畫">
      <Main>
        <CreatePageWrapper>
          <fieldset>
            <legend className="title">你的專屬存錢計畫</legend>
            <ul className="list-group">
              { programs && programs.map((p) => (
                <li key={uuid()} className="list">
                  <FEIBRadioLabel control={<FEIBRadio />} label={p.name} value={p.code} />
                  <div className="rate">{`${p.rate}%`}</div>
                </li>
              )) }
            </ul>
          </fieldset>

          <Accordion title="服務條款" className="terms" onClick={lazyLoadTerms}>
            { terms ? parse(terms) : <Loading space="both" isCentered /> }
          </Accordion>

          <FEIBButton onClick={handleAgreeAndContiune}>同意條款並繼續</FEIBButton>
        </CreatePageWrapper>
      </Main>
    </Layout>
  );
};

export default DepositPlanCreatePage;
