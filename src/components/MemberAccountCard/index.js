import { AccountCircleRounded } from '@material-ui/icons';
import Avatar from 'components/Avatar';
import { FEIBIconButton } from 'components/elements';
import theme from 'themes/theme';
import MemberAccountCardWrapper from './memberAccountCard.style';

/*
* ==================== MemberAccountCard 組件說明 ====================
* MemberAccountCard 組件包含了 Avatar 組合成一張會員帳號卡片
* ==================== MemberAccountCard 可傳參數 ====================
* 1. name -> 會員名稱
* 2. avatarSrc -> 會員頭像的圖片路徑
* 3. branchCode -> 銀行代碼
* 4. branchName -> 銀行名稱
* 5. account -> 會員帳號
* 6. onClick -> 點擊事件
* */

const MemberAccountCard = ({
  name,
  avatarSrc,
  branchCode,
  branchName,
  account,
  onClick,
}) => (
  <MemberAccountCardWrapper>
    <Avatar small src={avatarSrc} name={name} />
    <div className="memberInfo">
      <h3>{name || '會員'}</h3>
      <p>{`${branchName}(${branchCode}) ${account}`}</p>
    </div>
    <div className="changeMemberButton" onClick={onClick}>
      <FEIBIconButton $iconColor={theme.colors.primary.light} $fontSize={2.4}>
        <AccountCircleRounded />
      </FEIBIconButton>
    </div>
  </MemberAccountCardWrapper>
);

export default MemberAccountCard;
