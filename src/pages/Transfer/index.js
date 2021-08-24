import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Pagination } from 'swiper/core';
import { RadioGroup } from '@material-ui/core';
import { AccountCircleRounded } from '@material-ui/icons';
import { useCheckLocation, usePageInfo } from 'hooks';
import DebitCard from 'components/DebitCard';
import Accordion from 'components/Accordion';
import BankCodeInput from 'components/BankCodeInput';
import MemberAccountCard from 'components/MemberAccountCard';
import DatePickerProvider from 'components/DatePickerProvider';
import {
  FEIBTabContext, FEIBTabList, FEIBTab, FEIBTabPanel,
  FEIBInputLabel, FEIBInput, FEIBErrorMessage, FEIBDatePicker,
  FEIBRadioLabel, FEIBRadio, FEIBButton, FEIBSelect, FEIBOption, FEIBIconButton,
} from 'components/elements';
import { doGetInitData } from 'apis/transferApi';
import { numberToChinese } from 'utilities/Generator';
import { bankCodeValidation, receivingAccountValidation, transferAmountValidation } from 'utilities/validation';
import { directTo } from 'utilities/mockWebController';
import theme from 'themes/theme';
import {
  setCards, setDesignedAccounts, setFrequentlyUsedAccounts, setTransferData, setOpenDrawer, setClickMoreOptions,
} from './stores/actions';
import TransferWrapper from './transfer.style';
import TransferDrawer from '../TransferDrawer';

/* Swiper modules */
SwiperCore.use([Pagination]);

