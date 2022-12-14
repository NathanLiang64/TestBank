/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { FEIBErrorMessage, FEIBInput, FEIBInputLabel } from 'components/elements';
import { ListIcon } from 'assets/images/icons';
import { useController } from 'react-hook-form';
import { getBankCode } from 'utilities/CacheData';
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

export default BankCodeInputField;
