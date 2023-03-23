import { useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import Layout from 'components/Layout/Layout';
import InformationList from 'components/InformationList';
import { FEIBButton } from 'components/elements';
import ResultAnimation from 'components/SuccessFailureAnimations/ResultAnimation';
import PageWrapper from './AbortLedgerSuccess.style';
import { getLedgerTypeName } from '../utils/lookUpTable';

export default () => {
  const history = useHistory();
  const location = useLocation();
  // 狀態設定
  const { state } = location;
  const [viewModel] = useState(state || {});

  // 欄位設定
  const CONFIG = [
    { id: 1, label: '帳本名稱', value: viewModel.ledgerName },
    { id: 2, label: '連結帳號', value: viewModel.bankeeAccount?.accountNumber },
    { id: 3, label: '關閉日期', value: new Date().toLocaleDateString() },
    {
      id: 4,
      label: '帳本類型',
      value: getLedgerTypeName(viewModel.ledgerType),
    },
    { id: 5, label: '帳本餘額', value: viewModel.ledgerAmount },
    { id: 6, label: '帳本驗證碼', value: viewModel.verifyCode },
  ];

  // 點擊 - 確認
  const onConfirmClick = () => {
    history.push('/C00200');
  };

  return (
    <Layout title="終止帳本" goBackFunc={() => history.push('/C00200')}>
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
        <FEIBButton onClick={onConfirmClick} style={{ margin: '20px auto' }}>
          確認
        </FEIBButton>
      </PageWrapper>
    </Layout>
  );
};
