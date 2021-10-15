import { useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { bankList as taiwanBankList } from 'taiwan-bank-data';
import { DialogContent, DialogTitle } from '@material-ui/core';
import { Close, FormatListBulletedRounded } from '@material-ui/icons';
import {
  FEIBErrorMessage, FEIBIconButton, FEIBInput, FEIBInputLabel,
} from 'components/elements';
import BankCodeWrapper from '../../components/BankCode/bankCode.style';
import theme from '../../themes/theme';
import mockData from './mockData';

/*
* ================== BankCodeInput 組件說明 ==================
* BankCodeInput 組件封裝了 Input 和 BankCode 清單
* ================== BankCodeInput 可傳參數 ==================
* *** 所有參數皆供表單驗證與取值用 ***
* 1. id -> Input 的 id、name、Controller 的 name 均會代入此參數
*    此組件將根據上述 4 種不同狀態而產生不同的樣式色彩，預設為 "error"
* 2. control -> 傳入 react-hook-form 的 control 參數
* 3. setValue -> 傳入 react-hook-form 的 setValue 參數
* 4. trigger -> 傳入 react-hook-form 的 trigger 參數
* 5. errorMessage -> 表單驗證的錯誤訊息
* 6. bankCode -> 若原先就有 bankCode 值，可傳入，若無則預設為帶有 2 個空字串的物件
* */

const BankCodeInput = ({
  id,
  control,
  setValue,
  trigger,
  errorMessage,
  bankCode,
}) => {
  const [bankList, setBankList] = useState(taiwanBankList);
  const [searchValue, setSearchValue] = useState('');
  const [openBankCodeList, setOpenBankCodeList] = useState(false);
  const [selectBank, setSelectBank] = useState(bankCode || { bankNo: '', bankName: '' });
  const [favoriteBankList, setFavoriteBankList] = useState([]);

  const handleSelectBankCode = (object) => {
    setSelectBank(object);
    setValue(id, object);
    trigger(id);
  };

  const handleClickBankItem = (event) => {
    // 初始化
    setSearchValue('');
    setBankList(taiwanBankList);
    // 回傳選擇的銀行代碼
    const selectedBank = [];
    for (const bank of event.currentTarget.children) {
      selectedBank.push(bank.innerText);
    }
    handleSelectBankCode({
      bankNo: selectedBank[1],
      bankName: selectedBank[0],
    });
    // onSelect(`${selectedBank[1]} ${selectedBank[0]}`);
    setOpenBankCodeList(false);
  };

  useEffect(() => {
    setFavoriteBankList(mockData.getFavoriteBankCodeList.favoriteBankCodeList);
  }, []);

  useEffect(() => {
    if (bankCode && (!selectBank.bankNo && !selectBank.bankName)) {
      setSelectBank(bankCode);
    } else {
      setSelectBank(selectBank);
    }
  }, [bankCode]);

  useEffect(() => {
    if (searchValue) {
      const filteredBankList = taiwanBankList.filter((bank) => bank.code.includes(searchValue) || bank.name.includes(searchValue));
      setBankList(filteredBankList);
    } else {
      setBankList(taiwanBankList);
    }
  }, [searchValue]);

  return (
    <>
      <FEIBInputLabel htmlFor="bankCode">銀行代碼</FEIBInputLabel>
      <Controller
        name={id}
        defaultValue={selectBank.bankNo && selectBank.bankName ? `${selectBank.bankNo} ${selectBank.bankName}` : ''}
        control={control}
        render={({ field }) => (
          <FEIBInput
            {...field}
            id={id}
            name={id}
            type="text"
            placeholder="請選擇"
            value={selectBank.bankNo && selectBank.bankName ? `${selectBank.bankNo} ${selectBank.bankName}` : ''}
            $icon={<FormatListBulletedRounded />}
            $iconFontSize={2.4}
            $iconOnClick={() => setOpenBankCodeList(true)}
            readOnly
            error={!!errorMessage}
            onClick={() => setOpenBankCodeList(true)}
          />
        )}
      />
      <FEIBErrorMessage>{errorMessage}</FEIBErrorMessage>
      <BankCodeWrapper
        open={openBankCodeList}
        onClose={() => setOpenBankCodeList(false)}
        aria-labelledby="taiwan-bank-code-list"
        aria-describedby="taiwan-bank-code-list"
      >
        <DialogTitle>
          <span className="title">銀行代碼</span>
          <FEIBIconButton
            className="closeButton"
            $fontSize={2}
            $iconColor={theme.colors.text.lightGray}
            onClick={() => setOpenBankCodeList(false)}
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
    </>
  );
};

export default BankCodeInput;
