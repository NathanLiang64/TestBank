/* eslint-disable react/jsx-max-props-per-line */
/* eslint-disable react/jsx-first-prop-new-line */
/* eslint-disable no-use-before-define */
import React, {
  useCallback, useEffect, useReducer, useState,
} from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import { useForm, Controller, useController } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { RadioGroup } from '@material-ui/core';

import Layout from 'components/Layout/Layout';
import {
  FEIBTabContext, FEIBTabList, FEIBTab, FEIBTabPanel,
  FEIBInputLabel, FEIBInput, FEIBErrorMessage,
  FEIBButton, FEIBRadioLabel, FEIBRadio, FEIBSelect, FEIBOption, FEIBHintMessage,
} from 'components/elements';
import AccountOverview from 'components/AccountOverview/AccountOverview';
import DatePicker from 'components/DatePicker';
import DateRangePicker from 'components/DateRangePicker';
import Accordion from 'components/Accordion';
import BankCodeInput from 'components/BankCodeInput';
import MemberAccountCard from 'components/MemberAccountCard';

import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import {
  showCustomPrompt, showError, showInfo, showPrompt,
} from 'utilities/MessageModal';
import { getQLStatus } from 'utilities/AppScriptProxy';
import { getAccountBonus, getAccountsList } from 'utilities/CacheData';
import { ChangeMemberIcon } from 'assets/images/icons';
import { useNavigation, loadFuncParams } from 'hooks/useNavigation';
import CurrencyInput from 'react-currency-input-field';
import { accountFormatter, numberToChinese } from 'utilities/Generator';
import { Func } from 'utilities/FuncID';
import TransferWrapper from './D00100.style';
import D00100AccordionContent from './D00100_AccordionContent';
import { isDifferentAccount } from './util';
import { checkIsAgreedAccount, getSettingInfo } from './api';

/**
 * 轉帳首頁
 * @param {*} { state } 是由轉帳確認頁(D001001)或轉帳結果頁(D001002)在 goBack 時再傳回來的 Model 資料。
 */
