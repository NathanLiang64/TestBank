/* eslint-disable */
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Pagination } from 'swiper/core';
import { RadioGroup } from '@material-ui/core';
import { useCheckLocation, usePageInfo } from 'hooks';
import DebitCard from 'components/DebitCard';
import Accordion from 'components/Accordion';
import BankCodeInput from 'components/BankCodeInput';
import MemberAccountCard from 'components/MemberAccountCard';
import DatePickerProvider from 'components/DatePickerProvider';
import DateRangePicker from 'components/DateRangePicker';
import {
  FEIBTabContext, FEIBTabList, FEIBTab, FEIBTabPanel,
  FEIBInputLabel, FEIBInput, FEIBErrorMessage, FEIBDatePicker,
  FEIBRadioLabel, FEIBRadio, FEIBButton, FEIBSelect, FEIBOption,
} from 'components/elements';
import { ChangeMemberIcon } from 'assets/images/icons';
import { getMotpStatusOnTransfer, getNtdAccounts, confirmTransferDetail } from 'apis/transferApi';
import { numberToChinese, weekNumberToChinese } from 'utilities/Generator';
import { bankCodeValidation, receivingAccountValidation, transferAmountValidation } from 'utilities/validation';
import { directTo } from 'utilities/mockWebController';
import { setOpenDrawer, setClickMoreOptions, setAccounts } from './stores/actions';
import TransferWrapper from './D00100.style';
// import TransferDrawer from '../TransferDrawer';
import Layout from 'components/Layout/Layout';

/* Swiper modules */
SwiperCore.use([Pagination]);

