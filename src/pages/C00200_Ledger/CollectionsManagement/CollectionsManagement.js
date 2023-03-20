/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import Layout from 'components/Layout/Layout';
import uuid from 'react-uuid';
import { currencySymbolGenerator, dateToString } from 'utilities/Generator';
import { FEIBButton } from 'components/elements';
import { CrossCircleIcon } from 'assets/images/icons';
import theme from 'themes/theme';
import PageWrapper from './CollectionsManagement.style';
// import { mockInvoiceCollections } from './mockData';
import { getInvoice, ownerCancelCharge, partnerCancelCharge } from './api';

export default () => {
  const history = useHistory();
  // 偵測 state 來決定是 Owner 請款管理/ Owner 收款管理/ Partner 付款管理 / Partner 請款管理
  const { state } = useLocation();
  if (!state) history.goBack(); // Guard
  const {type} = state;
  // const type = 1;

  // TODO API 回傳的 key 值都待確認中
  const initialInvoice = {
    1: [{ title: '待付款給帳本', id: 'ledger' }, { title: '待付款給成員', id: 'partner' }, { title: '已請款', id: 'completed' }],
    2: [{ title: '已請款', id: 'request' }, { title: '已收款', id: 'received' }],
    3: [{ title: '尚未付款', id: 'unpaid' }, { title: '已付款', id: 'paid' }],
    4: [{ title: '已請款', id: 'request' }, { title: '已收款', id: 'received' }],
  };

  const [invoice, setInvoice] = useState(initialInvoice[type]);

  const handleBodyButtonOnClick = (detail) => {
    console.log('handleBodyButtonOnClick', {type});
    switch (type) {
      // type === 2 || 4 => 取消收款
      case 2:
        ownerCancelCharge({chargeId: detail.ledgerTxId});
        break;
      case 4:
        partnerCancelCharge({chargeId: detail.ledgerTxId});
        break;
      default:
        //  => 前往轉帳頁 TODO: param
        history.push('transferSetting');
        break;
    }
  };

  const renderHeader = () => (
    <div>
      <div>
        {type === 3 ? '請款' : ''}
        請款日
      </div>
      {(type === 2 || type === 4) ? null : <div>請款人</div> }
      <div>金額(NTD)</div>
      <div>性質</div>
      <div>說明</div>
    </div>
  );

  const renderBody = (list, showTransferBtn) => {
    if (!list) return null;
    return list.map((detail) => (
      <div key={uuid()}>
        <div>{dateToString(detail.invoiceDate)}</div>
        {(type === 2 || type === 4) ? null : <div>{detail.owner}</div>}
        <div>{currencySymbolGenerator('NTD', detail.invoiceAmount, true)}</div>
        <div>{detail.property}</div>
        <div>{detail.memo}</div>
        <div>
          {showTransferBtn ? (
            <FEIBButton
              className="btn"
              onClick={() => handleBodyButtonOnClick(detail)}
              $bgColor={(type === 2 || type === 4) ? theme.colors.state.danger : ''}
            >
              {(type === 2 || type === 4) ? '取消收款' : '轉帳'}
            </FEIBButton>
          ) : null}
        </div>
      </div>
    ));
  };

  const renderInvoiceList = () => invoice.map((item) => (
    <li key={item.id}>
      <div className="invoice-title">
        {item.title}
        {' '}
        (
        {item.list?.length ?? 0}
        )
      </div>
      <div className="invoice-content">
        {renderHeader()}
        {/* TODO 待調整 button 出現的條件 */}
        {renderBody(item.list, item.id === 'ledger')}
      </div>
    </li>
  ));

  const fetchInvoice = async () => {
    const res = await getInvoice(type);

    setInvoice((prevInvoice) => {
      const updatedInvoice = [...prevInvoice]; // shallow copy
      updatedInvoice.forEach((item) => {
        item.list = res[item.id];
      });
      return updatedInvoice;
    });
  };

  useEffect(() => {
    fetchInvoice();
  }, []);

  return (
    <Layout title="帳本 Owner 請款管理" goBackFunc={() => history.goBack()}>
      <PageWrapper>
        <div className="drawer">
          <ul>{renderInvoiceList()}</ul>
        </div>
      </PageWrapper>
    </Layout>
  );
};
