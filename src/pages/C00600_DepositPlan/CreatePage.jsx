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
import { FEIBButton, FEIBRadioLabel, FEIBRadio } from 'components/elements';
import Loading from 'components/Loading';
import { loadFuncParams, closeFunc } from 'utilities/AppScriptProxy';

import CreatePageWrapper from './CreatePage.style';
import { getDepositPlans, getDepositPlanProgram, getDepositPlanTerms } from './api';
import { AlertReachedMaxPlans } from './utils/prompts';

/**
 * C00600 存錢計畫 新增頁
 */
const DepositPlanCreatePage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { control, handleSubmit } = useForm();

  const [programs, setPrograms] = useState();
  const [terms, setTerms] = useState();
  const [subAccounts, setSubAccounts] = useState([]);
  const [hasReachedMaxSubAccounts, setHasReachedMaxSubAccounts] = useState(false);

  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    let plansLength;
    let accounts;
    let totalSubAccountCount;

    // startParams: { plansLength, subAccounts, totalSubAccountCount }
    const startParams = await loadFuncParams(); // Function Controller 提供的參數
    if (startParams && (typeof startParams === 'object')) {
      // 從存錢計畫首頁跳轉，故已有子帳戶資訊。
      plansLength = startParams.plansLength;
      accounts = startParams.subAccounts;
      totalSubAccountCount = startParams.totalSubAccountCount;
    } else {
      // 從其他頁面跳轉至此，應載入子帳戶資訊。
      const response = await getDepositPlans();
      plansLength = response.plans.length;
      accounts = response.subAccounts;
      totalSubAccountCount = response.totalSubAccountCount;
    }

    // Guard: 存錢計畫首頁最多就三個計畫，意指若未在該情況下進入此頁為不正常操作。
    if (plansLength >= 3) AlertReachedMaxPlans({ goBack: () => closeFunc() });

    setSubAccounts(accounts);
    setHasReachedMaxSubAccounts(totalSubAccountCount >= 8);

    setPrograms(await getDepositPlanProgram());
    dispatch(setWaittingVisible(false));
  }, []);

  const lazyLoadTerms = async () => {
    if (!terms) setTerms(await getDepositPlanTerms());
  };

  const onSubmit = (data) => {
    sessionStorage.removeItem('C006003'); // 清除暫存表單資料。
    sessionStorage.removeItem('C00600-hero'); // 清除暫存背景圖。

    const program = programs.find((p) => p.code === data.code);
    history.push('/C006003', {
      program, subAccounts, hasReachedMaxSubAccounts,
    });
  };

  return (
    <Layout title="新增存錢計畫" goBackFunc={() => closeFunc()}>
      <Main>
        <CreatePageWrapper>
          <form className="flex" onSubmit={handleSubmit(onSubmit)}>
            <fieldset>
              <legend className="title">你的專屬存錢計畫</legend>
              <Controller
                name="code"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                  >
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
