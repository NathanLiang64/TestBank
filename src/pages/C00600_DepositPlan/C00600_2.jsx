/* eslint-disable no-unused-vars */
import { useState, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import uuid from 'react-uuid';
import parse from 'html-react-parser';
import { RadioGroup } from '@material-ui/core';

import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import Layout from 'components/Layout/Layout';
import Main from 'components/Layout';
import Accordion from 'components/Accordion';
import {
  FEIBButton, FEIBRadioLabel, FEIBRadio, FEIBErrorMessage, FEIBCheckbox,
} from 'components/elements';
import Loading from 'components/Loading';

import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from 'hooks/useNavigation';
import { FuncID } from 'utilities/FuncID';
import { RadioGroupField } from 'components/Fields/radioGroupField';
import { CreatePageWrapper } from './C00600.style';
import { getDepositPlanProgram, getDepositPlanTerms } from './api';
import { AlertReachedMaxPlans } from './utils/prompts';

/**
 * C00600 存錢計畫 新增頁
 */
const DepositPlanCreatePage = () => {
  const dispatch = useDispatch();
  const { closeFunc, goHome } = useNavigation();
  const history = useHistory();
  const {
    control, handleSubmit, formState: {errors},
  } = useForm(
    {
      defaultValues: {code: ''},
      resolver: yupResolver(yup.object().shape({
        code: yup.string().required('請選擇計畫'),
      })),
    },
  );
  const {state} = useLocation();
  const [programs, setPrograms] = useState();
  const [terms, setTerms] = useState();
  if (!state || !state.depositPlans) closeFunc();// GURARD 如果 state/state.depositPlans 不存在，在這一行就結束了
  const {depositPlans} = state;

  useEffect(async () => {
    dispatch(setWaittingVisible(true));
    // Guard: 存錢計畫首頁最多就三個計畫，意指若未在該情況下進入此頁為不正常操作。
    if (depositPlans.plans.length >= 3) AlertReachedMaxPlans({ goBack: closeFunc, goHome });
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
    const {subAccounts, totalSubAccountCount} = depositPlans;
    const hasReachedMaxSubAccounts = totalSubAccountCount >= 8;
    history.push('/C006003', {
      program, subAccounts, hasReachedMaxSubAccounts,
    });
  };

  return (
    <Layout title="新增存錢計畫" goBackFunc={() => history.replace(FuncID.C00600, {depositPlans})}>
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
