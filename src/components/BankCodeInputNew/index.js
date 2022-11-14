/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { FEIBErrorMessage, FEIBInput, FEIBInputLabel } from 'components/elements';
import { ListIcon } from 'assets/images/icons';
import { useController } from 'react-hook-form';
import BankCode from './bankSelector';
import { getBankCode } from './api';

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
* 6. value -> 若原先就有 value 值，可傳入，若無則預設為帶有 2 個空字串的物件
* */

const BankCodeInputNew = ({
  readonly,
  ...controlProps
}) => {
  const [bankList, setBankList] = useState();
  const [showSelector, setShowSelector] = useState();
  const { field, fieldState } = useController(controlProps);
  const {
    onChange, value, name,
  } = field;
  /**
   *- 初始化
   */
  useEffect(async () => {
    getBankCode().then((banks) => setBankList(banks));
  }, []);

  /**
   * HTML輸出。
   */
  return (
    <div style={{ pointerEvents: readonly ? 'none' : 'auto' }}>
      <>
        <FEIBInputLabel htmlFor={name}>銀行代碼</FEIBInputLabel>
        <FEIBInput
          placeholder="請選擇"
          value={`${value ?? ''} ${
            bankList?.find((b) => b.bankNo === value)?.bankName ?? ''
          }`}
          $icon={<ListIcon />}
          $iconFontSize={2.4}
          $iconOnClick={() => setShowSelector(true)}
          readOnly
          error={!!fieldState.error}
          onClick={() => setShowSelector(true)}
        />
        <FEIBErrorMessage>{fieldState.error?.message}</FEIBErrorMessage>
      </>
      {showSelector ? (
        <BankCode
          banks={bankList}
          onClose={() => setShowSelector(false)}
          onSelected={(bank) => {
            onChange(bank.bankNo);
          }}
        />
      ) : null}
    </div>
  );
};

export default BankCodeInputNew;
