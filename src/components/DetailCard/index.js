import { useState } from 'react';
import { MonetizationOn, ArrowBack, ArrowForward } from '@material-ui/icons';
import Dialog from 'components/Dialog';
import InformationList from 'components/InformationList';
import { toCurrency, stringDateFormatter, timeFormatter } from 'utilities/Generator';
import DetailCardWrapper, { DetailDialogContentWrapper } from './detailCard.style';

/*
* ==================== DetailCard 組件說明 ====================
* 交易明細卡片組件
* ==================== DetailCard 可傳參數 ====================
* 1. id -> Html DOM 元素 id
* 2. index -> HTML data-index 參數，放置後端撈回的卡片索引值
* 3. inView -> HTML data-inview 參數，顯示卡片是否在畫面可視範圍
* 4. avatar -> 頭像圖片，沒傳值會有預設樣式
* 5. type -> 交易類型，後端會傳回 "c" 或 "d" 兩種字串值，"c" 表轉出，"d" 表轉入
* 6. title -> 明細標題
* 7. date -> 交易日期
* 8. time -> 交易時間
* 9. bizDate -> 帳務日期
* 10. dollarSign -> 貨幣單位
* 11. targetBank -> 目標帳號銀行代碼
* 12. targetAccount -> 目標帳號
* 13. targetMember -> 目標帳號的會員 ID
* 14. amount -> 交易金額
* 15. balance -> 交易後所剩餘額
* 16. noShadow -> 卡片不帶陰影樣式
* */

const DetailCard = ({
  id,
  index,
  inView,
  avatar,
  type,
  title,
  date,
  time,
  bizDate,
  dollarSign,
  targetBank,
  targetAccount,
  targetMember,
  amount,
  balance,
  noShadow,
}) => {
  const [openDetailDialog, setOpenDetailDialog] = useState(false);

  // Formatter
  amount = toCurrency(amount);
  date = stringDateFormatter(date);
  bizDate = stringDateFormatter(bizDate);
  time = timeFormatter(new Date(time));

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
    <div className={`type ${type === 'c' ? 'spend' : 'income'}`}>
      { type === 'd' ? <ArrowBack /> : <ArrowForward /> }
    </div>
  );

  const renderDetailDialog = () => (
    <Dialog
      title={type === 'c' ? '轉出' : '轉入'}
      isOpen={openDetailDialog}
      onClose={() => setOpenDetailDialog(false)}
      content={(
        <DetailDialogContentWrapper>
          <div className="mainBlock">
            <p className="mainBlockTitle">{title}</p>
            <p className="mainBlockAmount">
              {`${type === 'c' ? '- ' : ''}${dollarSign !== 'TWD' ? dollarSign : ''}$${amount}`}
            </p>
          </div>
          <InformationList title="交易時間" content={`${date} ${time}`} />
          <InformationList title="帳務日期" content={bizDate} />
          <InformationList
            title="帳號"
            content={targetBank && targetAccount ? `(${targetBank}) ${targetAccount}` : ''}
          />
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
          <p>
            {date}
            {targetMember ? `| ${targetMember || targetAccount}` : ''}
          </p>
        </div>
        <div className="amount">
          <h4>
            { type === 'c' && '- ' }
            {`${dollarSign !== 'TWD' ? dollarSign : ''}$${amount}`}
          </h4>
          <p>{`${dollarSign !== 'TWD' ? dollarSign : ''}$${toCurrency(balance)}`}</p>
        </div>
      </DetailCardWrapper>
      { renderDetailDialog() }
    </>
  );
};

export default DetailCard;
