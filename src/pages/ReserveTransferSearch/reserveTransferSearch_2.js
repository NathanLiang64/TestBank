/* eslint-disable no-unused-vars */
import { useCheckLocation, usePageInfo } from 'hooks';

/* Elements */
import { FEIBButton } from 'components/elements';
import InformationList from 'components/InformationList';
import Accordion from 'components/Accordion';

/* Styles */
import SuccessImage from 'assets/images/stateSuccess.svg';
import ErrorImage from 'assets/images/stateError.svg';
import AddPersonIcon from 'assets/images/addPersonIcon.svg';
import ReserveTransferSearchWrapper from './reserveTransferSearch.style';

const ReserveTransferSearch2 = () => {
  const isSuccess = true;

  useCheckLocation();
  usePageInfo('/api/reserveTransferSearch1');

  return (
    <ReserveTransferSearchWrapper className={!isSuccess && 'resultFail'}>
      {
        // 成功畫面
        isSuccess && (
          <>
            <section className="resultDataContainer">
              <div className="stateContainer">
                <img className="stateImage" src={SuccessImage} alt="" />
                <div className="stateContent success">
                  設定成功
                </div>
              </div>
              <div className="dataLabel">轉出金額與轉入帳號</div>
              <div className="balance">$300</div>
              <div className="accountInfo">遠東商銀（805）</div>
              <div className="accountInfo">043000990000</div>
              <div className="addPerson">
                <img src={AddPersonIcon} alt="" />
                加入常用轉帳
              </div>
            </section>
            <div className="line" />
            <section className="informationListContainer">
              <InformationList title="轉出帳號" content="04300499001234" remark="保時捷車友會" />
              <InformationList title="預約轉帳日" content="2021/05/15" />
              <InformationList title="週期" content="每個月15號" remark="預計轉帳10次｜成功2次｜失敗0次" />
              <InformationList title="期間" content="2021/05 ~ 2022/02/28" />
            </section>
            <section className="accordionContainer">
              <Accordion title="詳細交易" space="bottom">
                <InformationList title="預約設定日" content="2021/03/05" />
                <InformationList title="預約轉帳總金額" content="$200,000" />
                <InformationList title="帳戶餘額" content="$20,000" remark="保時捷車友會" />
                <InformationList title="備註" content="聖誕節禮物" />
              </Accordion>
            </section>
            <section className="buttonContainer">
              <FEIBButton>確認</FEIBButton>
            </section>
          </>
        )
      }
      {
        // 失敗畫面
        !isSuccess && (
          <>
            <section className="resultDataContainer">
              <div className="stateContainer">
                <img className="stateImage" src={ErrorImage} alt="" />
                <div className="stateContent fail">
                  設定失敗
                </div>
              </div>
              <div className="dataLabel">設定逾時</div>
            </section>
            <section className="buttonContainer">
              <FEIBButton>確認</FEIBButton>
            </section>
          </>
        )
      }
    </ReserveTransferSearchWrapper>
  );
};

export default ReserveTransferSearch2;
