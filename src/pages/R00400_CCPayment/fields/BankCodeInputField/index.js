/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { FEIBErrorMessage, FEIBInput, FEIBInputLabel } from 'components/elements';
import { ListIcon } from 'assets/images/icons';
import { useController } from 'react-hook-form';
import { getBankCode } from 'utilities/CacheData';
import Loading from 'components/Loading';
import BankCode from './bankSelector';

/*
* ================== BankCodeInput 組件說明 ==================
* BankCodeInput 組件封裝了 Input 和 BankCode 清單
* ================== BankCodeInput 可傳參數 ==================
* *** 所有參數皆供表單驗證與取值用 ***
* 1. readonly -> 是否可選擇
* 2. controlProps -> 包含 react-hook-form 的參數，ex: {control, name, defaultValues:optional,.... }
* */

const BankCodeInputField = ({
  readonly,
  ...controlProps
}) => {
  const [bankList, setBankList] = useState();
  const [showSelector, setShowSelector] = useState();
  const { field, fieldState } = useController(controlProps);
  const { onChange, value, name } = field;
  /**
   *- 初始化
   */
  useEffect(() => {
    getBankCode().then((banks) => setBankList(banks));
    // 此 Component 在某些情況下會瞬間 unmount (ex: 切換 Tab/表單時)，
    // getBankCode 屬於 asynchronous，若 unmount 會造成 memory leaks，故在此新增 teardown function
    return () => setBankList(null);
  }, []);

  /**
   * HTML輸出。
   */
  //  在 bankList 還沒準備好之前，不應該出現 Input 欄位給使用者點擊，
  // 因為 bankList 此時還是 undefined，會造成 JavaScript Crash
  if (!bankList) return <Loading space="bottom" isCentered />;
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

export default BankCodeInputField;
