import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  EditAccountIcon, MoreIcon, VisibilityIcon, VisibilityOffIcon,
} from 'assets/images/icons';
import BottomDrawer from 'components/BottomDrawer';
import Dialog from 'components/Dialog';
import CopyTextIconButton from 'components/CopyTextIconButton';
import {
  FEIBIconButton, FEIBInputLabel, FEIBInput, FEIBErrorMessage, FEIBButton,
} from 'components/elements';
import theme from 'themes/theme';
import {
  accountFormatter, accountTypeColorGenerator, currencySymbolGenerator, toCurrency,
} from 'utilities/Generator';
import DebitCardBackground from 'assets/images/debitCardBackground.png';
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
* 9. transferLimit -> 轉帳優惠總次數
* 10. transferRemaining -> 轉帳優惠剩餘次數
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
  accountType,
  balance,
  hideIcon,
  functionList,
  transferTitle = '跨轉優惠',
  transferLimit,
  transferRemaining,
  moreList,
  moreDefault = true,
  dollarSign,
  color,
  onFunctionChange,
}) => {
  const [showBalance, setShowBalance] = useState(true);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const { register, handleSubmit } = useForm();

  const handleClickShowBalance = () => {
    setShowBalance(!showBalance);
  };

  const handleClickEditCardName = () => {
    setOpenDrawer(false);
    setOpenDialog(true);
  };

  // eslint-disable-next-line no-unused-vars
  const handleClickSubmitCardName = (data) => {
    setOpenDialog(false);
    // send data
  };

  // 判斷卡片類型是否為 original
  const originalType = () => type === 'original';

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
      <FEIBIconButton $fontSize={1.6} onClick={() => setOpenDrawer(true)}>
        <MoreIcon />
      </FEIBIconButton>
    </div>
  );

  const onFuncClick = (fid) => {
    // TODO: 若 funcID 是以'/'為開頭，表示是指定固定網址，因此不會導頁
    onFunctionChange(fid);
  };

  // render 功能列表
  const renderFunctionList = (list) => (
    <ul className="functionList">
      { list.map((func) => (
        func.fid
          ? (
            <li key={func.fid} onClick={() => onFuncClick(func.fid)}>
              <p>
                {func.title}
              </p>
            </li>
          ) : (
            <li>
              <div style={{ color: 'gray' }}>
                {func.title}
              </div>
            </li>
          )
      )) }
    </ul>
  );

  const renderTransferLimit = (total, current) => (
    <p className="transferLimit">
      {transferTitle}
      :
      {total}
      次/剩餘
      {current}
      次
    </p>
  );

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
      {/* 下方為功能列表內的固定功能 */}
      {
        moreDefault && (
          <li onClick={handleClickEditCardName}>
            <p>
              <EditAccountIcon />
              帳戶名稱編輯
            </p>
          </li>
        )
      }
    </ul>
  );

  const renderBottomDrawer = (list) => (
    <BottomDrawer
      className="debitCardDrawer"
      isOpen={openDrawer}
      onClose={() => setOpenDrawer(!openDrawer)}
      content={renderMoreList(list)}
    />
  );

  const renderEditCardNameDialog = (name) => (
    <Dialog
      title="帳戶名稱編輯"
      isOpen={openDialog}
      onClose={() => setOpenDialog(false)}
      content={(
        <>
          <FEIBInputLabel>新的帳戶名稱</FEIBInputLabel>
          <FEIBInput defaultValue={name} autoFocus {...register('cardName')} />
          <FEIBErrorMessage $noSpacing />
        </>
      )}
      action={(
        <FEIBButton onClick={handleSubmit(handleClickSubmitCardName)}>確認</FEIBButton>
      )}
    />
  );

  return (
    <DebitCardWrapper className="debitCard" $cardColor={accountTypeColorGenerator(accountType) || color}>
      <img src={DebitCardBackground} alt="background" className="backgroundImage" />
      <div className="cardTitle">
        <h2 className="cardName">{cardName}</h2>
        <div className="accountInfo">
          { originalType() && <p className="branch">{branch}</p> }
          <p className="account">{accountFormatter(account)}</p>
          <CopyTextIconButton copyText={account} />
        </div>
      </div>
      <div className={`cardBalance ${originalType() && 'grow'}`}>
        { !hideIcon && renderEyeIconButton() }
        <h3 className="balance">
          {`${currencySymbolGenerator(dollarSign)}${showBalance ? toCurrency(balance) : '＊＊＊＊＊'}`}
        </h3>
      </div>
      { (originalType() && (functionList && renderFunctionList(functionList))) || (transferLimit && transferRemaining && renderTransferLimit(transferLimit, transferRemaining)) }
      { originalType() && moreList && renderMoreIconButton() }
      { originalType() && moreList && renderBottomDrawer(moreList) }
      { originalType() && renderEditCardNameDialog(cardName) }
    </DebitCardWrapper>
  );
};

export default DebitCard;
