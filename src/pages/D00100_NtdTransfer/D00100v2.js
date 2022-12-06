/* eslint-disable react/jsx-max-props-per-line */
/* eslint-disable react/jsx-first-prop-new-line */
/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { RadioGroup } from '@material-ui/core';

import Layout from 'components/Layout/Layout';
import {
  FEIBTabContext, FEIBTabList, FEIBTab, FEIBTabPanel,
  FEIBInputLabel, FEIBInput, FEIBErrorMessage,
  FEIBButton, FEIBRadioLabel, FEIBRadio, FEIBSelect, FEIBOption,
} from 'components/elements';
import AccountOverview from 'components/AccountOverview/AccountOverview';
import DatePicker from 'components/DatePicker';
import DateRangePicker from 'components/DateRangePicker';
import Accordion from 'components/Accordion';
import BankCodeInput from 'components/BankCodeInput';
import MemberAccountCard from 'components/MemberAccountCard';

import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { showError, showInfo, showPrompt } from 'utilities/MessageModal';
import { loadFuncParams, startFunc, closeFunc } from 'utilities/AppScriptProxy';
import { numberToChinese } from 'utilities/Generator';
import { getAccountsList } from 'utilities/CacheData';
import { ChangeMemberIcon } from 'assets/images/icons';
import { getAccountExtraInfo } from './api';
import TransferWrapper from './D00100.style';
import D00100AccordionContent from './D00100_AccordionContent';

/**
 * 轉帳首頁
 * @param {*} { state } 是由轉帳確認頁(D001001)或轉帳結果頁(D001002)在 goBack 時再傳回來的 Model 資料。
 */
