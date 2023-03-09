import plus from 'assets/images/icons/addIconGrey.svg';
import AccountCardGreyWrapper from './AccountCardGrey.style';

const AccountCardGrey = ({ type = 'M' }) => {
  // 卡片標題、說明文字
  const handleCardContent = () => {
    switch (type) {
      case 'C':
        return {title: '存錢計畫', content: '踏出第一步，夢想就在不遠處'};
      case 'S':
        return {title: '證券交割戶', content: '免臨櫃24H快速線上開戶'};
      case 'F':
        return {title: '外幣帳戶', content: '開啟後即可線上換匯免出門'};
      case 'CC':
        return {title: '信用卡', content: '3期0利率，資金運用更靈活'};
      case 'L':
        return {title: '貸款', content: '社群變現、借錢省利'};
      default:
        return { title: '臺幣主帳戶', content: '開戶享活存最高2.6%' };
    }
  };

  return (
    <AccountCardGreyWrapper>
      <div className="justify-between">
        <div className="card_title">{handleCardContent().title}</div>
        <div>
          <img src={plus} alt="plus" />
        </div>
      </div>
      <div className="card_content">{handleCardContent().content}</div>
    </AccountCardGreyWrapper>
  );
};

export default AccountCardGrey;
