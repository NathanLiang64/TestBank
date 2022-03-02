import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { useCheckLocation, usePageInfo } from 'hooks';
import { toCurrency } from 'utilities/Generator';
import { reserveTransferSearchApi } from 'apis';

/* Elements */
import Header from 'components/Header';
import { FEIBButton } from 'components/elements';
import InformationList from 'components/InformationList';
import Accordion from 'components/Accordion';

/* Styles */
import ReserveTransferSearchWrapper from './reserveTransferSearch.style';

const ReserveTransferSearch1 = ({ location }) => {
  const history = useHistory();

  const goBack = () => history.goBack();

  const toResultPage = async () => {
    const {
      trnsDate, accountId, seqNo, source,
    } = location.state;
    const data = {
      trnsDate, acctId: accountId, seqNo, queryType: source,
    };
    const { code, message } = await reserveTransferSearchApi.cancelReserveTransfer(data);
    if (!code) {
      history.push('/reserveTransferSearch2', { ...location.state });
    } else {
      history.push('/reserveTransferSearch2', { code, message });
    }
  };

  useCheckLocation();
  usePageInfo('/api/reserveTransferSearch1');

  useEffect(() => {
    console.log(location);
  });

  return (
    <>
      <Header title="取消預約轉帳" goBack={goBack} />
      <ReserveTransferSearchWrapper>
        <section className="confrimDataContainer lighterBlueLine">
          <div className="dataLabel">轉出金額與轉入帳號</div>
          <div className="balance">
            $
            {
              location.state?.amount
            }
          </div>
          <div className="accountInfo">
            { location.state?.inBankName }
            (
            { location.state?.inBank }
            )
          </div>
          <div className="accountInfo">{location.state?.inActNo}</div>
        </section>
        <section className="informationListContainer">
          <InformationList title="轉出帳號" content={location.state?.accountId} remark={location.state?.showName} />
          <InformationList title="預約轉帳日" content={location.state?.payDate} />
          {
            location.state?.chargeMode === '1'
              ? (<InformationList title="週期" content="單次" remark="" />)
              : (<InformationList title="週期" content={location.state?.payDateWording} remark="" />)
          }
          {
            (location.state?.chargeMode === 'W' || location.state?.chargeMode === 'M') && (<InformationList title="期間" content={`${location.state?.payDate}~${location.state?.payDateEnd}`} />)
          }
        </section>
        <section className="accordionContainer">
          <Accordion title="詳細交易" space="bottom">
            <InformationList title="預約設定日" content={location.state?.trnsDate} />
            {/* {
              location.state?.bookType === '2' && (<InformationList title="預約轉帳總金額" content="$200,000" />)
            } */}
            <InformationList title="帳戶餘額" content={`${toCurrency(location.state?.balance)}`} remark={location.state?.showName} />
            <InformationList title="備註" content={location.state?.remark} />
          </Accordion>
        </section>
        <section className="buttonContainer">
          <FEIBButton onClick={toResultPage}>確認取消</FEIBButton>
        </section>
      </ReserveTransferSearchWrapper>
    </>
  );
};

export default ReserveTransferSearch1;