const Transfer = () => {
  const datePickerLimit = {
    minDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    maxDate: new Date(new Date().setFullYear(new Date().getFullYear() + 2)),
  };
  const [tabId, setTabId] = useState('transfer');
  const [amount, setAmount] = useState('');
  const [showReserveOption, setShowReserveOption] = useState(false);
  const [showReserveMoreOption, setShowReserveMoreOption] = useState(false);
  const [selectTransferMember, setSelectTransferMember] = useState({ frequentlyUsed: null, designed: null });
  const [selectedDate, setSelectedDate] = useState(datePickerLimit.minDate);
  const [datePickerType, setDatePickerType] = useState('single');
  const [transactionCycleType, setTransactionCycleType] = useState('monthly');
  const [transactionDateRange, setTransactionDateRange] = useState([selectedDate, new Date(new Date().setDate(new Date().getDate() + 2))]);
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const [amountLimit, setAmountLimit] = useState({ deposit: 0, perTxn: 0 });
  const [otpStatus, setOtpStatus] = useState({ isOtpOpen: false, isMotpOpen: false });

  const accounts = useSelector(({ transfer }) => transfer.accounts);
  const openDrawer = useSelector(({ transfer }) => transfer.openDrawer);
  const favAccounts = useSelector(({ transfer }) => transfer.favAccounts);
  const regAccounts = useSelector(({ transfer }) => transfer.regAccounts);
  const clickMoreOptions = useSelector(({ transfer }) => transfer.clickMoreOptions);

  const dispatch = useDispatch();
  const history = useHistory();

  const deviceId = '675066ee-2f25-4d97-812a-12c7f8d18489';
  
  const schema = yup.object().shape({
    bankCode: yup.mixed()
    .when('transferOption', { is: 'transfer', then: bankCodeValidation() }),
    receivingAccount: yup.string()
    .when('transferOption', { is: 'transfer', then: receivingAccountValidation() }),
    transferAmount: transferAmountValidation(amountLimit.deposit, amountLimit.perTxn),
  });
  const {
    control, handleSubmit, formState: { errors }, setValue, trigger, watch, unregister, register,
  } = useForm({
    resolver: yupResolver(schema),
  });
  
  const handleChangeTabList = (event, id) => setTabId(id);

  const handleChangeAmount = (event) => {
    setAmount(() => {
      const newAmount = event.target.value;
      setValue('transferAmount', newAmount);
      trigger('transferAmount');
      if (!newAmount) return '';
      return `$${newAmount}${numberToChinese(newAmount)}`;
    });
  };

  const handleChangeSlide = (swiper) => setSelectedCardIndex(swiper.activeIndex);

  const handleClickTransferButton = async (data) => {
    // 轉出帳號

    // const selectedAccount = accounts.find((card) => card.accountId === selectedCardIndex);
    const selectedAccount = accounts[selectedCardIndex];
    const { accountId } = selectedAccount;
    const {
      bankCode: { bankNo }, receivingAccount, transferAmount, remark,
    } = data;
    console.log('submit transfer', data);
    console.log('selectedCard', selectedAccount);

    const params = {
      outAcctNo: accountId,
      inBank: bankNo,
      inAcctNo: receivingAccount,
      amount: transferAmount,
      email: '',
      emailContent: '',
      memo: remark,
      deviceId: deviceId,
      isQRCode: false,
      isMotpOpen: otpStatus.isMotpOpen,
    };

    console.log('params', params);
    const otpId = await confirmTransferDetail(params)
      .then((response) => {
        console.log('轉帳確認 res', response);
        if (!response.code) {
          return response.otpId;
          // const confirmParams = { ...params, otpId: response.otpId };
          // {
          //   "otpId": "20211103151735622",
          //   "checkNum": "CFQY",
          //   "countdown": "300",
          //   "initialKey": "        "
          // }
          // directTo(history, 'transfer1', confirmParams);
        }
      })
      .catch((error) => console.log('轉帳確認 err', error));

    if (otpId) {
      const { outAcctNo, deviceId, isQRCode, isMotpOpen } = params;
      const confirmParams = {
        ...data,
        outAcctNo,
        deviceId,
        isQRCode,
        isMotpOpen,
        otpId,
        isRegister: false,
      };
      console.log(confirmParams);
      directTo(history, 'transfer1', confirmParams);
    }

    // "custId": 身分證號 string,
    // "outAcctNo": 轉出帳號 string,
    // "inBank": 轉入銀行 string,
    // "inAcctNo": 轉入帳號 string,
    // "amount": 轉帳金額 string,
    // "email": email string,
    // "emailContent": email內容 string,
    // "memo": 附言 string,
    // "deviceId": motp綁定裝置編號 string,
    // "isQRCode": false,
    // "isMotpOpen": true

    // "nextDayFlag": 次營業日記號 "2021/06/15", 可不代
    // "otpId": string
    // "otpCode": OTP 驗證碼 string
    // "isRegister": 是否為約定帳戶轉帳 boolean

    // data.debitAccount = selectCard.accountId;
    // data.debitName = selectCard.cardName;
    //
    // // 常用/約定轉帳時，取得受款人帳號
    // const { select } = clickMoreOptions;
    // if (data.transferOption === 'frequentlyUsed') {
    //   console.log("=============常用帳號轉帳==============");
    //   console.log("select",select)
    //   if (select.target) {
    //     const currentTarget = frequentlyUsedAccounts.find((member) => member.id === select.target);
    //     const { acctId, bankNo, bankName } = currentTarget;
    //     data.bankCode = { bankId, bankName };
    //     data.receivingAccount = acctId;
    //   } else {
    //     const { accountId, bankId, bankName } = frequentlyUsedAccounts[0];
    //     console.log("frequentlyUsedAccounts",frequentlyUsedAccounts[0]);
    //     data.bankCode = { bankId, bankName };
    //     data.receivingAccount = accountId;
    //   }
    // }
    // if (data.transferOption === 'designated') {
    //   if (select.target) {
    //     console.log("designedAccounts",designedAccounts)
    //     const currentTarget = designedAccounts.find((member) => member.id === select.target);
    //     const { acctId, bankNo, bankName } = currentTarget;
    //     data.bankCode = { bankId, bankName };
    //     data.receivingAccount = acctId;
    //   } else {
    //     const { acctId, bankId, bankName } = designedAccounts[0];
    //     data.bankCode = { bankId, bankName };
    //     data.receivingAccount = acctId;
    //   }
    // }
    //
    // // 若沒有 transactionDate 代表用戶選擇預約多次轉帳，套用用戶選擇的日期範圍
    // if (!data.transactionDate) data.transactionDate = transactionDateRange;
    //
    // // 刪除驗證用的選項
    // delete data.transferOption;
    //
    // // console.log(data);
    //
    // const displayInfo = { ...data, depositAmount, transferRemaining };
    // // const { receivingAccount, transferAmount, transferType } = data;
    // // const paramsObject = { receivingAccount, transferAmount, transferType };
    // // const params = Object.keys(paramsObject).map((key) => `${key}=${paramsObject[key]}`).join('&');
    // directTo(history, 'transfer1', displayInfo);
  };

  const handleOpenFrequentlyUsedList = () => {
    dispatch(setOpenDrawer({ ...openDrawer, title: '常用帳號', open: true }));
  };

  const handleOpenDesignatedList = () => {
    dispatch(setOpenDrawer({ ...openDrawer, title: '約定帳號', open: true }));
  };

  const renderCards = (account) => account.map((account, index) => {
    const {
      branchId, cardName, accountId, balance, isTwd, ccyCd, accountType, moreList, tfrhCount, interbankTransferRemaining,
    } = account;
    return (
      <SwiperSlide key={accountId} data-index={index}>
        <DebitCard
          type="original"
          branch={branchId || '沒有分行'}
          cardName="沒有銀行帳號別名"
          account={accountId}
          accountType={accountType}
          balance={balance}
          transferLimit="沒有總次數"
          transferRemaining={tfrhCount}
          moreList={moreList}
          dollarSign={isTwd === 'Y' ? 'TWD' : ccyCd}
        />
      </SwiperSlide>
    );
  });

  const renderTabPanels = () => (
    <>
      {/* 一般轉帳頁籤 */}
      <FEIBTabPanel value="transfer">
        <div>
          <BankCodeInput
            id="bankCode"
            setValue={setValue}
            trigger={trigger}
            control={control}
            errorMessage={errors.bankCode?.message}
          />
        </div>
        <div>
          <FEIBInputLabel htmlFor="receivingAccount">轉入帳號</FEIBInputLabel>
          <Controller
            name="receivingAccount"
            defaultValue=""
            control={control}
            render={({ field }) => (
              <FEIBInput
                {...field}
                id="receivingAccount"
                type="number"
                name="receivingAccount"
                placeholder="請輸入"
                error={!!errors.receivingAccount}
              />
            )}
          />
          <FEIBErrorMessage>{errors.receivingAccount?.message}</FEIBErrorMessage>
        </div>
      </FEIBTabPanel>

      {/* 常用轉帳頁籤 */}
      <FEIBTabPanel value="frequentlyUsed">
        <FEIBInputLabel>轉入帳號</FEIBInputLabel>
        { selectTransferMember.frequentlyUsed && (
          <div className="memberAccountCardArea">
            <MemberAccountCard
              id={selectTransferMember.frequentlyUsed.accountId}
              name={selectTransferMember.frequentlyUsed.accountName}
              bankName={selectTransferMember.frequentlyUsed.bankName}
              bankNo={selectTransferMember.frequentlyUsed.bankId}
              account={selectTransferMember.frequentlyUsed.accountId}
              avatarSrc={selectTransferMember.frequentlyUsed.acctImg}
              noBorder
              noOption
            />
            <div className="changeMemberButton" onClick={handleOpenFrequentlyUsedList}>
              <ChangeMemberIcon />
            </div>
          </div>
        ) }
      </FEIBTabPanel>

      {/* 約定轉帳頁籤 */}
      <FEIBTabPanel value="designated">
        <FEIBInputLabel>轉入帳號</FEIBInputLabel>
        { selectTransferMember.designed && (
          <div className="memberAccountCardArea">
            <MemberAccountCard
              id={selectTransferMember.designed.accountId}
              name={selectTransferMember.designed.accountName}
              bankName={selectTransferMember.designed.bankName}
              bankNo={selectTransferMember.designed.bankId}
              account={selectTransferMember.designed.accountId}
              avatarSrc={selectTransferMember.designed.acctImg}
              noBorder
              noOption
            />
            <div className="changeMemberButton" onClick={handleOpenDesignatedList}>
              <ChangeMemberIcon />
            </div>
          </div>
        ) }
      </FEIBTabPanel>

      {/* 社群轉帳頁籤 */}
      <FEIBTabPanel value="accountBook">
        <p>社群轉帳</p>
      </FEIBTabPanel>
    </>
  );

  const renderWeeklyTransactionCycle = () => {
    const arr = [];
    for (let i = 0; i < 7; i++) {
      arr.push(<FEIBOption key={i + 1} value={(i + 1).toString()}>{`週${weekNumberToChinese(i + 1)}`}</FEIBOption>);
    }
    return (arr);
  };

  const renderMonthlyTransactionCycle = () => {
    const arr = [];
    for (let i = 0; i < 31; i++) {
      arr.push(<FEIBOption key={i + 1} value={(i + 1).toString()}>{`${i + 1}號`}</FEIBOption>);
    }
    return arr;
  };

  const renderReserveMoreOption = () => (
    <div className="reserveMoreOption">
      <div>
        <FEIBInputLabel htmlFor="transactionFrequency">交易頻率</FEIBInputLabel>
        <Controller
          name="transactionFrequency"
          control={control}
          defaultValue="monthly"
          render={({ field }) => (
            <FEIBSelect {...field} id="transactionFrequency" name="transactionFrequency">
              <FEIBOption value="weekly">每週</FEIBOption>
              <FEIBOption value="monthly">每月</FEIBOption>
            </FEIBSelect>
          )}
        />
        <FEIBErrorMessage />
      </div>
      <div>
        <FEIBInputLabel htmlFor="transactionCycle">交易週期</FEIBInputLabel>
        {
          transactionCycleType === 'monthly' ? (
            <Controller
              name="transactionCycle"
              control={control}
              defaultValue="1"
              render={({ field }) => (
                <FEIBSelect {...field} id="transactionCycle" name="transactionCycle">
                  { renderMonthlyTransactionCycle().flat() }
                </FEIBSelect>
              )}
            />
          ) : (
            <Controller
              name="transactionCycle"
              control={control}
              defaultValue="1"
              render={({ field }) => (
                <FEIBSelect {...field} id="transactionCycle" name="transactionCycle">
                  { renderWeeklyTransactionCycle().flat() }
                </FEIBSelect>
              )}
            />
          )
        }
        <FEIBErrorMessage />
      </div>
    </div>
  );

  const renderReserveOption = () => (
    <div className="reserveOption">
      <FEIBInputLabel htmlFor="transactionNumber">交易次數</FEIBInputLabel>
      <Controller
        name="transactionNumber"
        control={control}
        defaultValue="once"
        render={({ field }) => (
          <FEIBSelect {...field} id="transactionNumber" name="transactionNumber">
            <FEIBOption value="once">一次</FEIBOption>
            <FEIBOption value="many">多次</FEIBOption>
          </FEIBSelect>
        )}
      />
      {
        datePickerType === 'single' ? (
          <>
            <FEIBInputLabel className="datePickerLabel">交易時間</FEIBInputLabel>
            <Controller
              name="transactionDate"
              control={control}
              defaultValue={selectedDate}
              render={({ field }) => (
                <DatePickerProvider>
                  <FEIBDatePicker
                    {...field}
                    id="transactionDate"
                    name="transactionDate"
                    label="交易時間"
                    format="MM/dd/yyyy"
                    value={selectedDate}
                    {...datePickerLimit}
                    // disablePast
                    onChange={(date) => {
                      setValue('transactionDate', date);
                      setSelectedDate(date);
                    }}
                  />
                </DatePickerProvider>
              )}
            />
          </>
        ) : (
          <div className="dateRangePickerArea">
            <DateRangePicker
              label="交易時間"
              date={transactionDateRange}
              {...datePickerLimit}
              onClick={(range) => setTransactionDateRange(range)}
            />
          </div>
        )
      }
      <FEIBErrorMessage>{errors.transactionDate?.message}</FEIBErrorMessage>
      { showReserveMoreOption && renderReserveMoreOption() }
    </div>
  );

  useCheckLocation();
  usePageInfo('/api/transfer');

  // 取得初始資料
  useEffect(() => {
    // 取得所有存款卡
    getNtdAccounts({ motpDeviceId: deviceId })
      .then((response) => {
        console.log(response);
        dispatch(setAccounts(response?.accounts));
      });

    // 是否開通 OTP 和 MOTP
    getMotpStatusOnTransfer({ deviceId }).then((response) => {
      const { isOtpOpen, isMotpOpen } = response;
      setOtpStatus({ isOtpOpen: isOtpOpen === 'Y', isMotpOpen: isMotpOpen === 'Y' })
    });

    // transferOption 是為了避免不同頁籤造成驗證衝突，初始設置 transfer (一般轉帳)
    setValue('transferOption', 'transfer');
  }, []);

  useEffect(() => {
    // 若轉帳類行為 "立即"，取消註冊 "預約轉帳子選項" 的多項表單值，且不顯示 "預約轉帳的子選項" UI
    if (watch('transferType') === 'now') {
      setValue('transactionDate', new Date());
      unregister('transactionCycle');
      unregister('transactionNumber');
      unregister('transactionFrequency');
      setShowReserveOption(false);
    }

    // 若轉帳類型為 "預約"，顯示 "預約轉帳的子選項" UI
    if (watch('transferType') === 'reserve') {
      setShowReserveOption(true);

      // 若轉帳類型為 "預約" 且轉帳次數為 "多次"，取消註冊 "轉帳日期" 表單值，並顯示 "週期" 及 "頻率"  UI
      if (watch('transactionNumber') === 'many') {
        unregister('transactionDate');
        setShowReserveMoreOption(true);
        setDatePickerType('range');
      } else {
        // 否則取消註冊 "週期" 及 "頻率" 表單值、預設轉帳日期為明日，並取消顯示 "週期" 及 "頻率" UI
        unregister('transactionCycle');
        unregister('transactionFrequency');
        setShowReserveMoreOption(false);
        setDatePickerType('single');
        setValue('transactionDate', selectedDate);
      }
    }
  }, [watch('transferType'), watch('transactionNumber')]);

  useEffect(() => {
    if (!watch('transactionFrequency')) {
      setTransactionCycleType('monthly');
    } else {
      setTransactionCycleType(watch('transactionFrequency'));
    }
    // 每次切換交易頻率時皆重設交易週期的值
    setValue('transactionCycle', 1);
  }, [watch('transactionFrequency')]);

  useEffect(() => {
    // 每次切換 Tab 都先清空點擊選項
    dispatch(setClickMoreOptions({
      select: { click: false, target: null },
      add: { click: false, target: null },
      edit: { click: false, target: null },
      remove: { click: false, target: null },
    }));

    // 若當前頁面為一般轉帳，關閉 Drawer UI
    if (watch('transferOption') === 'transfer') {
      dispatch(setOpenDrawer({ ...openDrawer, content: 'default', open: false }));
    }

    // 若當前頁面為常用轉帳
    if (watch('transferOption') === 'frequentlyUsed') handleOpenFrequentlyUsedList();

    // 若當前頁面為約定轉帳
    if (watch('transferOption') === 'designated') handleOpenDesignatedList();
  }, [watch('transferOption')]);

  // 常用轉帳頁籤內的帳號卡片預設為常用帳號清單的第一筆
  useEffect(() => {
    if (favAccounts?.length) setSelectTransferMember({ ...selectTransferMember, frequentlyUsed: favAccounts[0] });
  }, [favAccounts]);

  // 約定轉帳頁籤內的帳號卡片預設為約定帳號清單的第一筆
  useEffect(() => {
    if (regAccounts?.length) setSelectTransferMember({ ...selectTransferMember, designed: regAccounts[0] });
  }, [regAccounts]);

  useEffect(() => {
    let currentTarget = null;
    const { select } = clickMoreOptions;
    if (select.click && select.target) {
      // 若點擊選項為 select 且當前頁面為常用轉帳，至常用帳號清單內比對相符的 target 帳號
      if (watch('transferOption') === 'frequentlyUsed') {
        currentTarget = favAccounts.find((member) => member.accountId === select.target);
        setSelectTransferMember({ ...selectTransferMember, frequentlyUsed: currentTarget });
      }
      // 若點擊選項為 select 且當前頁面為約定轉帳，至約定帳號清單內比對相符的 target 帳號
      if (watch('transferOption') === 'designated') {
        currentTarget = regAccounts.find((member) => member.accountId === select.target);
        setSelectTransferMember({ ...selectTransferMember, designed: currentTarget });
      }
      dispatch(setOpenDrawer({ ...openDrawer, open: false }));
    }
  }, [clickMoreOptions.select]);

  // 取得用戶存款餘額 & 單筆轉帳限額 (用於設置至轉出金額驗證規則)
  useEffect(() => {
    if (accounts?.length && selectedCardIndex >= 0) {
      const account = accounts[selectedCardIndex];
      const { balance, singleLimit } = account;
      setAmountLimit({ deposit: balance, perTxn: singleLimit });
    }
  }, [accounts, selectedCardIndex]);

  useEffect(() => setValue('transferOption', tabId), [tabId]);

  return (
    <Layout title="台幣轉帳">
    <TransferWrapper>
      <div className="userCardArea">
        <Swiper slidesPerView={1.14} spaceBetween={8} centeredSlides pagination onSlideChange={handleChangeSlide}>
          { accounts?.length ? renderCards(accounts) : null }
        </Swiper>
      </div>
      <div className="transferServicesArea">
        <FEIBTabContext value={tabId}>
          <FEIBTabList onChange={handleChangeTabList} $type="fixed" $size="small" className="tabList">
            <FEIBTab label="一般轉帳" value="transfer" />
            <FEIBTab label="常用轉帳" value="frequentlyUsed" />
            <FEIBTab label="約定轉帳" value="designated" />
            <FEIBTab label="社群轉帳" value="accountBook" />
          </FEIBTabList>
          {/* transferOption 是為了避免不同頁籤造成驗證衝突 */}
          <input type="text" style={{ display: 'none' }} {...register('transferOption')} />
          <form>
            { renderTabPanels() }
            <div className="customSpace">
              <FEIBInputLabel htmlFor="transferAmount">金額</FEIBInputLabel>
              <Controller
                name="transferAmount"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <>
                    <FEIBInput
                      {...field}
                      type="number"
                      inputMode="numeric"
                      className="transferAmountInput"
                      id="transferAmount"
                      name="transferAmount"
                      placeholder="$0（零元）"
                      error={!!errors.transferAmount}
                      onChange={handleChangeAmount}
                      inputProps={{
                        maxLength: 9,
                        autoComplete: 'off',
                      }}
                    />
                    <div className="balanceLayout">{amount}</div>
                  </>
                )}
              />
              <FEIBErrorMessage>{errors.transferAmount?.message}</FEIBErrorMessage>
            </div>
            <p className="notice">單筆/當日/當月非約定轉帳剩餘額度: 10,000/20,000/40,000</p>
            <div className="transferType">
              <FEIBInputLabel>轉帳類型</FEIBInputLabel>
              <Controller
                name="transferType"
                control={control}
                defaultValue="now"
                render={({ field }) => (
                  <RadioGroup {...field} row aria-label="轉帳類型" id="transferType" name="transferType" defaultValue="now">
                    <FEIBRadioLabel value="now" className="customWidth" control={<FEIBRadio />} label="立即" />
                    <FEIBRadioLabel value="reserve" control={<FEIBRadio />} label="預約" />
                  </RadioGroup>
                )}
              />
            </div>
            { showReserveOption && renderReserveOption() }
            <div>
              <FEIBInputLabel>備註</FEIBInputLabel>
              <Controller
                name="remark"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <FEIBInput {...field} type="text" placeholder="請輸入" />
                )}
              />
              <FEIBErrorMessage />
            </div>
            <Accordion space="both">
              <ul>
                <li>對方收款帳號若為他行帳戶，您將自行負擔新臺幣15元之跨行轉帳手續費。</li>
                <li>如有設定收款密碼，收款人收款時將會需要一組您設定的收款密碼，建議以其他管道提供收款密碼給收款人。</li>
                <li>社群轉帳連結款項將於收款人收款時自您的帳戶中扣除，請確認您的帳戶可用餘額充足。</li>
                <li>社群轉帳連結被領取金額將占用您非約定轉帳限額(臨櫃開立帳戶、一類及二類數位存款帳戶：每帳戶單筆5萬、當日10萬、當月累積不超過20萬。三類數位存款帳戶：每帳戶單筆1萬、當日3萬、當月累積不超過5萬。)，如您非約定轉帳限額已達上限，收款人將有無法收款的情況發生。</li>
              </ul>
            </Accordion>
            <div className="transferButtonArea">
              <FEIBButton onClick={handleSubmit(handleClickTransferButton)}>轉帳</FEIBButton>
              <p className="notice">轉帳前多思考，避免被騙更苦惱</p>
            </div>
          </form>
        </FEIBTabContext>
      </div>
      {/* <TransferDrawer setTabId={setTabId} /> */}
    </TransferWrapper>
    </Layout>
  );
};

export default Transfer;