const Transfer = () => {
  const schema = yup.object().shape({
    bankCode: yup.mixed()
      .when('transferOption', { is: 'transfer', then: bankCodeValidation() }),
    receivingAccount: yup.string()
      .when('transferOption', { is: 'transfer', then: receivingAccountValidation() }),
    transferAmount: transferAmountValidation(),
  });
  const {
    control, handleSubmit, formState: { errors }, setValue, trigger, watch, unregister, register,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [tabId, setTabId] = useState('transfer');
  const [amount, setAmount] = useState({ number: '', chinese: '' });
  const [showReserveOption, setShowReserveOption] = useState(false);
  const [showReserveMoreOption, setShowReserveMoreOption] = useState(false);
  const [selectTransferMember, setSelectTransferMember] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const cards = useSelector(({ transfer }) => transfer.cards);
  const frequentlyUsedAccounts = useSelector(({ transfer }) => transfer.frequentlyUsedAccounts);
  const designedAccounts = useSelector(({ transfer }) => transfer.designedAccounts);
  const openDrawer = useSelector(({ transfer }) => transfer.openDrawer);
  const clickMoreOptions = useSelector(({ transfer }) => transfer.clickMoreOptions);
  const dispatch = useDispatch();
  const history = useHistory();

  const handleChangeTabList = (event, id) => {
    setTabId(id);
    setValue('transferOption', id);
  };

  const handleChangeAmount = (event) => {
    setAmount(() => {
      const newAmount = event.target.value;
      setValue('transferAmount', newAmount);
      trigger('transferAmount');
      return ({ number: newAmount, chinese: numberToChinese(newAmount) });
    });
  };

  // eslint-disable-next-line no-unused-vars
  const handleChangeSlide = (swiper) => {};

  const handleClickTransferButton = (data) => {
    // 刪除驗證用的選項
    delete data.transferOption;

    // console.log(data);
    if (!data.transactionDate) data.transactionDate = new Date();
    dispatch(setTransferData((data)));
    // const { receivingAccount, transferAmount, transferType } = data;
    // const paramsObject = { receivingAccount, transferAmount, transferType };
    // const params = Object.keys(paramsObject).map((key) => `${key}=${paramsObject[key]}`).join('&');
    directTo(history, 'transfer1');
  };

  const handleOpenFrequentlyUsedList = () => {
    dispatch(setOpenDrawer({ ...openDrawer, title: '常用帳號', open: true }));
  };

  const handleOpenDesignatedList = () => {
    dispatch(setOpenDrawer({ ...openDrawer, title: '約定帳號', open: true }));
  };

  const renderCards = (debitCards) => (
    debitCards.map((card) => {
      const {
        cardBranch, cardName, cardAccount, cardBalance, cardColor, moreList, interbankTransferLimit, interbankTransferRemaining,
      } = card;
      return (
        <SwiperSlide key={cardAccount}>
          <DebitCard
            type="original"
            branch={cardBranch}
            cardName={cardName}
            account={cardAccount}
            balance={cardBalance}
            color={cardColor}
            transferLimit={interbankTransferLimit}
            transferRemaining={interbankTransferRemaining}
            moreList={moreList}
          />
        </SwiperSlide>
      );
    })
  );

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
        { selectTransferMember && (
          <div className="memberAccountCardArea">
            <MemberAccountCard
              name={selectTransferMember.acctName}
              bankName={selectTransferMember.bankName}
              bankNo={selectTransferMember.bankNo}
              account={selectTransferMember.acctId}
              avatarSrc={selectTransferMember.acctImg}
              noBorder
              noOption
            />
            <div className="changeMemberButton" onClick={handleOpenFrequentlyUsedList}>
              <FEIBIconButton $iconColor={theme.colors.primary.light} $fontSize={2.4}>
                <AccountCircleRounded />
              </FEIBIconButton>
            </div>
          </div>
        ) }
      </FEIBTabPanel>

      {/* 約定轉帳頁籤 */}
      <FEIBTabPanel value="designated">
        <FEIBInputLabel>轉入帳號</FEIBInputLabel>
        { selectTransferMember && (
          <div className="memberAccountCardArea">
            <MemberAccountCard
              name={selectTransferMember.acctName}
              bankName={selectTransferMember.bankName}
              bankNo={selectTransferMember.bankNo}
              account={selectTransferMember.acctId}
              avatarSrc={selectTransferMember.acctImg}
              noBorder
              noOption
            />
            <div className="changeMemberButton" onClick={handleOpenDesignatedList}>
              <FEIBIconButton $iconColor={theme.colors.primary.light} $fontSize={2.4}>
                <AccountCircleRounded />
              </FEIBIconButton>
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

  const renderReserveMoreOption = () => (
    <div className="reserveMoreOption">
      <div>
        <FEIBInputLabel htmlFor="transactionFrequency">交易頻率</FEIBInputLabel>
        <Controller
          name="transactionFrequency"
          control={control}
          defaultValue="weekly"
          render={({ field }) => (
            <FEIBSelect {...field} id="transactionFrequency" name="transactionFrequency">
              <FEIBOption value="weekly">每周</FEIBOption>
              <FEIBOption value="monthly">每月</FEIBOption>
            </FEIBSelect>
          )}
        />
        <FEIBErrorMessage />
      </div>
      <div>
        <FEIBInputLabel htmlFor="transactionCycle">交易週期</FEIBInputLabel>
        <Controller
          name="transactionCycle"
          control={control}
          defaultValue="2"
          render={({ field }) => (
            <FEIBSelect {...field} id="transactionCycle" name="transactionCycle">
              <FEIBOption value="2">2</FEIBOption>
              <FEIBOption value="3">3</FEIBOption>
              <FEIBOption value="4">4</FEIBOption>
            </FEIBSelect>
          )}
        />
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
              disablePast
              onChange={(date) => {
                setValue('transactionDate', date);
                setSelectedDate(date);
              }}
            />
          </DatePickerProvider>
        )}
      />
      <FEIBErrorMessage>{errors.transactionDate?.message}</FEIBErrorMessage>
      { showReserveMoreOption && renderReserveMoreOption() }
    </div>
  );

  useCheckLocation();
  usePageInfo('/api/transfer');

  // 取得所有存款卡的初始資料
  useEffect(async () => {
    const cardResponse = await doGetInitData('/api/transfer');
    if (cardResponse.initData) dispatch(setCards(cardResponse.initData.cards));

    const favoriteResponse = await doGetInitData('/api/getFavoriteAcct');
    if (favoriteResponse) dispatch(setFrequentlyUsedAccounts(favoriteResponse.favoriteAcctList));

    const designedResponse = await doGetInitData('/api/getDesignedAcct');
    if (designedResponse) dispatch(setDesignedAccounts(designedResponse.designedAcctList));

    // transferOption 是為了避免不同頁籤造成驗證衝突，初始設置 transfer (一般轉帳)
    setValue('transferOption', 'transfer');
  }, []);

  // 根據用戶選擇的卡片，將該卡片資料儲存至 redux
  // useEffect(() => {
  //   selectedCard(1, cards);
  // }, [cards]);

  useEffect(() => {
    if (watch('transferType') === 'reserve') {
      // 若轉帳類型為 "預約"，顯示 "預約轉帳的子選項" UI
      setShowReserveOption(true);
    } else {
      // 否則取消註冊 "預約轉帳子選項" 的多項表單值，且不顯示 "預約轉帳的子選項" UI
      unregister('transactionDate');
      unregister('transactionCycle');
      unregister('transactionNumber');
      unregister('transactionFrequency');
      setShowReserveOption(false);
    }
  }, [watch('transferType')]);

  useEffect(() => {
    if (watch('transactionNumber') === 'many') {
      // 若交易次數為 "多次"，顯示 "預約多次交易的子選項" UI
      setShowReserveMoreOption(true);
    } else {
      // 否則取消註冊 "預約多次交易的子選項" 的兩項表單值，且不顯示 "預約多次交易的子選項" UI
      unregister('transactionCycle');
      unregister('transactionFrequency');
      setShowReserveMoreOption(false);
    }
  }, [watch('transactionNumber')]);

  useEffect(() => {
    // 每次切換 Tab 都先清空點擊選項
    dispatch(setClickMoreOptions({ click: false, button: '', target: null }));
    // 若當前頁面為常用轉帳，將常用帳號清單內的第一筆設置為預設的轉帳對象，並開啟常用帳號 Drawer UI
    if (watch('transferOption') === 'frequentlyUsed') {
      if (frequentlyUsedAccounts.length) setSelectTransferMember(frequentlyUsedAccounts[0]);
      handleOpenFrequentlyUsedList();
    }
    // 若當前頁面為約定轉帳，將約定帳號清單內的第一筆設置為預設的轉帳對象，並開啟約定帳號 Drawer UI
    if (watch('transferOption') === 'designated') {
      if (designedAccounts.length) setSelectTransferMember(designedAccounts[0]);
      handleOpenDesignatedList();
    }
  }, [watch('transferOption')]);

  useEffect(() => {
    let currentTarget = null;
    if (clickMoreOptions.button === 'select' && clickMoreOptions.target) {
      // 若點擊選項為 select 且當前頁面為常用轉帳，至常用帳號清單內比對相符的 target 帳號
      if (watch('transferOption') === 'frequentlyUsed') {
        currentTarget = frequentlyUsedAccounts.find((member) => member.acctId === clickMoreOptions.target);
      }
      // 若點擊選項為 select 且當前頁面為約定轉帳，至約定帳號清單內比對相符的 target 帳號
      if (watch('transferOption') === 'designated') {
        currentTarget = designedAccounts.find((member) => member.acctId === clickMoreOptions.target);
      }
      // 將該對象設置至轉帳對象並關閉 Drawer
      setSelectTransferMember(currentTarget);
      dispatch(setOpenDrawer({ ...openDrawer, open: false }));
    }
  }, [clickMoreOptions]);

  return (
    <TransferWrapper>
      <div className="userCardArea">
        <Swiper slidesPerView={1.14} spaceBetween={8} centeredSlides pagination onSlideChange={handleChangeSlide}>
          { cards.length > 0 && renderCards(cards) }
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
                  <FEIBInput
                    {...field}
                    className="customStyles"
                    id="transferAmount"
                    name="transferAmount"
                    type="number"
                    value={amount.number}
                    placeholder="0"
                    startAdornment={<span className={`adornment ${amount.number === '' && 'empty'}`}>$</span>}
                    endAdornment={(
                      <span className={`adornment chinese ${amount.number === '' && 'empty'}`}>
                        {amount.number ? amount.chinese : '(零元)'}
                      </span>
                    )}
                    onChange={handleChangeAmount}
                    onClick={(event) => event.currentTarget.children[1].focus()}
                    error={!!errors.transferAmount}
                  />
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
      <TransferDrawer />
    </TransferWrapper>
  );
};

export default Transfer;
