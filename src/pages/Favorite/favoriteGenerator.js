import BlockPink from 'assets/images/favoriteBlock/blockPink.svg';
import BlockYellow from 'assets/images/favoriteBlock/blockYellow.svg';
import BlockBlue from 'assets/images/favoriteBlock/blockBlue.svg';
import BlockOrange from 'assets/images/favoriteBlock/blockOrange.svg';
import BlockGreen from 'assets/images/favoriteBlock/blockGreen.svg';
import BlockPurple from 'assets/images/favoriteBlock/blockPurple.svg';
import {
  ShareIcon, GiftIcon,
  AccountIcon1, AccountIcon2, AccountIcon3, AccountIcon4, AccountIcon5, AccountIcon6, AccountIcon7, AccountIcon8, AccountIcon9,
  ApplyIcon1, ApplyIcon2, ApplyIcon3, ApplyIcon4, ApplyIcon5,
  TransactionIcon1, TransactionIcon2, TransactionIcon3, TransactionIcon4, TransactionIcon5, TransactionIcon6, TransactionIcon7, TransactionIcon8,
  InvestIcon1, InvestIcon2, InvestIcon3,
  CreditCardIcon1, CreditCardIcon2, CreditCardIcon3, CreditCardIcon4, CreditCardIcon5,
  LoanIcon1, LoanIcon2,
  HelperIcon1, HelperIcon2, HelperIcon3, HelperIcon4, HelperIcon5, HelperIcon6, HelperIcon7, HelperIcon8, HelperIcon9, HelperIcon10, HelperIcon11,
  SocialIcon1, SocialIcon2, SocialIcon3,
} from 'assets/images/icons';

export const blockBackgroundGenerator = (index) => {
  switch (index) {
    case 1:
      return BlockPink;
    case 2:
      return BlockYellow;
    case 3:
      return BlockBlue;
    case 4:
      return BlockOrange;
    case 5:
      return BlockGreen;
    case 6:
      return BlockPurple;
    default:
      return null;
  }
};

export const iconGenerator = (name) => {
  switch (name) {
    case 'share':
      return <ShareIcon />;
    case 'gift':
      return <GiftIcon />;
    case 'account1':
      return <AccountIcon1 />;
    case 'account2':
      return <AccountIcon2 />;
    case 'account3':
      return <AccountIcon3 />;
    case 'account4':
      return <AccountIcon4 />;
    case 'account5':
      return <AccountIcon5 />;
    case 'account6':
      return <AccountIcon6 />;
    case 'account7':
      return <AccountIcon7 />;
    case 'account8':
      return <AccountIcon8 />;
    case 'account9':
      return <AccountIcon9 />;
    case 'apply1':
      return <ApplyIcon1 />;
    case 'apply2':
      return <ApplyIcon2 />;
    case 'apply3':
      return <ApplyIcon3 />;
    case 'apply4':
      return <ApplyIcon4 />;
    case 'apply5':
      return <ApplyIcon5 />;
    case 'transaction1':
      return <TransactionIcon1 />;
    case 'transaction2':
      return <TransactionIcon2 />;
    case 'transaction3':
      return <TransactionIcon3 />;
    case 'transaction4':
      return <TransactionIcon4 />;
    case 'transaction5':
      return <TransactionIcon5 />;
    case 'transaction6':
      return <TransactionIcon6 />;
    case 'transaction7':
      return <TransactionIcon7 />;
    case 'transaction8':
      return <TransactionIcon8 />;
    case 'invest1':
      return <InvestIcon1 />;
    case 'invest2':
      return <InvestIcon2 />;
    case 'invest3':
      return <InvestIcon3 />;
    case 'creditCard1':
      return <CreditCardIcon1 />;
    case 'creditCard2':
      return <CreditCardIcon2 />;
    case 'creditCard3':
      return <CreditCardIcon3 />;
    case 'creditCard4':
      return <CreditCardIcon4 />;
    case 'creditCard5':
      return <CreditCardIcon5 />;
    case 'loan1':
      return <LoanIcon1 />;
    case 'loan2':
      return <LoanIcon2 />;
    case 'helper1':
      return <HelperIcon1 />;
    case 'helper2':
      return <HelperIcon2 />;
    case 'helper3':
      return <HelperIcon3 />;
    case 'helper4':
      return <HelperIcon4 />;
    case 'helper5':
      return <HelperIcon5 />;
    case 'helper6':
      return <HelperIcon6 />;
    case 'helper7':
      return <HelperIcon7 />;
    case 'helper8':
      return <HelperIcon8 />;
    case 'helper9':
      return <HelperIcon9 />;
    case 'helper10':
      return <HelperIcon10 />;
    case 'helper11':
      return <HelperIcon11 />;
    case 'social1':
      return <SocialIcon1 />;
    case 'social2':
      return <SocialIcon2 />;
    case 'social3':
      return <SocialIcon3 />;
    default:
      return null;
  }
};
