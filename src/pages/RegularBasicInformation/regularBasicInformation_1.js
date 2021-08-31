import { useEffect } from 'react';
import { useHistory } from 'react-router';

/* Elements */
import {
  FEIBButton,
} from 'components/elements';
import Accordion from 'components/Accordion';
import InformationList from 'components/InformationList';
// import PasswordInput from 'components/PasswordInput';
// import { passwordValidation } from 'utilities/validation';
/* Styles */
import RegularBasicInformationWrapper from './regularBasicInformation.style';

const RegularBasicInformation1 = () => {
  const history = useHistory();

  // 跳轉結果頁
  const toResultPage = () => {
    history.push('/regularBasicInformation2');
  };

  // 更新基本資料
  const modifyPersonalData = () => {
    toResultPage();
  };

  useEffect(() => {}, []);

  return (
    <RegularBasicInformationWrapper className="confirmWrapper">
      <div className="line" />
      <div className="section">
        <InformationList title="職業類別" content="金融業" />
        <InformationList title="職稱" content="一般職員" />
        <InformationList title="個人年收入" content="50~80萬" />
      </div>
      <div className="line" />
      <div className="section">
        <Accordion title="注意事項" space="bottom">
          1.本次項目資料更新後，若客戶留存於本行之基本資料更新日距上次更新屆滿 6 個月，才會再次顯示。
          <br />
          2.如需變更其他項目請洽下列方式：
          <br />
          (1)通訊資料（通訊地址、電話）等，請臨櫃、客服電話（02-8073-1166）或本行網路銀行服務設定之基本資料變更。
          <br />
          (2)姓名、身分證字號、戶籍地址，公司負責人之資料已有變動．請親洽臨櫃辦理。
        </Accordion>
      </div>
      <FEIBButton onClick={modifyPersonalData}>
        確認
      </FEIBButton>
    </RegularBasicInformationWrapper>
  );
};

export default RegularBasicInformation1;
