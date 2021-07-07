import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
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
import TransferWrapper from './transfer.style';

const Transfer = () => {
  const {
    handleSubmit, formState: { errors },
  } = useForm();

  const [tabId, setTabId] = useState('transfer');
  const [amount, setAmount] = useState({ number: '0', chinese: '(零元)' });
  const cardInfo = useSelector(({ depositOverview }) => depositOverview.cardInfo);

  const handleChangeTabList = (event, id) => {
    setTabId(id);
  };

  const handleChangeAmount = (event) => {
    setAmount({
      number: event.target.value.replace(/\b(0+)/gi, ''),
      chinese: numberToChinese(event.target.value.replace(/\b(0+)/gi, '')),
    });
  };

  // eslint-disable-next-line no-unused-vars
  const handleClickTransferButton = (data) => {};

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
      <DebitCard
        type="original"
        branch={cardBranch}
        cardName={cardName}
        account={cardAccount}
        balance={cardBalance}
        functionList={functionList}
        moreList={moreList}
      />
    );
  };

  const renderTabPanels = () => (
    <>
      <FEIBTabPanel value="transfer">
        <div>
          <BankCodeInput />
        </div>
        <div>
          <FEIBInputLabel>帳號</FEIBInputLabel>
          <FEIBInput type="number" placeholder="請輸入" />
          <FEIBErrorMessage>請輸入銀行帳號</FEIBErrorMessage>
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
      { cardInfo && renderDebitCard(cardInfo) }
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
              <FEIBInputLabel>金額</FEIBInputLabel>
              <FEIBInput
                className="customStyles"
                type="text"
                value={amount.number}
                placeholder="0"
                maxLength="7"
                startAdornment={<span className={`adornment ${amount.number === '' && 'empty'}`}>$</span>}
                endAdornment={(
                  <span className={`adornment chinese ${amount.number === '' && 'empty'}`}>
                    {amount.number ? amount.chinese : '(零元)'}
                  </span>
                )}
                onChange={handleChangeAmount}
              />
              <FEIBErrorMessage>{errors.payAmount?.message}</FEIBErrorMessage>
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
