/* eslint-disable react/jsx-max-props-per-line */
/* eslint-disable react/jsx-first-prop-new-line */
/* eslint-disable no-use-before-define */
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Pagination } from 'swiper/core';
import { RadioGroup } from '@material-ui/core';

import Layout from 'components/Layout/Layout';
import {
  FEIBTabContext, FEIBTabList, FEIBTab, FEIBTabPanel,
  FEIBInputLabel, FEIBInput, FEIBErrorMessage, FEIBDatePicker,
  FEIBButton, FEIBRadioLabel, FEIBRadio, FEIBSelect, FEIBOption,
} from 'components/elements';
import DebitCard from 'components/DebitCard';
import DatePickerProvider from 'components/DatePickerProvider';
import DateRangePicker from 'components/DateRangePicker';
import Accordion from 'components/Accordion';
import BankCodeInput from 'components/BankCodeInput';
import MemberAccountCard from 'components/MemberAccountCard';

import { setWaittingVisible } from 'stores/reducers/ModalReducer';
import { loadFuncParams, startFunc } from 'utilities/AppScriptProxy';
import { numberToChinese } from 'utilities/Generator';
import { ChangeMemberIcon } from 'assets/images/icons';
import { getAccountsList, getDepositBonus } from './api';
import TransferWrapper from './D00100.style';

/* Swiper modules */
SwiperCore.use([Pagination]);