const Transfer = (props) => {
  const { location } = props;
  const { state } = location;
  const {startFunc, closeFunc} = useNavigation();

  const history = useHistory();
  const dispatch = useDispatch();
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const [model, setModel] = useState();
  const [accounts, setAccounts] = useState();
  const [selectedAccountIdx, setSelectedAccountIdx] = useState();
  const [notified, setNotified] = useState({});

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
      bank: yup.string().when('type', (type, s) => ((type === 0) ? s.required('請選擇銀行代碼') : s.nullable())),
      account: yup.string().when('type', (type, s) => ((type === 0)
        ? s.required('請輸入轉入帳號').min(10, '銀行帳號必定是由10~16個數字所組成')
          .max(16, '銀行帳號必定是由10~16個數字所組成').when('bank', {
            is: (val) => val === '805',
            then: yup.string().test('isDifferent', '轉入與轉出帳號不可相同', (value) => isDifferentAccount(value, model?.transOut.account)),
          }) : s.nullable())),
      freqAcct: yup.object().when('type', (type, s) => ((type === 1) ? s.shape({
        bankId: yup.string().required(),
        accountNo: yup.string().when('bankId', {
          is: (val) => val === '805',
          then: yup.string().test('isDifferent', '轉入與轉出帳號不可相同', (value) => isDifferentAccount(value, model?.transOut.account)),
        }),
      }) : s.nullable())),
      regAcct: yup.object().when('type', (type, s) => ((type === 2) ? s.required() : s.nullable())),
    }),
    amount: yup.number().moreThan(0, '請輸入轉帳金額').required('請輸入轉帳金額').typeError('請輸入轉帳金額'),
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
        alias: null, // TODO 帳戶別名
        freeTransfer: null, // 免費跨轉次數
        freeTransferRemain: null, // 免費跨轉剩餘次數
      },
      transIn: { // 轉入帳戶
        type: 0, // 0.一般轉帳, 1.常用轉帳, 2.約定轉帳, 3.社群轉帳
        bank: undefined, // 轉入帳戶的銀行
        account: '', // 轉入帳戶的帳號
        freqAcct: undefined, // 目前選擇的 常用帳號
        regAcct: undefined, // 目前選擇的 約定帳號
      },
      amount: '', // 轉出金額
      booking: { // 「預約轉帳」資訊
        mode: 0, // 0.立即轉帳, 1.預約轉帳
        multiTimes: '1', // 1.單次, *.多次
        transDate: null, // 轉帳日期，multiTimes='1'時。
        transRange: null, // 轉帳日期區間，multiTimes='*'時。
        cycleMode: 1, // 交易頻率: 1.每周, 2.每月
        cycleTiming: 0, // 交易週期: 〔 0~6: 周日~周六 〕或〔 1~31: 每月1~31〕, 月底(29/30/31)會加警示。
        transTimes: 0, // 預約轉帳次數。 【註】在 onSubmit 時計算並寫入。
      },
      memo: '', // 備註
    },
  });

  // 透過 startFunc 啟動轉帳時，由前一個功能提供的參數。
  // NOTE 只要其中的欄位不是 null，就鎖定不允許變更。
  const [startFuncParams, setStartFuncParams] = useState({
    transOut: null, // 轉出帳號,
    transIn: {
      bank: null, // 轉入銀行,
      account: null, // 轉入帳號
    },
    amount: 0, // 轉帳金額,
    memo: '', // 備註,
  });

  /**
   * 初始化
   */
  useEffect(async () => {
    dispatch(setWaittingVisible(true));

    // 取得帳號基本資料，不含跨轉優惠次數，且餘額「非即時」。
    // NOTE 使用非同步方式更新畫面，一開始會先顯示帳戶基本資料，待取得跨轉等資訊時再更新一次畫面。
    getAccountsList('MSC', async (accts) => { // M=臺幣主帳戶、C=臺幣子帳戶
      accts.forEach((acct) => { acct.balance = acct.details[0].balance; });
      setAccounts(accts);
      // 從 D00100_1 返回時會以 state 傳回原 model
      const mData = (state || await processStartParams(accts));
      setModel(mData);
      setSelectedAccountIdx(mData.selectedAccountIdx ?? 0); // Swiper 切回原本的 Slide

      // 將 Model 資料填入 UI Form 的對應欄位。
      // reset(mData);
      // 使用前值 formValues 避免所有 defaultValues 都被 mData 覆蓋掉
      reset((formValues) => ({...formValues, ...mData}));
      dispatch(setWaittingVisible(false));
    });
  }, []);

  /**
   * 處理 Function Controller 提供的啟動參數。
   * @param {[*]} accts
   * @returns {Promise<*>} 包含 startFunc 提供的參數的 Model 物件。
   */
  const processStartParams = async (accts) => {
    const params = await loadFuncParams();

    // 未經由 Function Controller 取得資料時，延用原本的 model
    if (!params) return getValues();

    // 有 response 表示是從 D00500/D00600 返回，response 是傳回值；而 params 就是當時的 model
    if (params.response) {
      if (params.transIn.type === 1) params.transIn.freqAcct = params.response;
      if (params.transIn.type === 2) params.transIn.regAcct = params.response;
      delete params.response;
      return params;
    }

    return await convertStartParamsToModel(accts, params);
  };

  /**
   * 將啟動參數轉為 Model 物件，包含只保留指定帳號，以及將預設值資填入畫面。
   * @param {[*]} accts
   * @param {*} params 前一功能提供的參數。
   * @returns {Promise<*>} 包含 startFunc 提供的參數的 Model 物件。
   */
  const convertStartParamsToModel = async (accts, params) => {
    let initModel;
    const transOutAccount = params.transOut ?? '';
    // 若啟動參數有指定預設帳號(transOut)時，則不能切換轉出帳號，只保留此帳號卡。
    // 若未指定時，則維持所有帳號供使用者選擇。
    if (transOutAccount.constructor === String && !!transOutAccount) { // NOTE 用建構式來判斷資料型別！
      const index = accts.findIndex((acct) => acct.accountNo === transOutAccount);
      if (index < 0) {
        // 查無指定的轉帳帳號，立即返回closeFunc。
        await showError(`您的帳戶中並沒有指定的轉出帳號(${transOutAccount})，請洽客服人員。`, () => closeFunc());
        return null;
      }

      // 從其他功能(C00300)啟動轉帳時提供的參數。
      // { transOut: 預設轉出帳號 }
      setStartFuncParams(params); // 為了鎖住欄位，所以要另外保存下來。

      initModel = getValues(); // 雖然此時Form並沒有資料，但可以為傳回的 Model 建立屬性，使UI不會出錯
      initModel.selectedAccountIdx = index;

      // 將只有帳號字串，改為 model 的 transOut 物件。
      initModel.transOut.account = transOutAccount;
    } else {
      // 從 QRCode/D00500/D00600 返回時，才會進這段邏輯。
      const {transIn} = params;
      if (!transIn.freqAcct && !transIn.regAcct) transIn.type = 0;
      initModel = params;
    }
    return initModel;
  };

  /**
   * 保存資料，進入確認頁。
   */
  const onSubmit = async (values) => {
    const newModel = {
      ...model,
      ...values,
      transOut: model.transOut, // NOTE 因為在切換帳戶卡時，會取得餘額等資訊。
    };
    const {
      booking, transIn, transOut,
    } = newModel;

    /**
     * ======== 檢查規則 ========
     * 選擇約定帳號 Tab 時，
     * 1. 檢查是否超過單筆/當日限額
     * 2. 檢查 idCycleTime
     *
     * 選擇一般轉帳/常用帳號 Tab 時，
     *  1. 檢查轉入帳號是否為「非約定帳號」，若確認非約定帳號則進行下方檢查
     *      1-1 檢查是否裝置綁定
     *      1-2 檢查是否有非約轉功能
     *  2. 檢查是否超過單筆/當日限額
     *  3. 檢查 idCycleTime
     */
    let isAgreedAccount = null;

    // 若選擇非約定轉帳（transIn.type!==2)時
    if (transIn.type !== 2) {
      // 檢查流程 1. 仍需檢查轉入帳號是否屬於約定帳號;
      isAgreedAccount = await checkIsAgreedAccount(transOut.account, transIn);

      if (!isAgreedAccount) {
        // 檢查流程 1-1. 檢查裝置綁定狀態
        const { QLStatus } = await getQLStatus();
        if (QLStatus !== 1 && QLStatus !== 2) {
          showCustomPrompt({
            message: '無裝置認證，請先進行「APP裝置認證(快速登入設定)」，或致電客服。',
            okContent: '立即設定',
            onOk: () => startFunc(Func.T002.id, null, model),
            onCancel: () => {},
          });
          return;
        }

        // 檢查流程 1-2. 再檢查是否有設定非約轉
        const { status } = await getSettingInfo(); // NOTE 是否將該資訊進行 cache?
        if (status !== 3) {
          showCustomPrompt({
            message: '無權限，請先進行「非約定轉帳設定」，或致電客服。',
            okContent: '立即設定',
            onOk: () => startFunc(Func.T003.id, null, model),
            onCancel: () => {},
          });
          return;
        }
      }
    }

    // 今日限額與單筆限額檢查
    const aboveQuota = checkQuota({...newModel, isAgreedAccount});
    if (aboveQuota) {
      const formatedQuota = new Intl.NumberFormat('en-US').format(aboveQuota.quota);
      // TODO 待確認文字敘述正確性
      if (aboveQuota.isAgree) await showInfo(`${aboveQuota.isSelf ? '本行' : '跨行'}約定帳戶，${aboveQuota.type}轉帳金額上限為${formatedQuota}`);
      else await showInfo(`您的轉帳金額已超過${aboveQuota.type}轉帳限額(${formatedQuota})上限；若您需要提高轉帳額度，可透過自然人憑證完成帳戶升級成【一類帳戶】。`);
      setFocus(idAmount);
      return;
    }

    // idCycleTime 防呆，調整起始日期
    const transTimes = checkTransDate(booking);
    if (booking.mode === 1 && transTimes <= 0) { // 若立即轉帳則不需要檢查。
      await showInfo('您指定的交易時間範圍內，並不會有任何轉帳交易發生！請重新調整交易時間範圍、交易頻率或週期。');
      setFocus(idTransRange);
      return;
    }

    const param = {
      ...newModel,
      booking: {
        ...newModel.booking,
        transTimes, // 預約轉帳次數。
      },
      selectedAccountIdx,
    };
    setModel(param);

    // 進行轉帳確認。
    history.push('/D001001', param);
  };

  const checkQuota = ({
    transIn, transOut, isAgreedAccount, amount,
  }) => {
    const isAgree = transIn.type === 2 || isAgreedAccount;
    const isSelf = (transIn.type === 2 && transIn.regAcct?.bankId === '805') || isAgreedAccount?.bankId === '805';
    let [singleQuota, dayQuota] = transOut.quotaArray; // 非約定的[單筆額度,當日額度]

    if (isAgree) {
      dayQuota = isSelf ? transOut.agrdTfrSelfLimitLeft : transOut.agrdTfrInterLimitLeft;
      singleQuota = isSelf ? 5000000 : 2000000;
    }

    // 檢查單筆額度
    if (amount > singleQuota) {
      return {
        quota: singleQuota, type: '單筆', isAgree, isSelf,
      };
    }
    // 檢查當日額度
    if (amount > dayQuota) {
      return {
        quota: dayQuota, type: '當日', isAgree, isSelf,
      };
    }
    return null;
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
   * @param {*} selectType 0.一般轉帳, 1.常用轉帳, 2.約定轉帳, 3.社群轉帳
   */
  const onTransTypeChanged = async (e, selectType) => {
    const type = parseInt(selectType, 10);
    setValue(idTransType, type);

    const { transIn } = getValues();
    // 尚未指定常用/約定轉入對象時，自動開啟選擇常用/約定轉入對象的功能。
    let funcId = null;
    const { freqAcct, regAcct } = transIn;
    if (type === 1 && (!freqAcct || !e)) funcId = Func.D005.id;
    if (type === 2 && (!regAcct || !e)) funcId = Func.D006.id;
    if (funcId !== null) {
      const selectAccount = (type === 1) ? freqAcct : regAcct; // 指定預設為已選取狀態的帳號
      const params = {
        selectorMode: true, // 隱藏 Home 圖示
        defaultAccount: {accountNo: selectAccount?.accountNo, bankId: selectAccount?.bankId},
        bindAccount: model.transOut.account, // 提供給 D00600 只列出此帳號設定的約轉帳號清單。
      };
      model.transIn = transIn;
      model.selectedAccountIdx = selectedAccountIdx; // 用在返回時將 Swiper 切回目前帳號

      dispatch(setWaittingVisible(true));
      await startFunc(funcId, params, model);
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
            {freqAcct && (
              <MemberAccountCard
                memberId={freqAcct.memberId}
                name={freqAcct.accountName}
                subTitle={`${freqAcct?.bankName}(${freqAcct?.bankId}) ${accountFormatter(freqAcct?.accountNo, freqAcct?.bankId === '805')}`}
                noBorder
              />
            )}
            <div className="changeMemberButton" onClick={() => onTransTypeChanged(null, 1)}>
              <ChangeMemberIcon />
            </div>
          </div>
          <FEIBErrorMessage>{errors.transIn?.freqAcct?.accountNo.message}</FEIBErrorMessage>
        </FEIBTabPanel>

        {/* 2.約定轉帳頁籤 */}
        <FEIBTabPanel value="2">
          <FEIBInputLabel>轉入帳號</FEIBInputLabel>
          <div className="memberAccountCardArea">
            {regAcct && (
              <MemberAccountCard
                memberId={regAcct.memberId}
                name={regAcct.accountName}
                subTitle={`${regAcct?.bankName}(${regAcct?.bankId}) ${accountFormatter(regAcct?.accountNo, regAcct?.bankId === '805')}`}
                noBorder
              />
            )}
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
  useEffect(() => {
    if (!accounts) return; // 頁面初始化時，不需要進來。
    const account = accounts[selectedAccountIdx];
    model.transOut = {
      account: account.accountNo, // 轉出帳號
      alias: account.alias, // 帳戶名稱，若有暱稱則會優先用暱稱; 會用在確認及執行這二頁。
      balance: account.balance, // 帳戶餘額
    };

    // 若還沒有取得 免費跨轉次數 則立即補上。
    if (!model.transOut.freeTransfer) {
      // 下載 優存(利率/利息)資訊
      getAccountBonus(account.accountNo, (info) => {
        // NOTE dgType = 帳戶類別 (''.非數存帳號, '11'.臨櫃數存昇級一般, '12'.一之二類, ' 2'.二類, '32'.三之二類)
        let sLimitLeft = account.dgType === '32' ? 10000 : 50000;
        // NOTE 單筆額度不可比當日大
        if (sLimitLeft > info.dLimitLeft) sLimitLeft = info.dLimitLeft;
        model.transOut = {
          ...model.transOut,
          freeTransfer: (account.freeTransfer = info.freeTransfer),
          freeTransferRemain: (account.freeTransferRemain = info.freeTransferRemain),
          quotaArray: [sLimitLeft, info.dLimitLeft, info.mLimitLeft],
          agrdTfrSelfLimitLeft: info.agrdTfrSelfLimitLeft,
          agrdTfrInterLimitLeft: info.agrdTfrInterLimitLeft,
        };
        forceUpdate();
      });
    }
    if (!account.balance && !notified[account.accountNo]) {
      setNotified((prevObj) => ({ ...prevObj, [account.accountNo]: true }));
      showPrompt('您的帳戶餘額為0，無法進行轉帳');
    } else if (!account.transable && !notified[account.accountNo]) {
      setNotified((prevObj) => ({ ...prevObj, [account.accountNo]: true }));
      showPrompt('該帳戶目前沒有轉出權限');
    }
  }, [selectedAccountIdx]);

  /**
   * 單筆轉帳限額 (用於設置至轉出金額驗證規則)
   */
  const showTranferQuota = () => {
    const transInType = getValues(idTransType);
    if (transInType !== 2 && model && model.transOut?.quotaArray) {
      const formater = new Intl.NumberFormat('en-US');
      // const quota = tranferQuota.map((q) => formater.format(q)).join('/');
      const quota = model.transOut.quotaArray.map((q) => formater.format(q)).join('/');
      return (<p className="notice">{`單筆/當日/當月非約定轉帳剩餘額度: ${quota}`}</p>);
    }
    return null;
  };

  const CurrencyInputCustom = useCallback((prop) => {
    const { inputRef, ...other } = prop;
    const {field: {onChange}} = useController({name: idAmount, control});
    return (
      <CurrencyInput
        {...other}
        ref={(ref) => {
          inputRef(ref ? ref.inputElement : null);
        }}
        prefix="$"
        onValueChange={(e) => onChange(e ?? '')}
      />
    );
  }, []);

  /**
   * 輸出頁面
   */
  const checkDisabled = () => {
    if (!model?.transOut?.balance || model?.transOut?.balance <= 0) return true;
    if (!accounts || (selectedAccountIdx === undefined)) return true;
    return !accounts[selectedAccountIdx].transable;
  };

  return (
    <Layout fid={Func.D001} title="臺幣轉帳">
      <TransferWrapper $isDisabled={checkDisabled()}>
        <AccountOverview
          transferMode
          accounts={accounts}
          defaultSlide={selectedAccountIdx}
          onAccountChanged={(index) => {
            setSelectedAccountIdx(index);
            if (watch(idTransInAcct)) trigger(idTransInAcct);
          }}
        />

        {/* {model?.transOut.balance <= 0 ? (<p className="insufficient">(帳戶餘額不足)</p>) : null} */}
        <div className="transferServicesArea">
          <form>
            <FEIBTabContext value={String(watch(idTransType))}>
              <FEIBTabList onChange={onTransTypeChanged} $type="fixed" $size="small" className="tabList">
                {/* 0.一般轉帳, 1.常用轉帳, 2.約定轉帳, 3.社群轉帳 */}
                {transTypes.map((name, n) => (
                  // 當 startFuncParams 有預設轉入帳號時，不允許變更。
                  <FEIBTab key={name} label={name} value={String(n)} disabled={(n !== 0 && startFuncParams?.transIn?.account) || n === 3} />
                ))}
              </FEIBTabList>

              {/* 轉入帳戶區(一般轉帳) */}
              <FEIBTabPanel value="0">
                {/* 當 startFuncParams 有預設轉入帳號 或 帳戶餘額為零時，不允許變更 */}
                <BankCodeInput control={control} name={idTransInBank} value={getValues(idTransInBank)} setValue={setValue} trigger={trigger}
                  // 測試把 array.at 語法改成 accounts[selectedAccountIdx]
                  // readonly={startFuncParams?.transIn?.bank || !accounts?.at(selectedAccountIdx)?.balance}
                  readonly={startFuncParams?.transIn?.bank || !accounts || !accounts[selectedAccountIdx]?.balance}
                  errorMessage={errors?.transIn?.bank?.message}
                />
                <div>
                  <FEIBInputLabel htmlFor={idTransInAcct}>轉入帳號</FEIBInputLabel>
                  <Controller control={control} name={idTransInAcct}
                    render={({ field }) => (
                      // 當 startFuncParams 有預設轉入帳號時，不允許變更
                      <FEIBInput type="text" {...field} error={!!errors?.transIn?.account}
                        inputProps={{
                          placeholder: '請輸入',
                          maxLength: 16,
                          autoComplete: 'off',
                          disabled: startFuncParams?.transIn?.account,
                          inputMode: 'numeric',
                        }}
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
              <Controller control={control} name={idAmount}
                render={({ field }) => (
                  <div>
                    {/* 當 startFuncParams 有預設轉帳金額時，不允許變更 */}
                    <FEIBInput
                      // {...field}
                      value={field.value}
                      error={!!errors?.amount}
                      inputProps={{
                        placeholder: '請輸入金額',
                        maxLength: 9,
                        autoComplete: 'off',
                        disabled: startFuncParams?.amount,
                        inputMode: 'numeric',
                      }}
                      inputComponent={CurrencyInputCustom}
                    />
                  </div>
                )}
              />
              <FEIBErrorMessage>{errors.amount?.message}</FEIBErrorMessage>
              <FEIBHintMessage className="hint">{numberToChinese(watch(idAmount) ?? '')}</FEIBHintMessage>
              {showTranferQuota()}
            </div>

            {/* 轉帳類型(0.立即轉帳, 1.預約轉帳) */}
            <div className="transferMode">
              <FEIBInputLabel>轉帳類型</FEIBInputLabel>
              <Controller control={control} name={idMode}
                render={({ field }) => (
                  <RadioGroup {...field} row aria-label="轉帳類型" name={idMode} onChange={(e) => setValue(idMode, parseInt(e.target.value, 10))}>
                    <FEIBRadioLabel value={0} control={<FEIBRadio />} label="立即" className="customWidth" />
                    <FEIBRadioLabel value={1} control={<FEIBRadio />} label="預約" />
                  </RadioGroup>
                )}
              />
              {watch(idMode) === 1 ? (
                <div className="reserveOption">
                  <FEIBInputLabel htmlFor={idMultiTimes}>轉帳次數</FEIBInputLabel>
                  <Controller control={control} name={idMultiTimes}
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
                      <DatePicker control={control} name={idTransDate} {...datePickerLimit} />
                      <FEIBErrorMessage>{errors.booking?.transDate?.message}</FEIBErrorMessage>
                    </>
                  ) : (
                    <div className="dateRangePickerArea">
                      <DateRangePicker control={control} name={idTransRange} label="交易時間" {...datePickerLimit} />
                      <FEIBErrorMessage>{errors.booking?.transRange?.message}</FEIBErrorMessage>

                      {/* 設定交易頻率(1.每周, 2.每月)及交易週期 */}
                      <div className="reserveMoreOption">
                        <div>
                          <FEIBInputLabel htmlFor={idCycleMode}>交易頻率</FEIBInputLabel>
                          <Controller control={control} name={idCycleMode}
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
                          <Controller control={control} name={idCycleTime}
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
                <p style={{ height: '1.8rem' }} />
              )}
            </div>

            {/* 備註 */}
            <div>
              <FEIBInputLabel htmlFor={idMemo}>備註</FEIBInputLabel>
              <Controller control={control} name={idMemo}
                render={({ field }) => (
                  <FEIBInput
                    {...field}
                    placeholder="請輸入"
                    inputProps={{ maxLength: 20, autoComplete: 'off' }}
                  />
                )}
              />
              <FEIBErrorMessage />
            </div>
          </form>

          <Accordion space="both">
            <D00100AccordionContent />
          </Accordion>
          <p className="warningText">陌生電話先求證，轉帳交易須謹慎</p>
          <div className="transferButtonArea">
            <FEIBButton onClick={handleSubmit(onSubmit)}>轉帳</FEIBButton>
          </div>
        </div>
      </TransferWrapper>
    </Layout>
  );
};

export default Transfer;