const Transfer = (props) => {
  const { location } = props;
  const { state } = location;

  const history = useHistory();
  const dispatch = useDispatch();

  const [model, setModel] = useState();
  const [accounts, setAccounts] = useState();
  const [selectedAccountIdx, setSelectedAccountIdx] = useState();
  const [amountText, setAmountText] = useState(); // 轉帳金額的輸出文字。
  const [tranferQuota, setTranferQuota] = useState([10000, 30000, 50000]); // 目前帳戶的轉帳限額。

  const transTypes = ['一般轉帳', '常用轉帳', '約定轉帳', '社群轉帳'];
  const cycleWeekly = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const cycleMonthly = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 26, 27, 28, '29*', '30*', '31*'];
  const datePickerLimit = { // 用來限制設定選擇日期時的範圍。
    minDate: new Date(new Date().setDate(new Date().getDate() + 1)), // 預約轉帳只能從次日開始。
    maxDate: new Date(new Date().setFullYear(new Date().getFullYear() + 2)), // 二年內。
  };

  // Form 欄位名稱。
  const idTransOut = 'transOut';
  const idTransIn = 'transIn';
  const idTransType = 'transIn.type';
  const idTransInBank = 'transIn.bank';
  const idTransInAcct = 'transIn.account';
  const idAmount = 'amount';
  const idMode = 'booking.mode';
  const idMultiTimes = 'booking.multiTimes';
  const idTransDate = 'booking.transDate';
  const idTransRange = 'booking.transRange';
  const idCycleMode = 'booking.cycleMode';
  const idCycleTime = 'booking.cycleTiming';
  const idMemo = 'memo';

  /**
   * 表單資料驗證規則
   */
  const schema = yup.object().shape({
    transIn: yup.object().shape({
      type: yup.number().min(0).max(3).required(),
      bank: yup.string().when('type', (type, s) => ((type === 0) ? s.required() : s.nullable())),
      account: yup.string().when('type', (type, s) => ((type === 0) ? s.required().min(10).max(14) : s.nullable())),
      freqAcct: yup.object().when('type', (type, s) => ((type === 1) ? s.required() : s.nullable())),
      regAcct: yup.object().when('type', (type, s) => ((type === 2) ? s.required() : s.nullable())),
    }),
    amount: yup.string().required(),
    booking: yup.object().shape({
      mode: yup.number().min(0).max(1).required(),
      multiTimes: yup.string().required().length(1).oneOf(['1', '*']),
      transDate: yup.date().when(['mode', 'multiTimes'], (mode, multiTimes, s) => ((mode === 1 && multiTimes === '1') ? s.typeError('請指定交易日期') : s.nullable())),
      transRange: yup.array().transform((v) => (v ?? [])).when('multiTimes', (multiTimes, s) => ((multiTimes === '*') ? s.length(2) : s.nullable())),
      cycleMode: yup.number().when('multiTimes', (multiTimes, s) => ((multiTimes === '*') ? s.required().min(1).max(2) : s.nullable())),
      cycleTiming: yup.number().when('multiTimes', (multiTimes, s) => ((multiTimes === '*')
        ? s.when('cycleMode', (cycleMode, s1) => ((cycleMode === 1)
          ? s1.required().min(0).max(6)
          : s1.required().min(1).max(31)))
        : s.nullable())),
    }),
  });

  /**
   *- 表單資料
   */
  // eslint-disable-next-line object-curly-newline
  const { control, reset, handleSubmit, getValues, setValue, watch, trigger, setFocus, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      transOut: {
        account: null, // 轉出帳號
        balance: null, // 帳戶餘額
        freeTransfer: null, // 免費跨轉次數
        freeTransferRemain: null, // 免費跨轉剩餘次數
      },
      transIn: { // 轉入帳戶
        type: 0, // 0.一般轉帳, 1.常用轉帳, 2.約定轉帳, 3.社群轉帳
        bank: undefined, // 轉入帳戶的銀行
        account: undefined, // 轉入帳戶的帳號
        freqAcct: undefined, // 目前選擇的 常用帳號
        regAcct: undefined, // 目前選擇的 約定帳號
      },
      amount: undefined, // 轉出金額
      booking: { // 「預約轉帳」資訊
        mode: 0, // 0.立即轉帳, 1.預約轉帳
        multiTimes: '1', // 1.單次, *.多次
        transDate: null, // 轉帳日期，multiTimes='1'時。
        transRange: null, // 轉帳日期區間，multiTimes='*'時。
        cycleMode: 1, // 交易頻率: 1.每周, 2.每月
        cycleTiming: 0, // 交易週期: 〔 0~6: 周日~周六 〕或〔 1~31: 每月1~31〕, 月底(29/30/31)會加警示。
        transTimes: 0, // 預約轉帳次數。 【註】在 onSubmit 時計算並寫入。
      },
      memo: undefined, // 備註
    },
  });

  /* 透過 startFunc 啟動轉帳時，由前一個功能提供的參數。
    啟動參數：{
      transOut: 轉出帳號,
      transIn: { bank: 轉入銀行, account: 轉入帳號 },
      amount: 轉帳金額,
      memo: 備註,
    }
    NOTE 只要其中的欄位不是 null，就鎖定不允許變更。
  */
  const [startFuncParams, setStartFuncParams] = useState();

  /**
   * 初始化
   */
  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    // 取得帳號基本資料，不含跨轉優惠次數，且餘額「非即時」。
    // NOTE 使用非同步方式更新畫面，一開始會先顯示帳戶基本資料，待取得跨轉等資訊時再更新一次畫面。
    getAccountsList('MSC', (accts) => {
      setAccounts(accts.filter((acct) => acct.transable)); // 排除 transable = false 的帳戶。
    });

    // 當啟動頁面時有提供 state 時，會在建立 model 時以 useState 的預設值填入。
    let keepData = state;
    if (!state) {
      keepData = await loadFuncParams();
      if (keepData) {
        if (typeof keepData === 'object') {
          if (keepData.response) {
            // 將 D00500/D00600 的傳回值，寫回 Model
            if (keepData.transIn.type === 1) keepData.transIn.freqAcct = keepData.response;
            if (keepData.transIn.type === 2) keepData.transIn.regAcct = keepData.response;
            // Swiper 切回原本的 Slide
            // selectedAccountIdx 在 startFunc 前寫入 model 一起保存(暫存)，所以取回後就從 model 中移除。
            setSelectedAccountIdx(keepData.selectedAccountIdx);
            delete keepData.selectedAccountIdx;
            delete keepData.response;
          } else if (typeof keepData.transOut === 'string') {
            // 取出透過 startFunc 啟動轉帳時，由前一功能提供的參數。
            setStartFuncParams(keepData);
            return; // 避免 HookForm 在 reset 誤將 keepData 填入。
          } else {
            // 若還沒有選擇常用/約定帳號，而且原本也沒有值，則切回一般轉帳。
            const { freqAcct, regAcct } = keepData?.transIn;
            if (!freqAcct && !regAcct) keepData.transIn.type = 0;
            setSelectedAccountIdx(0);
          }
          setModel(keepData);
        }
      } else {
        // 未經由 Function Controller 取得資料時，延用原本的 model
        keepData = model;
      }
    }

    // 將 Model 資料填入 UI Form 的對應欄位。
    if (keepData) reset(keepData);
  }, []);

  /**
   * 初始化帳戶卡；因為 Swiper 無法與 HookForm 綁定，所以要自行處理。
   */
  useEffect(async () => {
    if (!accounts) return;

    dispatch(setWaittingVisible(false));
    if (accounts.length === 0) {
      await showPrompt('您沒有任何可進行轉帳的台幣存款帳戶，請在系統關閉此功能後，立即申請。', () => closeFunc());
    } else handleAccountChanged(selectedAccountIdx ?? 0);
  }, [accounts]);

  /**
   * 處理啟動參數，包含只保留指定帳號，以及將預設值資填入畫面。
   * @param {*} params 前一功能提供的參數。
   */
  const handleStartParams = async (params) => {
    if (!accounts) {
      console.log('*** 等 accounts 載入...', accounts);
      return null;
    }

    const transOutAccount = params.transOut ?? '';
    delete params.transOut; // 因為在將 params 寫入 model 時，不需要此欄位。
    // 若啟動參數有指定預設帳號(transOut)時，則不能切換轉出帳號，只保留此帳號卡。
    // 若未指定時，則維持所有帳號供使用者選擇。
    if (transOutAccount !== '') {
      const index = accounts.findIndex((acct) => acct.accountNo === transOutAccount);
      if (index < 0) {
        // 查無指定的轉帳帳號，立即返回closeFunc。
        await showError(`您的帳戶中並沒有指定的轉出帳號(${transOutAccount})，請洽客服人員。`, () => closeFunc());
        return null;
      }
      setAccounts([accounts[index]]);
    }
    setSelectedAccountIdx(0);

    return {
      ...getValues(),
      ...params,
      transIn: {
        ...params.transIn,
        type: 0,
        bank: params.transIn?.bank ?? (params.transIn?.account ? '805' : ''), // 尚有指定帳號、沒有銀行代碼使；預設為遠銀.
      },
    };
  };

  /**
   * 當取得前一功能提供的參數後，立即進行處理。
   */
  useEffect(async () => {
    const newModel = await handleStartParams(startFuncParams);
    if (newModel) reset(newModel);
  }, [startFuncParams]);

  /**
   * 將 HookForm 的資料寫回 model
   * @param {*} values
   * @returns
   */
  const updateModel = (values) => {
    const newModel = {
      ...model,
      ...values,
    };
    return newModel;
  };

  /**
   * 保存資料，進入確認頁。
   */
  const onSubmit = async (values) => {
    const newModel = updateModel(values);
    const { amount, booking } = newModel;

    // 單筆轉帳限額檢查
    if (amount > tranferQuota[0]) {
      const quota = new Intl.NumberFormat('en-US').format(tranferQuota[0]);
      await showInfo(`您的轉帳金額已超過單筆轉帳限額(${quota})上限；若您需要提高轉帳額度，可透過自然人憑證完成帳戶升級成【一類帳戶】。`);
      setFocus(idAmount);
      return;
    }

    // idCycleTime 防呆，調整起始日期
    const transTimes = checkTransDate(booking);
    if (booking.mode === 1 || transTimes <= 0) { // 若立即轉帳則不需要檢查。
      await showInfo('您指定的交易時間範圍內，並不會有任何轉帳交易發生！請重新調整交易時間範圍、交易頻率或週期。');
      setFocus(idTransRange);
    }

    const param = {
      ...newModel,
      booking: {
        ...newModel.booking,
        transTimes, // 預約轉帳次數。
      },
    };

    // 進行轉帳確認。
    history.push('/D001001', param);
  };

  /**
   * 計算預約交易日期區間將會發生的轉帳次數。
   * @returns 預估的轉帳次數。
   */
  const checkTransDate = (booking) => {
    if (booking.multiTimes === '1') return 1;

    // transRange: 轉帳日期區間，multiTimes='*'時。
    // cycleMode: 交易頻率: 1.每周, 2.每月
    // cycleTiming: 交易週期: 〔 0~6: 周日~周六 〕或〔 1~28: 每月1~31 〕
    const { cycleMode, cycleTiming, transRange } = booking;
    const startDate = new Date(transRange[0]); // 要另建新日期物件，否則原值會被改掉。
    const endDate = new Date(transRange[1]); // 同上。

    if (cycleMode === 1) {
      // 當起(迄)日不是指定的WeekDay時，計算差異天數，將起(迄)日改為第一(最後)個預約轉帳日，再計算次數。
      let diffDays = (7 + (cycleTiming - startDate.getDay())) % 7;
      if (diffDays >= 0) startDate.setDate(startDate.getDate() + diffDays);

      diffDays = (7 + (endDate.getDay() - cycleTiming)) % 7;
      if (diffDays >= 0) endDate.setDate(endDate.getDate() - diffDays);

      const times = (endDate - startDate) / (7 * 24 * 60 * 60 * 1000) + 1;
      return times;
    }

    // 計算按月轉帳的總次數。
    let times = 0;
    for (let d0 = new Date(startDate); ;) {
      const d1 = new Date(d0);
      d1.setDate(cycleTiming);
      if (d1 >= d0) {
        if (d1 > endDate) break;
        times++;
      }
      // 下個月的起日，要用 1日是因為，要避免次月沒有 29/30/31 時，月份會再進位的問題。
      d0.setDate(1);
      d0.setMonth(d0.getMonth() + 1);
    }
    return times;
  };

  /**
   * 當切換轉帳類型時，變更 HookForm 的值；並在尚未指定常用/約定轉入對象時，自動開啟選擇常用/約定轉入對象的功能。
   * @param {*} e UIElement event data, 若當 null 表示手動強制執行。
   * @param {*} id 0.一般轉帳, 1.常用轉帳, 2.約定轉帳, 3.社群轉帳
   */
  const onTransTypeChanged = async (e, id) => {
    const type = parseInt(id, 10);
    setValue(idTransType, type);

    const values = getValues();
    // 尚未指定常用/約定轉入對象時，自動開啟選擇常用/約定轉入對象的功能。
    let funcId = null;
    const { freqAcct, regAcct } = values.transIn;
    if (type === 1 && (!freqAcct || !e)) funcId = 'D00500';
    if (type === 2 && (!regAcct || !e)) funcId = 'D00600';
    if (funcId !== null) {
      const selectAccount = (type === 1) ? freqAcct : regAcct; // 指定預設為已選取狀態的帳號
      const params = {
        selectorMode: true, // 隱藏 Home 圖示
        defaultAccount: selectAccount?.accountNo,
        bindAccount: values?.transOut.account, // 提供給 D00600 只列出此帳號設定的約轉帳號清單。
      };
      const newModel = {
        ...updateModel(values),
        selectedAccountIdx, // 用在返回時將 Swiper 切回目前帳號
      };

      dispatch(setWaittingVisible(true));
      await startFunc(funcId, params, newModel);
    }
  };

  /**
   * 切換交易頻率時，將交易週期設為第一項。
   */
  useEffect(() => {
    const { booking } = getValues();
    // 交易頻率(cycleMode): 1.每周, 2.每月
    // 交易週期(cycleTiming): 〔 0~6: 周日~周六 〕或〔 1~31: 每月1~31 〕
    setValue(idCycleTime, (booking.cycleMode === 1) ? 0 : 1);
  }, [watch(idCycleMode)]);

  /**
   * 調整輸出金額顯示格式。
   */
  useEffect(() => {
    // 金額加千分號
    const { amount } = getValues();

    const number = amount ? amount.toString().replace(/[^\d]/g, '') : ''; // 將所有(g)非數字(^\d)字元，全部移除。
    const formater = new Intl.NumberFormat('en-US');
    const newValue = formater.format(number);
    if (newValue !== '0') {
      setValue(idAmount, parseInt(number, 10));
      setAmountText(`$${newValue} ${numberToChinese(amount)}`);
    } else {
      setValue(idAmount, '');
      setAmountText(null);
    }
  }, [watch(idAmount)]);

  /**
   * 轉入帳戶區(常用/約定/社群轉帳)
   */
  const TransInAccountSelector = () => {
    const { freqAcct, regAcct } = getValues(idTransIn);
    return (
      <>
        {/* 1.常用轉帳頁籤 */}
        <FEIBTabPanel value="1">
          <FEIBInputLabel>轉入帳號</FEIBInputLabel>
          <div className="memberAccountCardArea">
            {freqAcct ? (
              <MemberAccountCard
                memberId={freqAcct.memberId}
                name={freqAcct.accountName}
                bankName={freqAcct.bankName}
                bankNo={freqAcct.bankId}
                account={freqAcct.accountNo}
                noBorder
              />
            ) : null}
            <div className="changeMemberButton" onClick={() => onTransTypeChanged(null, 1)}>
              <ChangeMemberIcon />
            </div>
          </div>
        </FEIBTabPanel>

        {/* 2.約定轉帳頁籤 */}
        <FEIBTabPanel value="2">
          <FEIBInputLabel>轉入帳號</FEIBInputLabel>
          <div className="memberAccountCardArea">
            {regAcct ? (
              <MemberAccountCard
                memberId={regAcct.memberId}
                name={regAcct.accountName}
                bankName={regAcct.bankName}
                bankNo={regAcct.bankId}
                account={regAcct.accountNo}
                noBorder
              />
            ) : null}
            <div className="changeMemberButton" onClick={() => onTransTypeChanged(null, 2)}>
              <ChangeMemberIcon />
            </div>
          </div>
        </FEIBTabPanel>

        {/* TODO 3.社群轉帳頁籤 */}
        <FEIBTabPanel value="3">
          <p>社群轉帳</p>
        </FEIBTabPanel>
      </>
    );
  };

  /**
   * 切換帳戶卡，變更 HookForm 轉出帳號相關資料，以及轉帳額度。
   */
  const handleAccountChanged = async (index) => {
    if (!accounts) return; // 頁面初始化時，不需要進來。

    const account = accounts[index];
    // 若還沒有取得 免費跨轉次數 則立即補上。
    if (!account.freeTransfer) {
      const info = await getAccountExtraInfo(account.accountNo);
      accounts[index] = {
        ...account,
        ...info,
      };
    }

    setValue(idTransOut, {
      account: account.accountNo, // 轉出帳號
      alias: account.alias, // 帳戶名稱，若有暱稱則會優先用暱稱; 會用在確認及執行這二頁。
      balance: account.balance, // 帳戶餘額
      freeTransfer: account.freeTransfer, // 免費跨轉次數
      freeTransferRemain: account.freeTransferRemain, // 免費跨轉剩餘次數
    });

    // 單筆轉帳限額 (用於設置至轉出金額驗證規則)
    // dgType = 帳戶類別('  '.非數存帳號, '11'.臨櫃數存昇級一般, '12'.一之二類, ' 2'.二類, '32'.三之二類)
    let quota = [50000, 100000, 200000]; // 適用：一、二 類
    if (account.dgType === '32') quota = [10000, 30000, 50000];
    // else if (account.dgType === ' 2') quota = [50000, 100000, 200000];
    // else if (['11', '12'].indexOf(account.dgType)) quota = [50000, 100000, 200000];
    setTranferQuota(quota);
  };
  useEffect(() => { handleAccountChanged(selectedAccountIdx); }, [selectedAccountIdx]);

  /**
   * 單筆轉帳限額 (用於設置至轉出金額驗證規則)
   */
  const showTranferQuota = () => {
    const { transIn } = getValues;
    if (transIn?.type !== '2') {
      const formater = new Intl.NumberFormat('en-US');
      const quota = tranferQuota.map((q) => formater.format(q)).join('/');
      return (<p className="notice">{`單筆/當日/當月非約定轉帳剩餘額度: ${quota}`}</p>);
    }
    return null;
  };

  /**
   * 輸出頁面
   */
  return accounts ? (
    <Layout title="台幣轉帳">
      <TransferWrapper $insufficient={getValues(idTransOut).balance <= 0}>
        <AccountOverview
          transferMode
          accounts={accounts}
          defaultSlide={selectedAccountIdx}
          onAccountChanged={setSelectedAccountIdx}
        />

        {/* {watch(idTransOut).balance <= 0 ? (<p className="insufficient">(帳戶餘額不足)</p>) : null} */}
        <div className="transferServicesArea">
          <form>
            <FEIBTabContext value={String(watch(idTransType))}>
              <FEIBTabList onChange={onTransTypeChanged} $type="fixed" $size="small" className="tabList">
                {/* 0.一般轉帳, 1.常用轉帳, 2.約定轉帳, 3.社群轉帳 */}
                {transTypes.map((name, n) => (
                  // 當 startFuncParams 有預設轉入帳號時，不允許變更。
                  <FEIBTab key={name} label={name} value={String(n)} disabled={((n !== 0 && startFuncParams?.transIn?.account) || n === 3)} />
                ))}
              </FEIBTabList>

              {/* 轉入帳戶區(一般轉帳) */}
              <FEIBTabPanel value="0">
                {/* 當 startFuncParams 有預設轉入帳號時，不允許變更 */}
                <BankCodeInput control={control} name={idTransInBank} value={getValues(idTransInBank)} setValue={setValue} trigger={trigger}
                  readonly={startFuncParams?.transIn?.bank}
                  errorMessage={errors?.transIn?.bank?.message}
                />
                <div>
                  <FEIBInputLabel htmlFor={idTransInAcct}>轉入帳號</FEIBInputLabel>
                  <Controller control={control} name={idTransInAcct} defaultValue={getValues(idTransInAcct)}
                    render={({ field }) => (
                      // 當 startFuncParams 有預設轉入帳號時，不允許變更
                      <FEIBInput {...field} placeholder="請輸入" inputMode="numeric" error={!!errors?.transIn?.account}
                        inputProps={{ maxLength: 14, autoComplete: 'off', disabled: startFuncParams?.transIn?.account }}
                      />
                    )}
                  />
                  <FEIBErrorMessage>{errors.transIn?.account?.message}</FEIBErrorMessage>
                </div>
              </FEIBTabPanel>
              {/* 轉入帳戶區(常用/約定/社群) */}
              {TransInAccountSelector()}
            </FEIBTabContext>

            {/* 轉帳金額 */}
            <div className="customSpace">
              <FEIBInputLabel htmlFor={idAmount}>金額</FEIBInputLabel>
              <Controller control={control} name={idAmount} defaultValue={getValues(idAmount)}
                render={({ field }) => (
                  <div>
                    {/* 當 startFuncParams 有預設轉帳金額時，不允許變更 */}
                    <FEIBInput {...field} placeholder="$0（零元）" inputMode="numeric" error={!!errors?.amount}
                      inputProps={{ maxLength: 9, autoComplete: 'off', disabled: startFuncParams?.amount }}
                    />
                    <div className="balanceLayout">{amountText}</div>
                  </div>
                )}
              />
              <FEIBErrorMessage>{errors.amount?.message}</FEIBErrorMessage>
              {showTranferQuota()}
            </div>

            {/* 轉帳類型(0.立即轉帳, 1.預約轉帳) */}
            <div className="transferMode">
              <FEIBInputLabel>轉帳類型</FEIBInputLabel>
              <Controller control={control} name={idMode} defaultValue={getValues(idMode)}
                render={({ field }) => (
                  <RadioGroup {...field} row aria-label="轉帳類型" name={idMode} onChange={(e) => setValue(idMode, parseInt(e.target.value, 10))}>
                    <FEIBRadioLabel value={0} control={<FEIBRadio />} label="立即" className="customWidth" />
                    <FEIBRadioLabel value={1} control={<FEIBRadio />} label="預約" />
                  </RadioGroup>
                )}
              />
              {(watch(idMode) === 1) ? (
                <div className="reserveOption">
                  <FEIBInputLabel htmlFor={idMultiTimes}>轉帳次數</FEIBInputLabel>
                  <Controller control={control} name={idMultiTimes} defaultValue={getValues(idMultiTimes)}
                    render={({ field }) => (
                      <FEIBSelect {...field} name={idMultiTimes}>
                        <FEIBOption value="1">一次</FEIBOption>
                        <FEIBOption value="*">多次</FEIBOption>
                      </FEIBSelect>
                    )}
                  />
                  {watch(idMultiTimes) === '1' ? (
                    <>
                      <FEIBInputLabel className="datePickerLabel">交易時間</FEIBInputLabel>
                      <DatePicker control={control} name={idTransDate} {...datePickerLimit} defaultValue={getValues(idTransDate)} />
                      <FEIBErrorMessage>{errors.booking?.transDate?.message}</FEIBErrorMessage>
                    </>
                  ) : (
                    <div className="dateRangePickerArea">
                      <DateRangePicker control={control} name={idTransRange} label="交易時間" {...datePickerLimit} defaultValue={getValues(idTransRange)} />
                      <FEIBErrorMessage>{errors.booking?.transRange?.message}</FEIBErrorMessage>

                      {/* 設定交易頻率(1.每周, 2.每月)及交易週期 */}
                      <div className="reserveMoreOption">
                        <div>
                          <FEIBInputLabel htmlFor={idCycleMode}>交易頻率</FEIBInputLabel>
                          <Controller control={control} name={idCycleMode} defaultValue={getValues(idCycleMode)}
                            render={({ field }) => (
                              <FEIBSelect {...field} name={idCycleMode}>
                                <FEIBOption value={1}>每週</FEIBOption>
                                <FEIBOption value={2}>每月</FEIBOption>
                              </FEIBSelect>
                            )}
                          />
                          <FEIBErrorMessage>{errors.booking?.cycleMode?.message}</FEIBErrorMessage>
                        </div>
                        <div>
                          <FEIBInputLabel htmlFor={idCycleTime}>交易週期</FEIBInputLabel>
                          <Controller control={control} name={idCycleTime} defaultValue={getValues(idCycleTime)}
                            render={({ field }) => (
                              <FEIBSelect {...field} name={idCycleTime}>
                                {[cycleWeekly, cycleMonthly][getValues(idCycleMode) - 1].map((s, n) => {
                                  // 交易週期: 〔 0~6: 周日~周六 〕或〔 1~28: 每月1~31 〕
                                  const value = n + getValues(idCycleMode) - 1;
                                  return (<FEIBOption key={value} value={value}>{s}</FEIBOption>);
                                })}
                              </FEIBSelect>
                            )}
                          />
                          <FEIBErrorMessage>
                            {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                            {watch(idCycleTime) >= 29 ? (<>* 可能順延至次月一日<br /></>) : null}
                            {errors.booking?.cycleTiming?.message}
                          </FEIBErrorMessage>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // 為了保持與備註間的間距。
                <p style={{ height: '1.8rem'}} />
              )}
            </div>

            {/* 備註 */}
            <div>
              <FEIBInputLabel htmlFor={idMemo}>備註</FEIBInputLabel>
              <Controller control={control} name={idMemo} defaultValue={getValues(idMemo)}
                render={({ field }) => (
                  <FEIBInput {...field} placeholder="請輸入" inputProps={{ maxLength: 20, autoComplete: 'off' }} />
                )}
              />
              <FEIBErrorMessage />
            </div>
          </form>

          <Accordion space="both">
            <D00100AccordionContent />
          </Accordion>
          <p className="warningText">陌生電話先求證，轉帳匯款須謹慎</p>
          <div className="transferButtonArea">
            <FEIBButton onClick={handleSubmit(onSubmit)}>轉帳</FEIBButton>
          </div>
        </div>
      </TransferWrapper>
    </Layout>
  ) : null;
};

export default Transfer;