const Transfer = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [accounts, setAccounts] = useState([{
    accountNo: null,
    branchId: null,
    alias: null,
    balance: null,
    freeTransTotal: null,
    freeTransRemain: null,
  }]);

  const [model, setModel] = useState({
    transOut: {
      account: null, // 轉出帳號
      balance: null, // 帳戶餘額
      freeTransTotal: null, // 免費跨轉次數
      freeTransRemain: null, // 免費跨轉剩餘次數
    },
    transType: 0, // 0.一般轉帳, 1.常用轉帳, 2.約定轉帳, 3.社群轉帳
    transIn: { // 轉入帳戶
      bank: null, // 轉入帳戶的銀行
      account: null, // 轉入帳戶的帳號
      freqAcct: null, // 目前選擇的 常用帳號
      regAcct: null, // 目前選擇的 約定帳號
    },
    mode: 1, // 0.立即轉帳, 1.預約轉帳
    booking: { // 「預約轉帳」資訊
      multiTimes: '1', // 1.單次, *.多次
      transDate: null, // 轉帳日期，multiTimes='1'時。
      transRange: null, // 轉帳日期區間，multiTimes='*'時。
      cycleMode: 1, // 交易頻率: 1.每周, 2.每月
      cycleTime: 0, // 交易週期: 〔 0~6: 周日~周六 〕或〔 1~28: 每月1~31 〕 //  TODO 月底(28/29/30/31)待確認
    },
    amount: null, // 轉出金額
    memo: null, // 備註
  });
  const transType = ['一般轉帳', '常用轉帳', '約定轉帳', '社群轉帳'];
  const cycleWeekly = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const cycleMonthly = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    21, 22, 23, 24, 25, 26, 27, 28, '29*', '30*', '31*'];
  const datePickerLimit = {
    minDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    maxDate: new Date(new Date().setFullYear(new Date().getFullYear() + 2)),
  };

  // Form 欄位名稱。
  const idTransOut = 'transOut';
  const idTransType = 'transType';
  const idTransIn = 'transIn';
  const idTransInBank = 'transIn.bank';
  const idTransInAcct = 'transIn.account';
  const idMode = 'mode';
  const idBooking = 'booking';
  const idMultiTimes = 'booking.multiTimes';
  const idTransDate = 'booking.transDate';
  const idTransRange = 'booking.transRange';
  const idCycleMode = 'booking.cycleMode';
  const idCycleTime = 'booking.cycleTime';
  const idAmount = 'amount';
  const idAmountText = 'amountText';
  const idMemo = 'memo';

  /**
   * 表單資料驗證規則
   */
  const schema = yup.object().shape({
    // TODO 資料驗證
    amount: yup.string().required(),
  });

  /**
   *- 表單資料
   */
  // eslint-disable-next-line object-curly-newline
  const { control, register, handleSubmit, getValues, setValue, watch, trigger, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: model,
  });

  /**
   * 初始化
   */
  useEffect(async () => {
    console.log('Start...');
    dispatch(setWaittingVisible(true));

    let keepModel = await loadFuncParams();
    if (keepModel) {
      if (keepModel.response) {
        // 將 D00500/D00600 的傳回值，寫回 Model
        if (keepModel.transType === 1) keepModel.transIn.freqAcct = keepModel.response;
        if (keepModel.transType === 2) keepModel.transIn.regAcct = keepModel.response;
      } else {
        // 若還沒有選擇常用/約定帳號，而且原本也沒有值，則切回一般轉帳。
        const { freqAcct, regAcct } = keepModel.transIn;
        if (!freqAcct && !regAcct) keepModel.transType = 0;
      }
    } else {
      keepModel = model;
    }
    console.log('Model : ', keepModel);
    setModel(keepModel);

    // TODO 指定預設帳號時，不能切換轉出帳號，所以也不用 Call API 取資料。

    // TODO 載入暫存快取，沒有快取才要 Call API 下載。

    // 取得帳號基本資料，不含跨轉優惠次數，且餘額「非即時」。
    // NOTE 使用非同步方式更新畫面，一開始會先顯示 accounts 在宣告時的預設值。
    //      取得 API Response 才更新畫面。
    //      但 跨提、跨轉 的資訊，則是另外再以非同步方式取得。
    getAccountsList().then((accts) => {
      setAccounts(accts);
      updateAccountBonusInfo(accts);
    });
    // TODO 取得所有分行資訊。

    // // 是否開通 OTP 和 MOTP
    // getMotpStatusOnTransfer({ deviceId }).then((response) => {
    //   const { isOtpOpen, isMotpOpen } = response;
    //   setOtpStatus({ isOtpOpen: isOtpOpen === 'Y', isMotpOpen: isMotpOpen === 'Y' })
    // });

    setFormValues(keepModel);
    dispatch(setWaittingVisible(false));
  }, []);

  const updateAccountBonusInfo = (accts) => {
    accts.map(async (acct, n) => {
      const info = await getDepositBonus(acct.accountNo);
      acct.freeTransTotal = info.freeWithdrawal; // TODO 免費跨轉總次數
      acct.freeTransRemain = info.freeTransfer; // TODO 免費跨轉剩餘次數
      // 只有第一及最後一個帳號的 跨轉 資訊取得時，才需要更新畫面。
      // 第一個：為了讓使用者在最短時間內看到資料。
      // 最後一個：讓所有帳號卡牌都補上 跨提/轉 資料。
      if (n === 0 || n === (accts.length - 1)) {
        setAccounts([...accts]); // 強制更新畫面。
      }
    });
  };

  /**
   * 將 Model 資料填入 UI Form 的對應欄位。
   * @param {*} m Model
   */
  const setFormValues = (m) => {
    register(idAmountText); // 轉帳金額的輸出文字。

    setValue(idTransOut, m.transOut);
    setValue(idTransType, m.transType);
    setValue(idTransIn, m.transIn); // NOTE 不了解為何 freqAcct 及 regAcct 無法填入值，所以用指定的方式。
    setValue('transIn.freqAcct', m.transIn.freqAcct);
    setValue('transIn.regAcct', m.transIn.regAcct);
    setValue(idMode, m.mode);
    setValue(idBooking, m.booking);
    setValue(idAmount, m.amount);
    setValue(idMemo, m.memo);
  };

  /**
   *
   * @param {*} values
   * @returns
   */
  const updateModel = (values) => {
    const newModel = {
      ...model,
      ...values,
    };
    console.log('Model : ', newModel);
    return newModel;
  };

  /**
   * 保存資料，進入確認頁。 // TODO
   */
  const onSubmit = (values) => {
    const newModel = updateModel(values);

    // 保存資料 Cache 資料
    // call API confirmTransferDetail

    history.push('/D001001', newModel);
  };

  /**
   * 當切換轉帳類型時，變更 HookForm 的值；並在尚未指定常用/約定轉入對象時，自動開啟選擇常用/約定轉入對象的功能。
   * @param {*} e UIElement event data, 若當 null 表示手動強制執行。
   * @param {*} id 0.一般轉帳, 1.常用轉帳, 2.約定轉帳, 3.社群轉帳
   */
  const onTransTypeChanged = async (e, id) => {
    const type = parseInt(id, 10);
    setValue(idTransType, type);

    // 尚未指定常用/約定轉入對象時，自動開啟選擇常用/約定轉入對象的功能。
    let funcId = null;
    const { freqAcct, regAcct } = getValues(idTransIn);
    if (type === 1 && (!freqAcct || !e)) funcId = 'D00500';
    if (type === 2 && (!regAcct || !e)) funcId = 'D00600';
    if (funcId !== null) {
      const selectAccount = (type === 1) ? freqAcct : regAcct; // 指定預設為已選取狀態的帳號
      const params = {
        selectorMode: true, // 隱藏 Home 圖示
        defaultAccount: selectAccount,
      };
      const newModel = updateModel(getValues());

      await startFunc(funcId, params, newModel);
    }
  };

  /**
   * 切換交易頻率時，將交易週期設為第一項。
   */
  useEffect(() => {
    const { cycleMode } = getValues();
    // 交易頻率(cycleMode): 1.每周, 2.每月
    // 交易週期(cycleTime): 〔 0~6: 周日~周六 〕或〔 1~31: 每月1~31 〕
    setValue(idCycleTime, (cycleMode === 1) ? 0 : 1);
  }, [watch(idCycleMode)]);

  /**
   * 調整輸出金額顯示格式。
   */
  useEffect(() => {
    // 金額加千分號
    const { amount } = getValues();
    if (typeof (amount) === 'number') return;

    const number = amount ? amount.replace(/[^\d]/g, '') : ''; // 將所有(g)非數字(^\d)字元，全部移除。
    const formater = new Intl.NumberFormat('en-US');
    const newValue = formater.format(number);
    if (newValue !== '0') {
      setValue(idAmount, parseInt(number, 10));
      setValue(idAmountText, `$${newValue} ${numberToChinese(amount)}`);
    } else {
      setValue(idAmount, '');
      setValue(idAmountText, null);
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
                avatarSrc={freqAcct.memberId}
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
                avatarSrc={regAcct.memberId}
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

  const renderCards = (index, account) => (
    <SwiperSlide key={account.accountNo} data-index={index}>
      <DebitCard
        type="original"
        branch={account.branchId} // TODO 轉為分行名稱
        cardName={account.alias ?? '(未命名)'}
        account={account.accountNo}
        accountType={account.accountNo?.substring(3, 6) ?? '004'}
        balance={account.balance ?? '--'}
        transferLimit={account.freeTransTotal ?? '--'}
        transferRemaining={account.freeTransRemain ?? '--'}
        dollarSign="TWD"
      />
    </SwiperSlide>
  );

  useEffect(() => {
    // TODO 預設帳號
    onSwiperChanged({ activeIndex: 0 });
    const { transOut } = getValues();
    if (!transOut?.account) onSwiperChanged({ activeIndex: 0 });
  }, [accounts]);

  const onSwiperChanged = (e) => {
    const account = accounts[e.activeIndex];
    setValue(idTransOut, {
      account: account.accountNo, // 轉出帳號
      balance: account.balance, // 帳戶餘額
      freeTransTotal: account.freeTransTotal, // 免費跨轉次數
      freeTransRemain: account.freeTransRemain, // 免費跨轉剩餘次數
    });

    // TODO 單筆轉帳限額 (用於設置至轉出金額驗證規則)
    // const { balance, singleLimit } = account;
    // setAmountLimit({ deposit: balance, perTxn: singleLimit });
  };

  // const [swiper, setSwiper] = useState();
  // useEffect(() => {
  //   console.log('Swiper : ', swiper);
  //   if (swiper && !swiper.destoryed) {
  //     swiper.slideTo(1, 0, false);
  //   }
  // }, [swiper]);

  /**
   * 輸出頁面
   */
  console.log('Form Values : ', getValues());
  return (
    <Layout title="台幣轉帳">
      <TransferWrapper>
        <div className="userCardArea">
          <Swiper slidesPerView={1.14} spaceBetween={8} centeredSlides pagination onSlideChange={onSwiperChanged}>
            {accounts?.map((acct, n) => renderCards(n, acct))}
          </Swiper>
        </div>

        <div className="transferServicesArea">
          <form>
            <FEIBTabContext value={String(watch(idTransType))}>
              <FEIBTabList onChange={onTransTypeChanged} $type="fixed" $size="small" className="tabList">
                {/* 0.一般轉帳, 1.常用轉帳, 2.約定轉帳, 3.社群轉帳 */}
                {transType.map((name, n) => (<FEIBTab key={name} label={name} value={String(n)} />))}
              </FEIBTabList>

              {/* 轉入帳戶區(一般轉帳) */}
              <FEIBTabPanel value="0">
                <BankCodeInput control={control} name={idTransInBank} value={getValues(idTransInBank)} setValue={setValue} trigger={trigger} errorMessage={errors.transIn?.bank?.message} />
                <div>
                  <FEIBInputLabel htmlFor={idTransInAcct}>轉入帳號</FEIBInputLabel>
                  <Controller control={control} name={idTransInAcct} defaultValue={getValues(idTransInAcct)}
                    render={({ field }) => (
                      <FEIBInput {...field} placeholder="請輸入" inputProps={{ maxLength: 14, autoComplete: 'off' }} type="number" error={errors.transIn?.account?.message} />
                    )}
                  />
                  <FEIBErrorMessage>{errors.receivingAccount?.message}</FEIBErrorMessage>
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
                    <FEIBInput {...field} placeholder="$0（零元）" inputProps={{ maxLength: 9, autoComplete: 'off' }} inputMode="numeric" error={errors?.amount} />
                    <div className="balanceLayout">{getValues(idAmountText)}</div>
                  </div>
                )}
              />
              <FEIBErrorMessage>{errors.amount?.message}</FEIBErrorMessage>
              <p className="notice">單筆/當日/當月非約定轉帳剩餘額度: 10,000/20,000/40,000</p>
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
                      <Controller control={control} name={idTransDate} defaultValue={getValues(idTransDate)}
                        render={({ field }) => (
                          <DatePickerProvider>
                            <FEIBDatePicker {...field} name={idTransDate} {...datePickerLimit} />
                          </DatePickerProvider>
                        )}
                      />
                      <FEIBErrorMessage>{errors.booking?.transDate.message}</FEIBErrorMessage>
                    </>
                  ) : (
                    <div className="dateRangePickerArea">
                      <Controller control={control} name={idTransRange} defaultValue={getValues(idTransRange)}
                        render={({ field }) => (
                          <DateRangePicker {...field} name={idTransRange} label="交易時間" {...datePickerLimit} />
                        )}
                      />
                      <FEIBErrorMessage>{errors.booking?.transRange.message}</FEIBErrorMessage>

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
                          <FEIBErrorMessage>{errors.booking?.cycleMode.message}</FEIBErrorMessage>
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
                          {getValues(idCycleTime) >= 29 ? (<FEIBErrorMessage>* 可能順延至次月一日</FEIBErrorMessage>) : null}
                          <FEIBErrorMessage>{errors.booking?.cycleTime.message}</FEIBErrorMessage>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
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
            <ul>
              <li>對方收款帳號若為他行帳戶，您將自行負擔新臺幣15元之跨行轉帳手續費。</li>
              <li>如有設定收款密碼，收款人收款時將會需要一組您設定的收款密碼，建議以其他管道提供收款密碼給收款人。</li>
              <li>社群轉帳連結款項將於收款人收款時自您的帳戶中扣除，請確認您的帳戶可用餘額充足。</li>
              <li>社群轉帳連結被領取金額將占用您非約定轉帳限額(臨櫃開立帳戶、一類及二類數位存款帳戶：每帳戶單筆5萬、當日10萬、當月累積不超過20萬。三類數位存款帳戶：每帳戶單筆1萬、當日3萬、當月累積不超過5萬。)，如您非約定轉帳限額已達上限，收款人將有無法收款的情況發生。</li>
            </ul>
          </Accordion>
          <div className="transferButtonArea">
            <FEIBButton onClick={handleSubmit(onSubmit)}>轉帳</FEIBButton>
            <p className="notice">轉帳前多思考，避免被騙更苦惱</p>
          </div>
        </div>
      </TransferWrapper>
    </Layout>
  );
};

export default Transfer;
