import { useState, useEffect } from 'react';
import { DialogTitle, DialogContent } from '@material-ui/core';
import { FEIBIconButton, FEIBInput, FEIBInputLabel } from 'components/elements';
import { getBankCode } from 'apis/bankCodeApi';
import { CrossIcon } from 'assets/images/icons';
import theme from 'themes/theme';
import BankCodeWrapper from './bankCode.style';

const BankCode = ({ isOpen, onClose, onSelect }) => {
  const [searchValue, setSearchValue] = useState('');
  const [bankList, setBankList] = useState([]);
  const [filteredBankList, setFilteredBankList] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [favoriteBankList, setFavoriteBankList] = useState([]);

  const handleClickBankItem = (event) => {
    // 回傳選擇的銀行代碼
    const selectedBank = [];
    for (const bank of event.currentTarget.children) {
      selectedBank.push(bank.innerText);
    }
    onSelect({
      bankNo: selectedBank[1],
      bankName: selectedBank[0],
    });
    onClose();

    // 初始化
    setSearchValue('');
  };

  const renderBankCode = (list) => list.map((bank) => (
    <li key={bank.bankNo} data-code={bank.bankNo} onClick={handleClickBankItem}>
      <p>{bank.bankName}</p>
      <span>{bank.bankNo}</span>
    </li>
  ));

  useEffect(async () => {
    getBankCode()
      .then((response) => {
        setBankList(response);
        setFilteredBankList(response);
      });
    // .catch((error) => console.log('取得銀行代碼 error', error))
  }, []);

  useEffect(() => {
    if (searchValue && filteredBankList) {
      const filteredList = bankList.filter((bank) => (
        bank.bankNo.includes(searchValue) || bank.bankName.includes(searchValue)
      ));
      setFilteredBankList(filteredList);
      return;
    }
    setFilteredBankList(bankList);
  }, [searchValue]);

  return (
    <BankCodeWrapper
      open={isOpen}
      onClose={onClose}
      aria-labelledby="taiwan-bank-code-list"
      aria-describedby="taiwan-bank-code-list"
    >
      <DialogTitle>
        <span className="title">銀行代碼</span>
        <FEIBIconButton className="closeButton" onClick={onClose}>
          <CrossIcon size={20} color={theme.colors.text.dark} />
        </FEIBIconButton>
      </DialogTitle>
      <DialogContent>
        <ul>
          <li>常用銀行</li>
          { favoriteBankList.map((item) => (
            <li key={item.bankNo} data-code={item.bankNo} onClick={handleClickBankItem}>
              <p>{item.bankName}</p>
              <span>{item.bankNo}</span>
            </li>
          )) }
        </ul>

        <ul>
          <li>銀行清單</li>
          <div className="searchCodeArea">
            <FEIBInputLabel>代碼搜尋</FEIBInputLabel>
            <FEIBInput
              type="text"
              placeholder="請輸入代碼或是銀行名稱"
              onChange={(event) => setSearchValue(event.target.value)}
            />
          </div>
          { filteredBankList?.length ? renderBankCode(filteredBankList) : null }
        </ul>
      </DialogContent>
    </BankCodeWrapper>
  );
};

export default BankCode;
