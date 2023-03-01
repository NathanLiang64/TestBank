import { Box } from '@material-ui/core';
import Layout from 'components/Layout/Layout';
import InformationList from 'components/InformationList';
import { FEIBButton } from 'components/elements';
import Accordion from 'components/Accordion';
import PageWrapper from './AbortLedgerConfirm.style';

export default () => {
  const CONFIG = [
    { id: 1, label: '帳本名稱', value: '' },
    { id: 2, label: '帳本餘額', value: '' },
    { id: 3, label: '連結帳號', value: '' },
    { id: 4, label: '帳本類型', value: '' },
    { id: 5, label: '帳本驗證碼*', value: '' },
  ];

  return (
    <Layout title="終止帳本" goBackFunc={() => {}}>
      <PageWrapper>
        <Box className="pageTitle">確認資料</Box>
        {CONFIG.map((item) => (
          <InformationList
            key={item.id}
            title={item.label}
            content={item.value}
          />
        ))}
        <Accordion title="注意事項" space="top" open>
          帳本終止後，帳本明細會發送給帳本成員，請設定帳本明細驗證碼
        </Accordion>
        <FEIBButton style={{ marginTop: 20 }}>確認</FEIBButton>
      </PageWrapper>
    </Layout>
  );
};
