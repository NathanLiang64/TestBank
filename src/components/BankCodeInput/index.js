import { useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import BankCode from 'components/BankCode';
import { FEIBErrorMessage, FEIBInput, FEIBInputLabel } from 'components/elements';
import { ListIcon } from 'assets/images/icons';

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
  rules,
  errorMessage,
  bankCode,
}) => {
  // console.log('bankCode', bankCode);
  const [openBankCodeList, setOpenBankCodeList] = useState(false);
  const [selectBank, setSelectBank] = useState(bankCode || { bankNo: '', bankName: '' });

  const handleSelectBankCode = (object) => {
    setSelectBank(object);
    setValue(id, object);
    trigger(id);
  };

  useEffect(() => {
    // console.log('selectBank', selectBank);
    if (bankCode && (!selectBank.bankNo && !selectBank.bankName)) {
      setSelectBank(bankCode);
    } else {
      setSelectBank(selectBank);
    }
  }, [bankCode]);

  return (
    <>
      <FEIBInputLabel htmlFor="bankCode">銀行代碼</FEIBInputLabel>
      <Controller
        name={id}
        defaultValue={selectBank.bankNo && selectBank.bankName ? `${selectBank.bankNo} ${selectBank.bankName}` : ''}
        control={control}
        rules={rules}
        render={({ field }) => (
          <FEIBInput
            {...field}
            id={id}
            name={id}
            type="text"
            placeholder="請選擇"
            value={selectBank.bankNo && selectBank.bankName ? `${selectBank.bankNo} ${selectBank.bankName}` : ''}
            $icon={<ListIcon />}
            $iconFontSize={2.4}
            $iconOnClick={() => setOpenBankCodeList(true)}
            readOnly
            error={!!errorMessage}
            onClick={() => setOpenBankCodeList(true)}
          />
        )}
      />
      <FEIBErrorMessage>{errorMessage}</FEIBErrorMessage>
      <BankCode
        isOpen={openBankCodeList}
        onClose={() => setOpenBankCodeList(false)}
        onSelect={handleSelectBankCode}
      />
    </>
  );
};

export default BankCodeInput;
