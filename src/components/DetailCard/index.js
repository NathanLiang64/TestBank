import { ArrowBack, ArrowForward } from '@material-ui/icons';
import InformationList from 'components/InformationList';
import { customPopup } from 'utilities/MessageModal';
import {
  currencySymbolGenerator, dateToString, toHalfWidth, timeToString,
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
* 5. cdType -> 交易類型，後端會傳回 "c" 或 "d" 兩種字串值，"c" 表轉出，"d" 表轉入
* 6. description -> 明細標題
* 7. txnDate -> 交易日期, 格式：yyyyMMdd
* 8. txnTime -> 交易時間, 格式：HHmmss
* 9. bizDate -> 帳務日期
* 10. currency -> 貨幣單位
* 11. targetBank -> 目標帳號銀行代碼
* 12. targetAcct -> 目標帳號
* 13. targetMbrId -> 目標帳號的會員 ID; 用來顯示頭像圖片，沒傳值會有預設樣式
*     targetNickName -> 目標帳號的䁥稱
* 14. amount -> 交易金額
* 15. balance -> 交易後所剩餘額
* 16. noShadow -> 卡片不帶陰影樣式
* */

const DetailCard = ({
  id,
  index,
  inView,
  noShadow,

  cdType,
  description,
  memo,
  txnDate,
  txnTime,
  bizDate,
  currency,
  targetBank,
  targetAcct,
  targetMbrId,
  targetNickName,
  amount,
  balance,
  invert,
}) => {
  /**
   * 取得大頭貼。
   * @returns 會員大頭貼；非會員則傳回 null。
   */
  const getAvator = () => {
    if (!targetMbrId) return null;

    // 先從 sessionStorage 取出第一次下載的影像。
    const cacheId = `s${targetMbrId}`;
    let cacheImg = sessionStorage.getItem(cacheId);
    if (cacheImg === null) {
      // 第一次下載影像，會存入 sessionStorage 以減少 Server端的傳輸流量。
      const url = `${process.env.REACT_APP_AVATAR_URL}/${targetMbrId}_s.jpg`;
      cacheImg = url; // DEBUG

      // TODO 從 url 取得影像內容(應為 Base64 格式字串)。

      sessionStorage.setItem(cacheId, cacheImg);
    }
    return cacheImg;
  };

  const renderAvatar = () => (
    targetMbrId
      ? <img src={getAvator()} alt="avatar" />
      : (
        <div className="defaultAvatar">
          <DetailsDefaultAvatarIcon />
        </div>
      )
  );

  const renderTypeIcon = () => (
    <div className={`type ${cdType === 'c' ? 'spend' : 'income'}`}>
      { cdType === 'c' ? <ArrowBack /> : <ArrowForward /> }
    </div>
  );

  /**
   * 交易明細說明。
   * @returns 包含交易日期、交易對象䁥稱或帳號的字串。
   */
  const txnDescription = () => {
    const date = dateToString(txnDate, '/', true);
    if (targetNickName) return `${date} | ${targetNickName}`;
    if (targetAcct) return `${date} - ${targetAcct}`; // NOTE 交易對象帳號很難格式化！
    return date;
  };

  const renderDetailDialog = () => {
    const title = (cdType === 'c' ? '轉出' : '轉入'); // TODO 不是只有轉入、轉出
    const body = (
      <DetailDialogContentWrapper>
        <div className="mainBlock">
          <p className="mainBlockTitle">{`${toHalfWidth(description)} ${memo ?? ''}`}</p>
          <p className="mainBlockAmount">
            {`${cdType === 'c' ? '- ' : ''}${currencySymbolGenerator(currency, amount)}`}
          </p>
          {invert && (<p className="mainBlockTitle">[更正交易]</p>)}
        </div>
        <InformationList title="交易時間" content={`${dateToString(txnDate, '/')} ${timeToString(txnTime)}`} />
        <InformationList title="帳務日期" content={dateToString(bizDate, '/')} />
        {targetAcct && (
          <InformationList
            title="帳號"
            content={(targetBank ? `(${targetBank}) ` : '') + targetAcct}
          />
        )}
      </DetailDialogContentWrapper>
    );

    // TODO 若有轉入帳號，就可以立即加入常用帳號。

    customPopup(title, body);
  };

  return (
    <>
      <DetailCardWrapper
        data-index={index}
        data-inview={inView}
        $noShadow={noShadow}
        id={id}
        onClick={renderDetailDialog}
      >
        <div className="avatar">
          { renderAvatar() }
          { renderTypeIcon() }
        </div>
        <div className="description">
          <h4>{`${toHalfWidth(description)} ${memo ?? ''}`}</h4>
          <p>{txnDescription()}</p>
        </div>
        <div className="amount">
          <h4>
            {invert && '[更正交易] '}
            {cdType === 'c' && '- '}
            {currencySymbolGenerator(currency, amount)}
          </h4>
          <p>{currencySymbolGenerator(currency, balance)}</p>
        </div>
      </DetailCardWrapper>
    </>
  );
};

export default DetailCard;
