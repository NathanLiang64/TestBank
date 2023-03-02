import plus from 'assets/images/icons/addIconGrey.svg';
import AccountCardGreyWrapper from './AccountCardGrey.style';

const AccountCardGrey = () => (
  <AccountCardGreyWrapper>
    <div className="flex-center">
      <div className="plusWrapper">
        <img src={plus} alt="plus" />
      </div>
    </div>
  </AccountCardGreyWrapper>
);

export default AccountCardGrey;
