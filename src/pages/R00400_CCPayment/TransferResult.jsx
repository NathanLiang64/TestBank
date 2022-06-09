import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import parse from 'html-react-parser';

import {
  PhoneIcon, TransactionIcon,
} from 'assets/images/icons';
import { FEIBSwitch } from 'components/elements';
import Layout from 'components/Layout/Layout';
import Main from 'components/Layout';
import Loading from 'components/Loading';
import BottomAction from 'components/BottomAction';
import SuccessFailureAnimations from 'components/SuccessFailureAnimations';
import Accordion from 'components/Accordion';

import {
  getCreditCardTerms,
} from './api';
import PageWrapper from './TransferResult.style';

/**
 * R00400 信用卡 付款結果頁
 */
const Page = () => {
  const history = useHistory();
  const location = useLocation();
  const [result, setResult] = useState();
  const [terms, setTerms] = useState();

  useEffect(async () => {
    if (location.state && ('isSuccessful' in location.state)) {
      setResult(location.state);
    }
  }, []);

  const lazyLoadTerms = async () => {
    if (!terms) setTerms(await getCreditCardTerms());
  };

  const renderBottomAction = (success) => (
    <BottomAction>
      { success ? (
        <button type="button" onClick={() => history.push('/C00700')}>
          回信用卡首頁
        </button>
      ) : (
        <>
          <button type="button" onClick={() => window.open('tel:+886280731166')}>
            <PhoneIcon />
            聯絡客服
          </button>
          <div className="divider" />
          <button type="button" onClick={() => history.goBack()}>
            <TransactionIcon />
            重新轉帳
          </button>
        </>
      ) }
    </BottomAction>
  );

  return (
    <Layout title="轉帳結果" goBackFunc={history.goBack()}>
      <Main>
        <PageWrapper>
          <SuccessFailureAnimations
            isSuccess={result?.isSuccessful}
            successTitle="繳款成功"
            errorTitle="繳款失敗"
            errorCode="E341"
            errorDesc="親愛的客戶，您好非約定轉帳超過當日轉帳限額，請重新執行交易，如有疑問，請與本行客戶服務中心聯繫。"
            errorSpace
          />
          { result?.isSuccessful && !(result?.autoDeduct) && (
            <>
              <div>
                <div className="mb-2">您尚未申請自動扣繳</div>
                <div className="deduct">
                  <div>自動扣繳</div>
                  <FEIBSwitch onChange={() => history.push('/R00500')} />
                </div>
              </div>
              <Accordion title="注意事項" onClick={lazyLoadTerms}>
                { terms ? parse(terms) : <Loading space="both" isCentered /> }
              </Accordion>
            </>
          )}
          { result?.isSuccessful && result?.autoDeduct && (
            <div className="auto">
              <div>您已申請自動扣繳</div>
              <a href="/">設定自動扣繳</a>
            </div>
          )}
          { renderBottomAction(result?.isSuccessful) }
        </PageWrapper>
      </Main>
    </Layout>
  );
};

export default Page;
