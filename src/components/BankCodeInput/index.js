import { useState } from 'react';
import { FormatListBulletedRounded } from '@material-ui/icons';
import BankCode from 'components/BankCode';
import { FEIBErrorMessage, FEIBInput, FEIBInputLabel } from 'components/elements';

const BankCodeInput = () => {
  const [openBankCodeList, setOpenBankCodeList] = useState(false);
  const [selectBank, setSelectBank] = useState('');
  return (
    <>
      <FEIBInputLabel>銀行代碼</FEIBInputLabel>
      <FEIBInput
        type="text"
        placeholder="請選擇"
        readOnly
        value={selectBank}
        $icon={<FormatListBulletedRounded />}
        $iconFontSize={2.4}
        $iconOnClick={() => setOpenBankCodeList(true)}
      />
      <FEIBErrorMessage>請選擇銀行代碼</FEIBErrorMessage>
      <BankCode
        isOpen={openBankCodeList}
        onClose={() => setOpenBankCodeList(false)}
        onSelect={(value) => setSelectBank(value)}
      />
    </>
  );
};

export default BankCodeInput;
