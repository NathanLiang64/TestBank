import { useState } from 'react';
import { MonetizationOn, ArrowBack, ArrowForward } from '@material-ui/icons';
import Dialog from 'components/Dialog';
import InformationList from 'components/InformationList';
import { toCurrency } from 'utilities/Generator';
import DetailCardWrapper, { DetailDialogContentWrapper } from './detailCard.style';

/*
* ==================== DetailCard 組件說明 ====================
* 交易明細卡片組件
* ==================== DetailCard 可傳參數 ====================
* 1. id -> Html DOM 元素 id
* 2. index -> HTML data-index 參數，放置後端撈回的卡片索引值
* 3. inView -> HTML data-inview 參數，顯示卡片是否在畫面可視範圍
* 4. avatar -> 頭像圖片，沒傳值會有預設樣式
* 5. type -> 交易類型，接受 "spend" 或 "income" 兩個字串值
*    "spend" 表支出，"income" 表收入
* 6. title -> 明細標題
* 7. date -> 交易日期
* 8. sender -> 交易對象
* 9. amount -> 交易金額
* 10. balance -> 交易後所剩餘額
* 11. noShadow -> 卡片不帶陰影樣式
* 12. onClick -> 點擊事件
* */

const DetailCard = ({
  id,
  index,
  inView,
  avatar,
  type,
  title,
  date,
  sender,
  amount,
  balance,
  noShadow,
}) => {
  const [openDetailDialog, setOpenDetailDialog] = useState(false);

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

  const renderDetailDialog = () => (
    <Dialog
      title={type === 'spend' ? '跨行轉出' : '跨行轉入'}
      isOpen={openDetailDialog}
      onClose={() => setOpenDetailDialog(false)}
      content={(
        // TODO: 確認明細欄位是否齊全
        <DetailDialogContentWrapper>
          <div className="mainBlock">
            <p className="mainBlockTitle">{title}</p>
            <p className="mainBlockAmount">{`${type === 'spend' ? '- ' : ''}$${toCurrency(amount)}`}</p>
          </div>
          <InformationList title="交易時間" content={`2021/${date} 14:50`} />
          <InformationList title="帳務日期" content={date} />
          <InformationList title="帳號" content="04300299001234" />
        </DetailDialogContentWrapper>
      )}
    />
  );

  return (
    <>
      <DetailCardWrapper
        data-index={index}
        data-inview={inView}
        $noShadow={noShadow}
        id={id}
        onClick={() => setOpenDetailDialog(true)}
      >
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
      { renderDetailDialog() }
    </>
  );
};

export default DetailCard;
