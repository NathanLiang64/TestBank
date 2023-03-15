/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { accountFormatter, toCurrency } from 'utilities/Generator';

import { FEIBButton } from 'components/elements';
import InformationList from 'components/InformationList';
import Layout from 'components/Layout/Layout';
import { handleTxUsageText } from '../utils/usgeType';

import { PageWrapper } from './RecordDetail.style';
import { state } from './mockData';

const RecordDetail = () => {
  const history = useHistory();
  const [model, setModel] = useState();
  // const { state } = useLocation(); // TODO 解開註解移除mock

  const renderInformationContent = (title, info) => <InformationList title={title} content={info} />;

  // to Edit
  const handleEditOnClick = () => history.push('/editRecordForm', model);

  useEffect(() => {
    // get model
    setModel(state);
  }, []);

  return (
    <Layout title="編輯交易明細" goBackFunc={() => {}}>
      {model && (
      <PageWrapper>
        <div className="info">
          {renderInformationContent('交易日期', model.txDate)}
          {renderInformationContent('轉出成員', model.bankeeMember.memberNickName ?? '--')}
          {renderInformationContent('銀行代號', model.bankCode)}
          {renderInformationContent('轉出帳號', accountFormatter(model.bankAccount, model.bankCode === '805'))}
          {renderInformationContent('轉出金額', `NTD${toCurrency(model.txnAmount)}`)}
          {renderInformationContent('性質', handleTxUsageText(model.txUsage))}
          {renderInformationContent('說明', model.txDesc ?? '--')}
        </div>
        {(model.editable && model.owner) && <FEIBButton onClick={handleEditOnClick}>編輯</FEIBButton>}
      </PageWrapper>
      )}
    </Layout>
  );
};

export default RecordDetail;
