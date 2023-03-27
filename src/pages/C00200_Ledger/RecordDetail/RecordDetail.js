/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { accountFormatter, toCurrency } from 'utilities/Generator';

import { FEIBButton } from 'components/elements';
import InformationList from 'components/InformationList';
import Layout from 'components/Layout/Layout';
import { Func } from 'utilities/FuncID';
import { handleTxUsageText } from '../utils/usgeType';

import { PageWrapper } from './RecordDetail.style';

const RecordDetail = () => {
  const history = useHistory();
  const [model, setModel] = useState();
  const { state } = useLocation();

  /* 明細內容 */
  const renderInformationContent = (title, info) => <InformationList title={title} content={info} />;

  /* 前往編輯頁 */
  const handleEditOnClick = () => history.push('/editRecordForm', model);

  const goBackFunc = () => history.goBack();

  useEffect(() => {
    /* get model */
    setModel(state);
  }, []);

  return (
    <Layout title="編輯交易明細" fid={Func.C002} goBackFunc={goBackFunc}>
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
        {/* 已入帳單筆交易明細暫時不能編輯，進入RecordDetail頁者，若非未入帳交易明細者，不顯示編輯按鈕 */}
        {(model.editable && model.owner && model.txStatus !== 1) && <FEIBButton onClick={handleEditOnClick}>編輯</FEIBButton>}
      </PageWrapper>
      )}
    </Layout>
  );
};

export default RecordDetail;
