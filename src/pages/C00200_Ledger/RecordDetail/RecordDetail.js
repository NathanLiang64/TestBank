import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { toCurrency } from 'utilities/Generator';

import { FEIBButton } from 'components/elements';
import InformationList from 'components/InformationList';
import Layout from 'components/Layout/Layout';

import { PageWrapper } from './RecordDetail.style';
import { getLedgerTx } from './api';

const RecordDetail = () => {
  const history = useHistory();
  const [model, setModel] = useState();

  const renderInformationContent = (title, info) => <InformationList title={title} content={info} />;

  // to Edit
  const handleEditOnClick = () => history.push('/editRecordForm', model);

  useEffect(() => {
    // get model
    const response = getLedgerTx({ledgerTxId: '001'});
    setModel(response);
  }, []);

  return (
    <Layout title="編輯交易明細" goBackFunc={() => {}}>
      {model && (
      <PageWrapper>
        <div className="info">
          {renderInformationContent('交易日期', model.txDate)}
          {renderInformationContent('轉出成員', model.memberNickName ?? '--')}
          {renderInformationContent('銀行代號', model.bankCode)}
          {renderInformationContent('轉出帳號', model.bankAccount)}
          {renderInformationContent('轉出金額', `NTD${toCurrency(model.txAmount)}`)}
          {renderInformationContent('性質', model.txUsageName)}
          {renderInformationContent('備註', model.txDesc ?? '--')}
        </div>
        {(model.isEditable && model.isOwner) && <FEIBButton onClick={handleEditOnClick}>編輯</FEIBButton>}
      </PageWrapper>
      )}
    </Layout>
  );
};

export default RecordDetail;
