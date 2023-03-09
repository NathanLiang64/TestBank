/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { toCurrency } from 'utilities/Generator';
import { handleTypeText } from '../utils/usgeType';
import PageWrapper from './InvitationCard.style';

const InvitationCard = (cardData) => {
  const [model, setModel] = useState();
  console.log('InvitationCard');
  const paymentCardImage = <div style={{height: '16rem', width: '24rem', backgroundColor: 'grey'}}>image</div>;

  const renderInfoRow = (title, content) => (
    <div className="info_row">
      <p>{title}</p>
      <p>{content}</p>
    </div>
  );

  useEffect(() => {
    const {data} = cardData;
    setModel(data);
  }, []);
  return (
    model ? (
      <PageWrapper>
        <div>
          {console.log({model})}
          <div className="ledger_name_container">{model.ledgerName}</div>
          <div className="image_container">
            {paymentCardImage}
          </div>

          {/* 要錢卡 */}
          {model.cardType === 'REQUEST' && (
            <div>
              <div className="hint_container">{`${model.requester} 想跟 ${model.target} 收款`}</div>
              <div className="info_container">
                {renderInfoRow('金額', `NTD${toCurrency(model.amount)}`)}
                {renderInfoRow('帳本', model.ledgerName)}
                {renderInfoRow('性質', handleTypeText(model.type))}
                {renderInfoRow('說明', model.memo)}
              </div>
            </div>
          )}

          {/* 邀請卡 */}
          {model.cardType === 'INVITE' && (
            <div>
              <div className="hint_container">{`${model.requester} 邀請你加入帳本`}</div>
            </div>
          )}
        </div>
      </PageWrapper>
    ) : <></>
  );
};

export default InvitationCard;
