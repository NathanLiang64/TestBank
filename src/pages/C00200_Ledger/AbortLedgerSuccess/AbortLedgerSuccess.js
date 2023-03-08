import { useHistory } from 'react-router';
import Layout from 'components/Layout/Layout';
import InformationList from 'components/InformationList';
import { FEIBButton } from 'components/elements';
import ResultAnimation from 'components/SuccessFailureAnimations/ResultAnimation';
import PageWrapper from './AbortLedgerSuccess.style';

export default () => {
  const history = useHistory();
  const CONFIG = [
    { id: 1, label: '帳本名稱', value: '' },
    { id: 2, label: '連結帳號', value: '' },
    { id: 3, label: '關閉日期', value: '' },
    { id: 4, label: '帳本類型', value: '' },
    { id: 5, label: '帳本餘額', value: '' },
    { id: 6, label: '帳本驗證碼', value: '' },
  ];

  // 點擊 - 確認
  const onConfirmClick = () => {
    history.push('/ClubLedgersList');
  };

  return (
    <Layout title="終止帳本" goBackFunc={() => history.goBack()}>
      <PageWrapper>
        <ResultAnimation
          isSuccess
          subject="帳本已關閉"
          descHeader="*帳本終止後，將會已推播發送明細給成員。"
          description="請注意帳本明細連結有效期限為90天"
        />
        {CONFIG.map((item) => (
          <InformationList
            key={item.id}
            title={item.label}
            content={item.value}
          />
        ))}
        <FEIBButton onClick={onConfirmClick} style={{ marginTop: 20 }}>
          確認
        </FEIBButton>
      </PageWrapper>
    </Layout>
  );
};
