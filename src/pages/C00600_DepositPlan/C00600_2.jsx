/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { Controller, useForm } from 'react-hook-form';
import uuid from 'react-uuid';
import parse from 'html-react-parser';
import { RadioGroup } from '@material-ui/core';

import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import Layout from 'components/Layout/Layout';
import Main from 'components/Layout';
import Accordion from 'components/Accordion';
import {
  FEIBButton, FEIBRadioLabel, FEIBRadio, FEIBErrorMessage,
} from 'components/elements';
import Loading from 'components/Loading';
import { closeFunc } from 'utilities/AppScriptProxy';

import { yupResolver } from '@hookform/resolvers/yup';
import { CreatePageWrapper } from './C00600.style';
import { getDepositPlans, getDepositPlanProgram, getDepositPlanTerms } from './api';
import { AlertReachedMaxPlans } from './utils/prompts';
import { createSchema } from './validationSchema';

/**
 * C00600 存錢計畫 新增頁
 */
const DepositPlanCreatePage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { control, handleSubmit, formState: { errors } } = useForm(
    {
      defaultValues: {code: ''},
      resolver: yupResolver(createSchema),
    },
  );

  const [programs, setPrograms] = useState();
  const [terms, setTerms] = useState();
  const [subAccounts, setSubAccounts] = useState([]);
  const [hasReachedMaxSubAccounts, setHasReachedMaxSubAccounts] = useState(false);

  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    const response = await getDepositPlans();
    if (response) {
      const {plans, subAccounts: accounts, totalSubAccountCount} = response;
      // Guard: 存錢計畫首頁最多就三個計畫，意指若未在該情況下進入此頁為不正常操作。
      if (plans.length >= 3) AlertReachedMaxPlans({ goBack: () => closeFunc() });
      setSubAccounts(accounts);
      setHasReachedMaxSubAccounts(totalSubAccountCount >= 8);
    }

    const programResponse = await getDepositPlanProgram();
    setPrograms(programResponse);
    dispatch(setWaittingVisible(false));
  }, []);

  const lazyLoadTerms = async () => {
    if (!terms) setTerms(await getDepositPlanTerms());
  };

  const onSubmit = ({code}) => {
    sessionStorage.removeItem('C006003'); // 清除暫存表單資料。
    sessionStorage.removeItem('C00600-hero'); // 清除暫存背景圖。

    const program = programs.find((p) => p.code === code);
    history.push('/C006003', {
      program, subAccounts, hasReachedMaxSubAccounts,
    });
  };

  return (
    <Layout title="新增存錢計畫" goBackFunc={() => history.goBack()}>
      <Main>
        <CreatePageWrapper>
          <form className="flex" onSubmit={handleSubmit(onSubmit)}>
            <fieldset>
              <legend className="title">你的專屬存錢計畫</legend>
              <Controller
                name="code"
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field}>
                    <ul className="list-group">
                      { programs && programs.map((p) => (
                        <li key={uuid()} className="list">
                          <FEIBRadioLabel control={<FEIBRadio />} label={p.name} value={`${p.code}`} />
                          <div className="rate">{`${p.rate}%`}</div>
                        </li>
                      )) }
                    </ul>
                  </RadioGroup>
                )}
              />
              {errors.code && (
              <FEIBErrorMessage>
                {errors.code.message}
              </FEIBErrorMessage>

              )}
            </fieldset>

            <Accordion title="服務條款" className="terms" onClick={lazyLoadTerms}>
              { terms ? parse(terms) : <Loading space="both" isCentered /> }
            </Accordion>
            <FEIBButton type="submit">同意條款並繼續</FEIBButton>
          </form>
        </CreatePageWrapper>
      </Main>
    </Layout>
  );
};

export default DepositPlanCreatePage;
