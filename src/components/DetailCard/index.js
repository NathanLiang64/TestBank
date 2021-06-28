import { MonetizationOn, ArrowBack, ArrowForward } from '@material-ui/icons';
import { toCurrency } from 'utilities/Generator';
import DetailCardWrapper from './detailCard.style';

/*
* ==================== DetailCard 組件說明 ====================
* 交易明細卡片組件
* ==================== DetailCard 可傳參數 ====================
* 1. id -> Html DOM 元素 id
* 2. avatar -> 頭像圖片，沒傳值會有預設樣式
* 3. type -> 交易類型，接受 "spend" 或 "income" 兩個字串值
*    "spend" 表支出，"income" 表收入
* 4. title -> 明細標題
* 5. date -> 交易日期
* 6. sender -> 交易對象
* 7. amount -> 交易金額
* 8. balance -> 交易後所剩餘額
* 9. noShadow -> 卡片不帶陰影樣式
* 10. onClick -> 點擊事件
* */

const DetailCard = ({
  id,
  index,
  avatar,
  type,
  title,
  date,
  sender,
  amount,
  balance,
  noShadow,
  onClick,
}) => {
  const renderAvatar = () => (
    avatar
      ? <img src={avatar} alt="avatar" />
      : (
        <div className="defaultAvatar">
          <MonetizationOn />
        </div>
      )
  );

  const renderTypeIcon = () => (
    <div className={`type ${type}`}>
      { type === 'spend' ? <ArrowBack /> : <ArrowForward /> }
    </div>
  );

  return (
    <DetailCardWrapper data-index={index} $noShadow={noShadow} id={id} onClick={onClick}>
      <div className="avatar">
        { renderAvatar() }
        { renderTypeIcon() }
      </div>
      <div className="description">
        <h4>{title}</h4>
        <p>{`${date} | ${sender}`}</p>
      </div>
      <div className="amount">
        <h4>
          { type === 'spend' && '- ' }
          {`$${toCurrency(amount)}`}
        </h4>
        <p>{`$${toCurrency(balance)}`}</p>
      </div>
    </DetailCardWrapper>
  );
};

export default DetailCard;
