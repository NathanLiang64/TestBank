import { useState, useEffect } from 'react';
import { DialogTitle, DialogContent } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { bankList as taiwanBankList } from 'taiwan-bank-data';
import { FEIBIconButton, FEIBInput, FEIBInputLabel } from 'components/elements';
import theme from 'themes/theme';
import BankCodeWrapper from './bankCode.style';

const BankCode = ({ isOpen, onClose, onSelect }) => {
  const [searchValue, setSearchValue] = useState('');
  const [bankList, setBankList] = useState(taiwanBankList);

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
      bankCode: selectedBank[1],
      bankName: selectedBank[0],
    });
    // onSelect(`${selectedBank[1]} ${selectedBank[0]}`);
    onClose();
  };

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
          <li>
            <p>遠東銀行</p>
            <span>805</span>
          </li>
          {/* { TODO: 最近10筆裡面最常使用的兩家銀行；若最近十筆都是不同的銀行 (No.2 & No.3 次數相同) ，隨User使用次數把資料帶回來，預設是遠銀 } */}
          <li>
            <p>匯豐銀行</p>
            <span>081</span>
          </li>
          <li>
            <p>台灣企銀</p>
            <span>050</span>
          </li>
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
