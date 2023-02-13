import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import parse from 'html-react-parser';

// import Main from 'components/Layout';
import Loading from 'components/Loading';
import Accordion from 'components/Accordion';
import Layout from 'components/Layout/Layout';
import { FEIBSwitch } from 'components/elements';
import BottomAction from 'components/BottomAction';
import { PhoneIcon, TransactionIcon } from 'assets/images/icons';
import SuccessFailureAnimations from 'components/SuccessFailureAnimations';
import { Func } from 'utilities/FuncID';

import { useNavigation } from 'hooks/useNavigation';
import { getAutoDebits, getCreditCardTerms } from './api';
import { ResultWrapper } from './R00400.style';

/**
 * R00400 信用卡 付款結果頁
 */
const Page = () => {
  const history = useHistory();
  const location = useLocation();
  const {startFunc, closeFunc} = useNavigation();
  const [autoDebitInfo, setAutoDebitInfo] = useState();
  const [terms, setTerms] = useState();

  const renderBottomAction = (isSuccess) => (
    <BottomAction position={0}>
      { isSuccess ? (
        <button type="button" onClick={() => startFunc(Func.C007.id)}>
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

  const renderAutoDebitInfo = (isSuccess) => {
    if (!isSuccess) return null;

    if (!autoDebitInfo || autoDebitInfo.status !== '2') {
      return (
        <div className="bluelineBottom">
          <div>
            <div className="mb-2 text-gray">您尚未申請自動扣繳</div>
            <div className="deduct">
              <div>自動扣繳</div>
              <FEIBSwitch onChange={() => history.push('/R00500')} />
            </div>
          </div>
          <Accordion title="注意事項">
            { terms ? parse(terms) : <Loading space="both" isCentered /> }
          </Accordion>
        </div>
      );
    }

    return (
      <div className="auto text-gray">
        <div>您已申請自動扣繳</div>
        <button type="button" onClick={() => history.push('/R00500')}>
          <i className="circle" />
          設定自動扣繳
        </button>
      </div>
    );
  };

  // 拿取「信用卡自動扣繳資訊」 以及 「信用卡注意事項」
  useEffect(async () => {
    const autoDebitsRes = await getAutoDebits();
    if (autoDebitsRes && autoDebitsRes.length) {
      const foundAutoDebit = autoDebitsRes.find((debit) => debit.account === location.state.account);
      setAutoDebitInfo(foundAutoDebit);
    }

    const cardTermsRes = await getCreditCardTerms();
    setTerms(cardTermsRes);
  }, []);

  // ===== Guard，若沒有 location.state 屬於不正常操作，直接結束本服務 =====
  if (!location.state || !('payResult' in location.state)) return closeFunc();
  const { payResult: {isSuccess, message, code} } = location.state;

  return (
    <Layout title="轉帳結果">
      <ResultWrapper>
        <div className="resultContainer">
          <SuccessFailureAnimations
            isSuccess={isSuccess}
            successTitle="繳款成功"
            errorTitle="繳款失敗"
            errorCode={code}
            errorDesc={message}
            errorSpace
          />
          {renderAutoDebitInfo(isSuccess)}
          { renderBottomAction(isSuccess) }
        </div>
      </ResultWrapper>
    </Layout>
  );
};

export default Page;
