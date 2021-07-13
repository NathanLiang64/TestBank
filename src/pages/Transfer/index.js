import { useState } from 'react';
import { useSelector } from 'react-redux';
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
import {
  FEIBTabContext, FEIBTabList, FEIBTab, FEIBTabPanel,
  FEIBInputLabel, FEIBInput, FEIBErrorMessage,
  FEIBRadioLabel, FEIBRadio, FEIBButton,
} from 'components/elements';
import { numberToChinese } from 'utilities/Generator';
import { bankCodeValidation, receivingAccountValidation } from 'utilities/validation';
import TransferWrapper from './transfer.style';

/* Swiper modules */
SwiperCore.use([Pagination]);

const Transfer = () => {
  const schema = yup.object().shape({
    ...bankCodeValidation,
    ...receivingAccountValidation,
    transferAmount: yup.string()
      .required('請輸入轉帳金額')
      .max(7, '轉出金額不可大於百萬')
      .test('test', '金額不可為 0', (value) => !(parseInt(value, 10) <= 0)),
  });
  const {
    control, handleSubmit, formState: { errors }, setValue, trigger,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [tabId, setTabId] = useState('transfer');
  const [amount, setAmount] = useState({ number: '', chinese: '' });
  const cardInfo = useSelector(({ depositOverview }) => depositOverview.cardInfo);

  const handleChangeTabList = (event, id) => {
    setTabId(id);
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

  // eslint-disable-next-line no-unused-vars
  const handleClickTransferButton = (data) => {
    // console.log(data);
  };

  const renderDebitCard = (info) => {
    const {
      cardBranch,
      cardName,
      cardAccount,
      cardBalance,
      functionList,
      moreList,
    } = info;
    return (
      <>
        <SwiperSlide>
          <DebitCard
            type="original"
            branch={cardBranch}
            cardName={cardName}
            account={cardAccount}
            balance={cardBalance}
            functionList={functionList}
            moreList={moreList}
          />
        </SwiperSlide>
        <SwiperSlide>
          <DebitCard
            type="original"
            branch={cardBranch}
            cardName={cardName}
            account={cardAccount}
            balance={cardBalance}
            functionList={functionList}
            moreList={moreList}
          />
        </SwiperSlide>
        <SwiperSlide>
          <DebitCard
            type="original"
            branch={cardBranch}
            cardName={cardName}
            account={cardAccount}
            balance={cardBalance}
            functionList={functionList}
            moreList={moreList}
          />
        </SwiperSlide>
      </>
    );
  };

  const renderTabPanels = () => (
    <>
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

      <FEIBTabPanel value="frequentlyUsed">
        <FEIBInputLabel>轉入帳號</FEIBInputLabel>
        <div className="memberAccountCardArea">
          <MemberAccountCard
            transferType="常用"
            name="Robert Fox"
            branchName="遠東商銀"
            branchCode="805"
            account="043000990000"
            avatarSrc="https://images.unsplash.com/photo-1591605555749-d25cfd47e981?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
          />
        </div>
      </FEIBTabPanel>

      <FEIBTabPanel value="designated">
        <FEIBInputLabel>轉入帳號</FEIBInputLabel>
        <div className="memberAccountCardArea">
          <MemberAccountCard
            transferType="約定"
            name="Catherine Smith"
            branchName="遠東商銀"
            branchCode="805"
            account="043000990000"
            avatarSrc="https:images.unsplash.com/photo-1528341866330-07e6d1752ec2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=801&q=80"
          />
        </div>
      </FEIBTabPanel>

      <FEIBTabPanel value="accountBook">
        <p>社群轉帳</p>
      </FEIBTabPanel>
    </>
  );

  useCheckLocation();
  usePageInfo('/api/transfer');

  return (
    <TransferWrapper>
      <div className="userCardArea">
        <Swiper
          slidesPerView={1.14}
          spaceBetween={8}
          centeredSlides
          pagination
          onSlideChange={handleChangeSlide}
        >
          { cardInfo && renderDebitCard(cardInfo) }
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
          <form onSubmit={handleSubmit(handleClickTransferButton)}>
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
              <RadioGroup
                row
                aria-label="轉帳類型"
                id="transferType"
                name="transferType"
                defaultValue="now"
              >
                <FEIBRadioLabel value="now" className="customWidth" control={<FEIBRadio />} label="立即" />
                <FEIBRadioLabel value="reserve" control={<FEIBRadio />} label="預約" />
              </RadioGroup>
            </div>
            <div>
              <FEIBInputLabel>備註</FEIBInputLabel>
              <FEIBInput type="text" placeholder="請輸入" />
              <FEIBErrorMessage>錯誤訊息</FEIBErrorMessage>
            </div>
            <div>
              <FEIBInputLabel>通知 Email</FEIBInputLabel>
              <FEIBInput type="text" placeholder="請輸入" />
              <FEIBErrorMessage>Email 錯誤訊息</FEIBErrorMessage>
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
              <FEIBButton>轉帳</FEIBButton>
              <p className="notice">轉帳前多思考，避免被騙更苦惱</p>
            </div>
          </form>
        </FEIBTabContext>
      </div>
    </TransferWrapper>
  );
};

export default Transfer;
