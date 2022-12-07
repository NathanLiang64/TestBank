/* eslint-disable no-unused-vars */
import { useHistory } from 'react-router';

import Accordion from 'components/Accordion';
import Layout from 'components/Layout/Layout';
import { FEIBButton } from 'components/elements';
import InformationList from 'components/InformationList';
import { currencySymbolGenerator, toCurrency } from 'utilities/Generator';
import { switchLoading, transactionAuth } from 'utilities/AppScriptProxy';
import { cancelReserveTransfer } from 'pages/D00800_ReserveTransferSearch/api';

import { ReserveTransferSearchWrapper } from './D00800.style';

const ReserveTransferSearch1 = ({ location }) => {
  const history = useHistory();

  const goBack = () => history.goBack();

  const toResultPage = async () => {
    const authCode = 0x28;
    const jsRs = await transactionAuth(authCode);
    if (jsRs.result) {
      switchLoading(true);
      const {
        trnsDate, accountId, seqNo, source,
      } = location.state;
      const data = {
        trnsDate, acctId: accountId, seqNo, queryType: source,
      };
      const { code, message } = await cancelReserveTransfer(data);
      switchLoading(false);
      if (code === '0000') {
        history.push('/D008002', { ...location.state });
      } else {
        history.push('/D008002', { code, message });
      }
    }
  };

  console.log('location.state', location.state);
  return (
    <Layout title="取消預約轉帳" goBackFunc={goBack}>
      <ReserveTransferSearchWrapper>
        <section className="confrimDataContainer lighterBlueLine">
          <div className="dataLabel">轉出金額與轉入帳號</div>
          <div className="balance">
            {currencySymbolGenerator('TWD', location.state?.amount)}
          </div>
          <div className="accountInfo">
            {location.state?.inBankName}
            (
            {location.state?.inBank}
            )
          </div>
          <div className="accountInfo">{location.state?.inActNo}</div>
        </section>
        <section className="informationListContainer">
          <InformationList
            title="轉出帳號"
            content={location.state?.acctId}
            remark={location.state?.showName}
          />
          <InformationList
            title="預約轉帳日"
            content={location.state?.payDate}
          />
          {location.state?.chargeMode === '1' ? (
            <InformationList title="週期" content="單次" remark="" />
          ) : (
            <InformationList
              title="週期"
              content={location.state?.payDateWording}
              remark=""
            />
          )}
          {(location.state?.chargeMode === 'W'
            || location.state?.chargeMode === 'M') && (
            <InformationList
              title="期間"
              content={`${location.state?.payDate}~${location.state?.payDateEnd}`}
            />
          )}
        </section>
        <section className="accordionContainer">
          <Accordion title="詳細交易" space="bottom">
            <InformationList
              title="預約設定日"
              content={location.state?.trnsDate}
            />
            {/* {
              location.state?.bookType === '2' && (<InformationList title="預約轉帳總金額" content="$200,000" />)
            } */}
            <InformationList
              title="帳戶餘額"
              content={`${currencySymbolGenerator('TWD', location.state?.acctBalx)}`}
              remark={location.state?.showName}
            />
            <InformationList title="備註" content={location.state?.memo} />
          </Accordion>
        </section>
        <section className="buttonContainer">
          <FEIBButton onClick={toResultPage}>確認取消</FEIBButton>
        </section>
      </ReserveTransferSearchWrapper>
    </Layout>
  );
};

export default ReserveTransferSearch1;
