// import Avatar from 'assets/images/logo.jpg';
import { toCurrency } from 'utilities/Generator';
import DetailCardWrapper from './detailCard.style';

/*
* ==================== DetailCard 組件說明 ====================
* 交易明細卡片組件
* ==================== DetailCard 可傳參數 ====================
* 1. avatar -> 頭像
* 2. type -> 交易類型，接受 "spend" 或 "income" 兩個字串值
*    "spend" 表支出，"income" 表收入，預設不傳為 "spend" 類型
* 3. title -> 明細標題
* 4. date -> 交易日期
* 5. sender -> 交易對象
* 6. amount -> 交易金額
* 7. balance -> 交易後所剩餘額
* */

const DetailCard = ({
  avatar,
  type,
  title,
  date,
  sender,
  amount,
  balance,
}) => (
  <DetailCardWrapper>
    <div className="avatar">
      <img src={avatar} alt="avatar" />
      <div className={`type ${type || 'spend'}`} />
    </div>
    <div className="description">
      <h4>{title}</h4>
      <p>{`${date} | ${sender}`}</p>
    </div>
    <div className="amount">
      <h4>{`$${toCurrency(amount)}`}</h4>
      <p>{`$${toCurrency(balance)}`}</p>
    </div>
  </DetailCardWrapper>
);

export default DetailCard;
