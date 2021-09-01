import { useState, useEffect } from 'react';
import { DialogTitle, DialogContent } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { bankList as taiwanBankList } from 'taiwan-bank-data';
import { FEIBIconButton, FEIBInput, FEIBInputLabel } from 'components/elements';
import theme from 'themes/theme';
import BankCodeWrapper from './bankCode.style';
import { doGetInitData } from '../../apis/transferApi';

const BankCode = ({ isOpen, onClose, onSelect }) => {
  const [searchValue, setSearchValue] = useState('');
  const [bankList, setBankList] = useState(taiwanBankList);
  const [favoriteBankList, setFavoriteBankList] = useState([]);

  const handleClickBankItem = (event) => {
    // 初始化
    setSearchValue('');
    setBankList(taiwanBankList);
    // 回傳選擇的銀行代碼
    const selectedBank = [];
    for (const bank of event.currentTarget.children) {
      selectedBank.push(bank.innerText);
    }
    onSelect({
      bankNo: selectedBank[1],
      bankName: selectedBank[0],
    });
    // onSelect(`${selectedBank[1]} ${selectedBank[0]}`);
    onClose();
  };

  useEffect(async () => {
    const response = await doGetInitData('/api/getFavoriteBankCodeList');
    if (response.favoriteBankCodeList) setFavoriteBankList(response.favoriteBankCodeList);
  }, []);

  useEffect(() => {
    if (searchValue) {
      const filteredBankList = taiwanBankList.filter((bank) => (
        bank.code.includes(searchValue) || bank.name.includes(searchValue)
      ));
      setBankList(filteredBankList);
    } else {
      setBankList(taiwanBankList);
    }
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
        <FEIBIconButton
          className="closeButton"
          $fontSize={2}
          $iconColor={theme.colors.text.lightGray}
          onClick={onClose}
        >
          <Close />
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
          {
            bankList.map((bank) => (
              <li key={bank.code} data-code={bank.code} onClick={handleClickBankItem}>
                <p>{bank.name}</p>
                <span>{bank.code}</span>
              </li>
            ))
          }
        </ul>
      </DialogContent>
    </BankCodeWrapper>
  );
};

export default BankCode;
