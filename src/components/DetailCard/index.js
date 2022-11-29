import { useState } from 'react';
import { ArrowBack, ArrowForward } from '@material-ui/icons';
import Dialog from 'components/Dialog';
import InformationList from 'components/InformationList';
import {
  timeFormatter, currencySymbolGenerator, dateToString,
} from 'utilities/Generator';
import { DetailsDefaultAvatarIcon } from 'assets/images/icons';
import DetailCardWrapper, { DetailDialogContentWrapper } from './detailCard.style';

/*
* ==================== DetailCard 組件說明 ====================
* 交易明細卡片組件
* ==================== DetailCard 可傳參數 ====================
* 1. id -> Html DOM 元素 id
* 2. index -> HTML data-index 參數，放置後端撈回的卡片索引值
* 3. inView -> HTML data-inview 參數，顯示卡片是否在畫面可視範圍
* 5. type -> 交易類型，後端會傳回 "c" 或 "d" 兩種字串值，"c" 表轉出，"d" 表轉入
* 6. title -> 明細標題
* 7. txnDate -> 交易日期, 格式：yyyyMMdd
* 8. time -> 交易時間, 格式：HHmmss
* 9. bizDate -> 帳務日期
* 10. dollarSign -> 貨幣單位
* 11. targetBank -> 目標帳號銀行代碼
* 12. targetAccount -> 目標帳號
* 13. targetMemberId -> 目標帳號的會員 ID; 用來顯示頭像圖片，沒傳值會有預設樣式
*     targetMemberName -> 目標帳號的䁥稱
* 14. amount -> 交易金額
* 15. balance -> 交易後所剩餘額
* 16. noShadow -> 卡片不帶陰影樣式
* */

const DetailCard = ({
  id,
  index,
  inView,
  type,
  title,
  txnDate,
  time,
  bizDate,
  dollarSign,
  targetBank,
  targetAccount,
  targetMemberId,
  targetMemberName,
  amount,
  balance,
  noShadow,
}) => {
  const [openDetailDialog, setOpenDetailDialog] = useState(false);

  // Formatter
  time = timeFormatter(new Date(time));

  /**
   * 取得大頭貼。
   * @returns 會員大頭貼；非會員則傳回 null。
   */
  const getAvator = () => {
    if (!targetMemberId) return null;

    // 先從 sessionStorage 取出第一次下載的影像。
    const cacheId = `s${targetMemberId}`;
    let cacheImg = sessionStorage.getItem(cacheId);
    if (cacheImg === null) {
      // 第一次下載影像，會存入 sessionStorage 以減少 Server端的傳輸流量。
      const url = `${process.env.REACT_APP_AVATAR_URL}/${targetMemberId}_s.jpg`;
      cacheImg = url; // DEBUG

      // TODO 從 url 取得影像內容(應為 Base64 格式字串)。

      sessionStorage.setItem(cacheId, cacheImg);
    }
    return cacheImg;
  };

  const renderAvatar = () => (
    targetMemberId
      ? <img src={getAvator()} alt="avatar" />
      : (
        <div className="defaultAvatar">
          <DetailsDefaultAvatarIcon />
        </div>
      )
  );

  const renderTypeIcon = () => (
    <div className={`type ${type === 'c' ? 'spend' : 'income'}`}>
      { type === 'c' ? <ArrowBack /> : <ArrowForward /> }
    </div>
  );

  /**
   * 交易明細說明。
   * @returns 包含交易日期、交易對象䁥稱或帳號的字串。
   */
  const txnDescription = () => {
    const date = dateToString(txnDate, '/', true);
    if (targetMemberName) return `${date} | ${targetMemberName}`;
    if (targetAccount) return `${date} - ${targetAccount}`; // NOTE 交易對象帳號很難格式化！
    return date;
  };

  const renderDetailDialog = () => (
    <Dialog
      title={type === 'c' ? '轉出' : '轉入'} // TODO 不是只有轉入、轉出
      isOpen={openDetailDialog}
      onClose={() => setOpenDetailDialog(false)}
      content={(
        <DetailDialogContentWrapper>
          <div className="mainBlock">
            <p className="mainBlockTitle">{title}</p>
            <p className="mainBlockAmount">
              {`${type === 'c' ? '- ' : ''}${currencySymbolGenerator(dollarSign, amount)}`}
            </p>
          </div>
          <InformationList title="交易時間" content={`${dateToString(txnDate, '/')} ${time}`} />
          <InformationList title="帳務日期" content={dateToString(bizDate, '/')} />
          {targetAccount && (
            <InformationList
              title="帳號"
              content={(targetBank ? `(${targetBank}) ` : '') + targetAccount}
            />
          )}
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
          <p>{txnDescription()}</p>
        </div>
        <div className="amount">
          <h4>
            { type === 'c' && '- ' }
            {currencySymbolGenerator(dollarSign, amount)}
          </h4>
          <p>{currencySymbolGenerator(dollarSign, balance)}</p>
        </div>
      </DetailCardWrapper>
      { renderDetailDialog() }
    </>
  );
};

export default DetailCard;
