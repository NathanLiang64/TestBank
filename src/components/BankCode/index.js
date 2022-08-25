import { useState, useEffect } from 'react';
import { DialogTitle, DialogContent } from '@material-ui/core';
import { FEIBIconButton, FEIBInput, FEIBInputLabel } from 'components/elements';
import { CrossIcon } from 'assets/images/icons';
import theme from 'themes/theme';
import BankCodeWrapper from './bankCode.style';

const BankCode = ({ banks, onClose, onSelected }) => {
  const [favoriteBankList, setFavoriteBankList] = useState();
  const [searchValue, setSearchValue] = useState();

  /**
   *- 初始化
   */
  useEffect(async () => {
    setFavoriteBankList(banks.filter((b) => b.bankNo === '805')); // TODO 加入常用銀行清單，存入 localStrorage
  }, []);

  /**
   * 回傳選擇的銀行代碼及名稱。
   * @param {*} bank 選擇的銀行
   */
  const onBankSelected = (bank) => {
    onClose();
    onSelected(bank);
  };

  /**
   * 依篩選條件列出銀行清單，未設定條件時全部列出。
   */
  const BankList = () => {
    const newBanks = banks.filter((b) => !searchValue || searchValue === '' || b.bankNo.includes(searchValue) || b.bankName.includes(searchValue));
    return newBanks.map((bank) => (
      <li key={bank.bankNo} data-code={bank.bankNo} onClick={() => onBankSelected(bank)}>
        <p>{bank.bankName}</p>
        <span>{bank.bankNo}</span>
      </li>
    ));
  };

  /**
   * HTML輸出。
   */
  return (
    <BankCodeWrapper
      open
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
          { favoriteBankList?.map((bank) => (
            <li key={bank.bankNo} data-code={bank.bankNo} onClick={() => onBankSelected(bank)}>
              <p>{bank.bankName}</p>
              <span>{bank.bankNo}</span>
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
          <BankList />
        </ul>
      </DialogContent>
    </BankCodeWrapper>
  );
};

export default BankCode;
