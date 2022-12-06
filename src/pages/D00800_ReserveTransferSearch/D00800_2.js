import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { toCurrency } from 'utilities/Generator';

import Accordion from 'components/Accordion';
import Layout from 'components/Layout/Layout';
import { FEIBButton } from 'components/elements';
import InformationList from 'components/InformationList';
import SuccessFailureAnimations from 'components/SuccessFailureAnimations';
import AddPersonIcon from 'assets/images/addPersonIcon.svg';

import { ReserveTransferSearchWrapper } from './D00800.style';

const ReserveTransferSearch2 = ({ location }) => {
  const history = useHistory();
  const [isSuccess, setIsSuccess] = useState(false);

  const toSearchPage = () => {
    history.push('/reserveTransferSearch');
  };

  useEffect(() => {
    console.log(location);
    setIsSuccess(!location.state?.code);
  }, []);

  return (
    <Layout title="取消預約轉帳">
      <ReserveTransferSearchWrapper className={!isSuccess && 'resultFail'}>
        <SuccessFailureAnimations isSuccess={isSuccess} successTitle="設定成功" errorTitle="設定失敗" />
        {
          // 成功畫面
          isSuccess && (
            <>
              <section className="resultDataContainer">
                <div className="dataLabel">轉出金額與轉入帳號</div>
                <div className="balance">
                  $
                  {
                    location.state.amount
                  }
                </div>
                <div className="accountInfo">
                  { location.state?.inBankName }
                  (
                  { location.state?.inBank }
                  )
                </div>
                <div className="accountInfo">{location.state?.inActNo}</div>
                <div className="addPerson">
                  <img src={AddPersonIcon} alt="" />
                  加入常用轉帳
                </div>
              </section>
              <div className="line" />
              <section className="informationListContainer">
                <InformationList title="轉出帳號" content={location.state?.accountId} remark={location.state?.showName} />
                <InformationList title="預約轉帳日" content={location.state?.payDate} />
                {
                  location.state.chargeMode === '1'
                    ? (<InformationList title="週期" content="單次" remark="" />)
                    : (<InformationList title="週期" content={location.state?.payDateWording} remark="" />)
                }
                {
                  (location.state?.chargeMode === 'W' || location.state?.chargeMode === 'M') && (<InformationList title="期間" content="2021/05 ~ 2022/02/28" />)
                }
              </section>
              <section className="accordionContainer">
                <Accordion title="詳細交易" space="bottom">
                  <InformationList title="預約設定日" content={location.state?.trnsDate} />
                  {/* {
                    location.state.bookType === '2' && (<InformationList title="預約轉帳總金額" content="$200,000" />)
                  } */}
                  <InformationList title="帳戶餘額" content={`${toCurrency(location.state?.balance)}`} remark={location.state?.showName} />
                  <InformationList title="備註" content={location.state?.remark} />
                </Accordion>
              </section>
            </>
          )
        }
        {
          // 失敗畫面
          !isSuccess && (
            <div className="cancleMessage">
              { location.state?.message }
            </div>
          )
        }
        <section className="buttonContainer">
          <FEIBButton onClick={toSearchPage}>確認</FEIBButton>
        </section>
      </ReserveTransferSearchWrapper>
    </Layout>
  );
};

export default ReserveTransferSearch2;
