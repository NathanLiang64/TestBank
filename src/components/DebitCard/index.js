/* eslint-disable no-use-before-define */
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  MoreIcon, VisibilityIcon, VisibilityOffIcon,
} from 'assets/images/icons';
import CopyTextIconButton from 'components/CopyTextIconButton';
import { FEIBIconButton } from 'components/elements';
import theme from 'themes/theme';
import {
  accountFormatter, accountTypeColorGenerator, currencySymbolGenerator,
} from 'utilities/Generator';
import DebitCardBackground from 'assets/images/debitCardBackground.png';
import { showDrawer } from 'utilities/MessageModal';
import { setDrawerVisible } from 'stores/reducers/ModalReducer';
import { iconGenerator } from './debitCardIconGenerator';
import DebitCardWrapper from './debitCard.style';

/*
* ==================== DebitCard 組件說明 ====================
* 存款卡組件
* ==================== DebitCard 可傳參數 ====================
* 1. type -> 卡片類型，決定卡片顯示簡易內容或完整內容
*    預設不傳為顯示簡易內容，傳入 "original" 字串會顯示完整內容
* 2. branch -> 分行名稱，組件 type 為 original 的卡片 (完整內容) 才需要傳入
* 3. cardName -> 卡片名稱
* 4. account -> 卡片帳號
* 5. accountType -> 帳戶科目別 (ex: "004")
* 6. balance -> 卡片餘額，輸入純數字即可，顯示時會自動加上貨幣符號及千分位逗點
* 7. hideIcon -> 此組件預設會在餘額前顯示眼睛圖示的 Icon Button
*    點擊 Icon 後可隱藏餘額，倘若不需要此功能請在組件加上 hideIcon 屬性
* 8. functionList -> 卡片功能清單，型別為陣列，組件 type 為 original 的卡片 (完整內容) 才需要傳入
* 9. freeTransfer -> 轉帳優惠總次數
* 10. freeTransferRemain -> 轉帳優惠剩餘次數
* 11.moreList -> 點擊更多圖標後彈出的更多功能清單，型別為陣列，組件 type 為 original 的卡片 (完整內容) 才需要傳入
* 12.moreDefault -> 是否顯示更多功能清單，預設為顯示
* 13.dollarSign -> 貨幣符號，預設為 '$'
* 14.color -> 卡片顏色，預設紫色
* */

const DebitCard = ({
  type,
  branch,
  cardName,
  account,
  // accountType,
  balance,
  // transferTitle = '跨轉優惠',
  freeTransfer,
  freeTransferRemain,
  freeWithdraw,
  freeWithdrawRemain,
  dollarSign,
  color,
  hideIcon,
  moreList,
  functionList,
  onFunctionClick,
}) => {
  const dispatch = useDispatch();
  const model = {
    branch,
    cardName: cardName ?? '(未命名)',
    account,
    accountType: account.substring(3, 6) ?? '004',
    balance: balance ?? '--',
    dollarSign,
    freeTransfer,
    freeTransferRemain,
    freeWithdraw,
    freeWithdrawRemain,
  };
  const isSmallCard = (type !== 'original');
  const [showBalance, setShowBalance] = useState(true);

  const handleClickShowBalance = () => {
    setShowBalance(!showBalance);
  };

  // 渲染卡片餘額左側的 "眼睛" 圖標 (顯示/隱藏)
  const renderEyeIconButton = () => (
    <FEIBIconButton $fontSize={1.6} onClick={handleClickShowBalance}>
      { showBalance
        ? <VisibilityIcon size={16} color={theme.colors.text.lightGray} />
        : <VisibilityOffIcon size={16} color={theme.colors.text.lightGray} /> }
    </FEIBIconButton>
  );

  // 渲染卡片右上角的 "更多" 圖標
  const renderMoreIconButton = () => (
    <div className="moreIconButton">
      <FEIBIconButton $fontSize={1.6} onClick={() => showDrawer('', renderMoreList(moreList))}>
        <MoreIcon />
      </FEIBIconButton>
    </div>
  );

  const onFuncClick = (fid) => {
    dispatch(setDrawerVisible(false));
    onFunctionClick(fid);
  };

  // render 功能列表
  const renderFunctionList = (list) => (
    <ul className="functionList">
      { list.map((func) => (
        func.fid
          ? (
            <li key={func.fid} onClick={() => onFuncClick(func.fid)}>
              <p>{func.title}</p>
            </li>
          ) : (
            <li>
              <div style={{ color: 'gray' }}>{func.title}</div>
            </li>
          )
      )) }
    </ul>
  );

  const renderFreeTransferInfo = () => {
    const isWithdraw = (model.freeWithdraw || model.freeWithdrawRemain);
    const isTransfer = (model.freeTransfer || model.freeTransferRemain);
    let total = '-';
    let remain = '-';
    if (isWithdraw) {
      total = model.freeWithdraw;
      remain = model.freeWithdrawRemain;
    } else if (isTransfer) {
      total = model.freeTransfer;
      remain = model.freeTransferRemain;
    } else return null;

    const title = isWithdraw ? '跨提優惠' : '跨轉優惠';
    return (
      <p className="freeTransferInfo">
        {`${title} : ${total} 次/剩餘 ${remain} 次`}
      </p>
    );
  };

  // render 點擊更多圖標後的功能列表
  const renderMoreList = (list) => (
    <ul className="moreList">
      {list.map((func) => (
        <li key={func.title} onClick={() => onFuncClick(func.fid)}>
          <p>
            {iconGenerator(func.icon)}
            {func.title}
          </p>
        </li>
      ))}
    </ul>
  );

  return (
    <DebitCardWrapper className="debitCard" $cardColor={color ?? accountTypeColorGenerator(model.accountType)}>
      <img src={DebitCardBackground} alt="background" className="backgroundImage" />
      <div className="cardTitle">
        <h2 className="cardName">{model.cardName}</h2>
        <div className="accountInfo">
          {/* 將分行代碼轉為分行名稱 */}
          { !isSmallCard && <p className="branch">{branch}</p> }
          <p className="account">{accountFormatter(model.account)}</p>
          <CopyTextIconButton copyText={model.account} />
          <p className="account">{dollarSign !== 'NTD' ? `(${dollarSign})` : ''}</p>
        </div>
      </div>
      <div className={`cardBalance ${!isSmallCard ? 'grow' : ''}`}>
        { !hideIcon && renderEyeIconButton() }
        <h3 className="balance">
          {`${currencySymbolGenerator(dollarSign, (showBalance ? model.balance : '*'))}`}
        </h3>
      </div>
      { renderFreeTransferInfo() }
      { functionList && renderFunctionList(functionList) }
      { moreList && renderMoreIconButton() }
    </DebitCardWrapper>
  );
};

export default DebitCard;
