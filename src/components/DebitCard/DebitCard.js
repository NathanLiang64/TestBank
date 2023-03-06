import { useState } from 'react';
import { useDispatch } from 'react-redux';
import uuid from 'react-uuid';
import {
  MoreIcon, PaperClipIcon, VisibilityIcon, VisibilityOffIcon,
} from 'assets/images/icons';
import CopyTextIconButton from 'components/CopyTextIconButton';
import { FEIBIconButton } from 'components/elements';
import theme from 'themes/theme';
import {
  accountFormatter, accountTypeColorGenerator, currencySymbolGenerator, getCurrenyName,
} from 'utilities/Generator';
import DebitCardBackground from 'assets/images/debitCardBackground.png';
import { showDrawer, showPrompt } from 'utilities/MessageModal';
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
* 15. hideCopyIcon -> true時隱藏複製帳號按鈕，預設為false
* */

const DebitCard = ({
  transferMode,
  withdrawMode,
  color,
  accountObj,
  moreList,
  functionList,
  onFunctionClick,

  type,
  branch,
  cardName,
  account,
  balance,
  freeTransfer,
  freeTransferRemain,
  freeWithdraw,
  freeWithdrawRemain,
  dollarSign,
  hideIcon,
  hideCopyIcon = false,
}) => {
  const dispatch = useDispatch();
  const model = accountObj ?? {
    branchName: branch,
    alias: cardName,
    accountNo: account,
    balance,
    currency: dollarSign,
    freeTransfer,
    freeTransferRemain,
    freeWithdraw,
    freeWithdrawRemain,
  };
  const accountType = model.accountNo?.substring(3, 6) ?? '004';
  const isSmallCard = (type !== 'original');
  const [showBalance, setShowBalance] = useState(true);
  const showFloat = model.currency === 'NTD' || model.currency === 'TWD'; // 若是台幣且非整數情況下，顯示小數點

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
  // 若顯示的卡片是子帳號，且已綁定社群帳本或存錢計畫時，顯示icon及提醒文字
  const renderPaperClipButton = () => {
    const typeName = model.bindType === 1 ? '社群帳本' : '存錢計畫';

    const BindingMessage = () => (
      <div>
        <p>{`該帳號已綁定${typeName}:`}</p>
        <p>{model.showName}</p>
      </div>
    );
    const onIconClick = () => showPrompt(<BindingMessage />);

    return (
      <FEIBIconButton $fontSize={1.6} style={{padding: '0 .5rem'}} onClick={onIconClick}>
        <PaperClipIcon size={25} color={theme.colors.text.lightGray} />
      </FEIBIconButton>
    );
  };

  /**
   * 顯示功能清單。
   * @param {[*]} funcs 功能清單。
   * @param {boolean} isHorizontal 表示以水平方式排列。
   */
  const renderFunctions = (funcs, isHorizontal) => (
    <ul className={isHorizontal ? 'functionList' : null}>
      {funcs.map((func) => {
        if (!(func.hidden === true)) { // 必需指定為 true 才會隱藏。
          const enabled = (func.fid && (func.enabled === undefined || func.enabled)); // 預設為 可用。
          const onClick = enabled ? () => {
            dispatch(setDrawerVisible(false));
            onFunctionClick(func.fid);
          } : null; // () => showCustomPrompt({message: handleNonEnabledMessage(func.title, func.transable), onOk: () => {}});

          return (
            <li key={uuid()} onClick={onClick}>
              <p>
                {func.icon ? iconGenerator(func.icon) : null}
                {func.title}
              </p>
            </li>
          );
        } return null;
      })}
    </ul>
  );

  // 渲染卡片右上角的 "更多" 圖標
  const renderMoreIconButton = () => (
    <div className="moreIconButton">
      <FEIBIconButton $fontSize={1.6} onClick={() => showDrawer('', renderFunctions(moreList))}>
        <MoreIcon />
      </FEIBIconButton>
    </div>
  );

  const renderFreeTransferInfo = () => {
    let total;
    let remain;
    if (transferMode) {
      total = model.freeTransfer;
      remain = model.freeTransferRemain;
    } else if (withdrawMode) {
      total = model.freeWithdraw;
      remain = model.freeWithdrawRemain;
    } else return null;

    const title = transferMode ? '跨轉優惠' : '跨提優惠';
    return (
      <p className="freeTransferInfo">
        {`${title} : ${total ?? '-'} 次/剩餘 ${remain ?? '-'} 次`}
      </p>
    );
  };

  /**
   * 帳號列
   */
  const renderAccountNo = () => (
    <div className="accountInfo">
      {transferMode ? (
        <p className="account">{accountFormatter(model.accountNo, true)}</p>
      ) : (
        <>
          {/* 將分行代碼轉為分行名稱 */}
          <p>
            <span className={model.branchName ? 'branch' : 'noDisplay'}>{model.branchName}</span>
            <span className="account">{accountFormatter(model.accountNo, true)}</span>
          </p>
          {!hideCopyIcon && <CopyTextIconButton copyText={model.accountNo} />}
        </>
      )}
    </div>
  );

  return (
    <DebitCardWrapper
      className="debitCard"
      $cardColor={color ?? accountTypeColorGenerator(model.acctType ?? accountType)}
    >
      <img src={DebitCardBackground} alt="background" className="backgroundImage" />
      <div className="cardTitle">
        <h2 className="cardName">
          {model.alias ?? '(未命名)'}
          {model.currency && (['NTD', 'NTD'].indexOf(model.currency) < 0) ? ` (${getCurrenyName(model.currency)})` : ''}
          {/* bindType 0:未綁定 1:社群帳本 2:存錢計畫 */}
          {model.acctType === 'C' && !!model.bindType && renderPaperClipButton()}
        </h2>
        {renderAccountNo()}
      </div>
      <div className={`cardBalance ${!isSmallCard ? 'grow' : ''}`}>
        { !hideIcon && renderEyeIconButton() }
        <h3 className="balance">
          {`${currencySymbolGenerator(model.currency ?? 'NTD', (showBalance ? (model.balance ?? '---') : '*'), showFloat)}`}
        </h3>
      </div>
      { renderFreeTransferInfo() }
      { functionList && renderFunctions(functionList, true) }
      { moreList && renderMoreIconButton() }
    </DebitCardWrapper>
  );
};

export default DebitCard;
