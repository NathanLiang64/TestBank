/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
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
  FEIBButton, FEIBRadioLabel, FEIBRadio, FEIBErrorMessage,
} from 'components/elements';
import Loading from 'components/Loading';

import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigation } from 'hooks/useNavigation';
import { Func } from 'utilities/FuncID';
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
  } = useForm({
    defaultValues: {code: ''},
    resolver: yupResolver(yup.object().shape({
      code: yup.string().required('請選擇計畫'),
    })),
  });
  const {state} = useLocation();

  const [terms, setTerms] = useState();
  // Guard
  if (!state) {
    history.goBack();
    return null;
  }
  const {viewModel} = state;

  useEffect(async () => {
    // Guard: 存錢計畫首頁最多就三個計畫，意指若未在該情況下進入此頁為不正常操作。
    if (viewModel.depositPlans.plans.length >= 3) AlertReachedMaxPlans({ goBack: closeFunc, goHome });
    dispatch(setWaittingVisible(true));
    viewModel.programs = viewModel.programs || await getDepositPlanProgram();
    dispatch(setWaittingVisible(false));
  }, []);

  const lazyLoadTerms = async () => {
    if (!terms) setTerms(await getDepositPlanTerms());
  };

  const onSubmit = ({code}) => {
    sessionStorage.removeItem('C00600-hero'); // 清除暫存背景圖。

    const program = viewModel.programs.find((p) => p.code === code);
    const {subAccounts, totalSubAccountCount} = viewModel.depositPlans;
    const hasReachedMaxSubAccounts = totalSubAccountCount >= 8;
    history.push('/C006003', {
      program, subAccounts, hasReachedMaxSubAccounts, viewModel,
    });
  };

  return (
    <Layout title="新增存錢計畫" goBackFunc={() => history.replace(`${Func.C006.id}00`, {viewModel})}>
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
                      { viewModel.programs && viewModel.programs.map((p) => (
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
