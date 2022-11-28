import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';

/* Elements */
import {
  FEIBButton,
} from 'components/elements';
import Accordion from 'components/Accordion';
import InformationList from 'components/InformationList';

/* Styles */
import RegularBasicInformationWrapper from './regularBasicInformation.style';

const RegularBasicInformation1 = ({ location }) => {
  const history = useHistory();

  const [confirmData, setConfirmData] = useState({
    income: '02',
    incomeLabel: '30-50萬',
    industry: '0307',
    industryLabel: '製造業',
    title: '02',
    titleLabel: '法人董事之董事長',
  });

  // 跳轉結果頁
  const toResultPage = (result) => {
    history.push('/regularBasicInformation2', result);
  };

  // 更新基本資料
  const modifyPersonalData = async () => {
    // const modifyData = {
    //   jobCd: confirmData.industry,
    //   grade: confirmData.title,
    //   inCome: confirmData.income,
    // };
    // const modifyResponse = await regularBasicInformationApi.modifyRegularBasicInformation(modifyData);
    // const { grade, inCome, jobCd } = modifyResponse;
    // if (grade && inCome && jobCd) {
    //   toResultPage(true);
    // } else {
    //   toResultPage(false);
    // }
    toResultPage(true);
  };

  useEffect(() => {
    setConfirmData(location.state);
  }, []);

  return (
    <RegularBasicInformationWrapper className="confirmWrapper">
      <div className="section lighterBlueLine">
        <InformationList title="職業類別" content={confirmData.industryLabel} />
        <InformationList title="職稱" content={confirmData.titleLabel} />
        <InformationList title="個人年收入" content={confirmData.incomeLabel} />
      </div>
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
