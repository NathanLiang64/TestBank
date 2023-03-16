/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { toCurrency } from 'utilities/Generator';
import { handleTxUsageText } from '../utils/usgeType';
import PageWrapper from './InvitationCard.style';
import JoinCard from '../Assets/joinCard.png';
import { cardImage } from '../utils/images';

/**
 * 要錢卡/邀請卡 卡面
 */
const InvitationCard = (cardData) => {
  const [model, setModel] = useState();

  const renderInfoRow = (title, content) => (
    <div className="info_row">
      <p>{title}</p>
      <p>{content}</p>
    </div>
  );

  useEffect(() => {
    const {data} = cardData;
    setModel({
      ...data.model,
      isInviteCard: data.isInviteCard,
    });
  }, []);
  return (
    model ? (
      <PageWrapper>
        <div>
          {console.log('InvitationCard', {model})}
          <div className="ledger_name_container">{model.ledgerName}</div>
          <div className="image_container">
            {!model.isInviteCard && cardImage(model.imageId)}
            {model.isInviteCard && <img src={JoinCard} alt="邀請卡" />}
          </div>

          {/* 要錢卡 */}
          {!model.isInviteCard && (
            <div>
              <div className="hint_container">{`${model.sendMemberName} 想跟 ${model.receiveMemberName} 收款`}</div>
              <div className="info_container">
                {renderInfoRow('金額', `NTD${toCurrency(model.amount)}`)}
                {renderInfoRow('帳本', model.ledgerName)}
                {renderInfoRow('性質', handleTxUsageText(model.type))}
                {renderInfoRow('說明', model.memo)}
              </div>
            </div>
          )}

          {/* 邀請卡 */}
          {model.isInviteCard && (
            <div>
              <div className="hint_container">{`${model.sendMemberName} 邀請你加入帳本`}</div>
            </div>
          )}
        </div>
      </PageWrapper>
    ) : <></>
  );
};

export default InvitationCard;
