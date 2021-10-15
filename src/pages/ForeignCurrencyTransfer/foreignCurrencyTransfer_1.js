import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';

/* Elements */
import InformationList from 'components/InformationList';
import { FEIBButton } from 'components/elements';

/* Styles */
import ForeignCurrencyTransferWrapper from './foreignCurrencyTransfer.style';

const ForeignCurrencyTransfer1 = () => {
  const history = useHistory();

  // 確認進行轉帳
  const applyTransfer = () => {
    history.push('/foreignCurrencyTransfer2');
  };

  useCheckLocation();
  usePageInfo('/api/foreignCurrencyTransfer1');

  useEffect(() => {}, []);

  return (
    <ForeignCurrencyTransferWrapper className="confirmAndResult">
      <div className="confrimDataContainer lighterBlueLine">
        <div className="dataLabel">轉出金額與轉入帳號</div>
        <div className="balance">£100.00</div>
        <div className="accountInfo">遠東商銀(805)</div>
        <div className="accountInfo">00200701710979</div>
      </div>
      <div className="infoListContainer">
        <div>
          <InformationList title="轉出帳號" content="00200700001234" />
          <InformationList title="帳戶餘額" content="£ 5,240.56" />
          <InformationList title="時間" content="2021/09/10" />
          <InformationList title="匯款性質分類" content="本人自行帳戶轉帳" />
          <InformationList title="備註" content="聖誕節禮物" />
        </div>
        <div className="btnContainer">
          <FEIBButton onClick={applyTransfer}>確認</FEIBButton>
          <div className="warnText">轉帳前多思考，避免被騙更苦惱</div>
        </div>
      </div>
    </ForeignCurrencyTransferWrapper>
  );
};

export default ForeignCurrencyTransfer1;
