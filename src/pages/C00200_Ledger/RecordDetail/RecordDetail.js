import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { toCurrency } from 'utilities/Generator';

import { FEIBButton } from 'components/elements';
import InformationList from 'components/InformationList';
import Layout from 'components/Layout/Layout';

import { handleTypeText } from '../utils/usgeType';
import { PageWrapper } from './RecordDetail.style';

const RecordDetail = () => {
  const history = useHistory();
  const [model, setModel] = useState();
  const mockModel = {
    txDate: '20220222',
    txAmount: '800',
    // txUsage: '1',
    bankCode: '812',
    bankAccount: '0000888899980001',
    // txDesc: '車票',
    // memberNickName: 'AAA', // 不確定是否是這個key
    isEditable: true,
    txStatus: 2, // 0: 不明, 1: 已入帳, 2: 未入帳
  }; // DEBUG mock data

  const renderInformationContent = (title, info) => <InformationList title={title} content={info} />;

  const handleEditOnClick = () => {
    // to Edit
    history.push('/editRecordForm', model);
  };

  useEffect(() => {
    // get model
    const response = mockModel;
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
          {renderInformationContent('性質', model.txUsage ? handleTypeText(model.txUsage) : '--')}
          {renderInformationContent('備註', model.txDesc ?? '--')}
        </div>
        {model.isEditable && <FEIBButton onClick={handleEditOnClick}>編輯</FEIBButton>}
      </PageWrapper>
      )}
    </Layout>
  );
};

export default RecordDetail;
