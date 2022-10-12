import BlockPink from 'assets/images/favoriteBlock/blockPink.svg';
import BlockYellow from 'assets/images/favoriteBlock/blockYellow.svg';
import BlockBlue from 'assets/images/favoriteBlock/blockBlue.svg';
import BlockOrange from 'assets/images/favoriteBlock/blockOrange.svg';
import BlockGreen from 'assets/images/favoriteBlock/blockGreen.svg';
import BlockPurple from 'assets/images/favoriteBlock/blockPurple.svg';
import {
  ShareIcon, GiftIcon,
  AccountIcon1, AccountIcon2, AccountIcon3, AccountIcon4, AccountIcon5, AccountIcon6, AccountIcon7, AccountIcon8, AccountIcon9, AccountIcon14,
  ApplyIcon1, ApplyIcon2, ApplyIcon3, ApplyIcon4, ApplyIcon5,
  TransactionIcon1, TransactionIcon2, TransactionIcon3, TransactionIcon4, TransactionIcon5, TransactionIcon6, TransactionIcon7, TransactionIcon8,
  InvestIcon1, InvestIcon2, InvestIcon3,
  CreditCardIcon1, CreditCardIcon2, CreditCardIcon3, CreditCardIcon4, CreditCardIcon5,
  LoanIcon1, LoanIcon2,
  HelperIcon1, HelperIcon2, HelperIcon3, HelperIcon4, HelperIcon5, HelperIcon6, HelperIcon7, HelperIcon8, HelperIcon9, HelperIcon10, HelperIcon11, HelperIcon12,
  SocialIcon1, SocialIcon2, SocialIcon3,
} from 'assets/images/icons';

export const blockBackgroundGenerator = (index) => {
  // 只有六種顏色背景
  const remainder = index % 6;
  switch (remainder) {
    case 0:
      return BlockPink;
    case 1:
      return BlockYellow;
    case 2:
      return BlockBlue;
    case 3:
      return BlockOrange;
    case 4:
      return BlockGreen;
    case 5:
      return BlockPurple;
    default:
      return BlockPurple;
  }
};

export const iconGenerator = (name) => {
  switch (name) {
    case 'share':
      return <ShareIcon />;
    case 'gift':
      return <GiftIcon />;
    case 'C00100':
      return <AccountIcon1 />;
    case 'C00300':
      return <AccountIcon2 />;
    case 'C00400':
      return <AccountIcon3 />;
    case 'C00500':
      return <AccountIcon4 />;
    case 'C00900':
      return <AccountIcon5 />;
    case 'C00600':
      return <AccountIcon6 />;
    case 'C00200':
      return <AccountIcon7 />;
    case 'account8':
      return <AccountIcon8 />;
    case 'C00800':
      return <AccountIcon9 />;
    case 'C01000':
      return <AccountIcon14 />;
    case 'F00100':
      return <ApplyIcon1 />;
    case 'F00300':
      return <ApplyIcon2 />;
    case 'F00200':
      return <ApplyIcon3 />;
    case 'F00500':
      return <ApplyIcon4 />;
    case 'F00400':
      return <ApplyIcon5 />;
    case 'D00100':
      return <TransactionIcon1 />;
    case 'D00700':
      return <TransactionIcon2 />;
    case 'D00200':
      return <TransactionIcon3 />;
    case 'D00300':
      return <TransactionIcon4 />;
    case 'D00400':
      return <TransactionIcon5 />;
    case 'D00900':
      return <TransactionIcon6 />;
    case 'D00500':
      return <TransactionIcon7 />;
    case 'D00600':
      return <TransactionIcon8 />;
    case 'E00100':
      return <InvestIcon1 />;
    case 'E00200':
      return <InvestIcon2 />;
    case 'E00300':
      return <InvestIcon3 />;
    case 'R00100':
      return <CreditCardIcon1 />;
    case 'R00200':
      return <CreditCardIcon1 />;
    case 'R00300':
      return <CreditCardIcon2 />;
    case 'R00400':
      return <CreditCardIcon3 />;
    case 'R00600':
      return <CreditCardIcon4 />;
    case 'R00500':
      return <CreditCardIcon5 />;
    case 'L00100':
      return <LoanIcon1 />;
    case 'L00200':
      return <LoanIcon2 />;
    case 'T00100':
      return <HelperIcon1 />;
    case 'S00200':
      return <HelperIcon12 />;
    case 'S00100':
      return <HelperIcon2 />;
    case 'T00600':
      return <HelperIcon3 />;
    case 'S00900':
      return <HelperIcon4 />;
    case 'D00800':
      return <HelperIcon6 />;
    case 'S00300':
      return <HelperIcon5 />;
    case 'S00400':
      return <HelperIcon7 />;
    case 'S00500':
      return <HelperIcon8 />;
    case 'S00600':
      return <HelperIcon9 />;
    case 'S00700':
      return <HelperIcon10 />;
    case 'S00800':
      return <HelperIcon11 />;
    case 'M00100':
      return <SocialIcon1 />;
    case 'M00200':
      return <SocialIcon2 />;
    case 'M00300':
      return <SocialIcon3 />;
    default:
      return null;
  }
};

// TODO: 金融助手 Icons 設計稿有修改
export const favIconGenerator = (actKey) => {
  switch (actKey) {
    // 預設
    case 'Z01':
      return <ShareIcon />;
    case 'Z02':
      return <GiftIcon />;

    // 帳戶服務
    case 'A01':
      return <AccountIcon1 />;
    case 'A02':
      return <AccountIcon2 />;
    case 'A03':
      return <AccountIcon3 />;
    case 'A04':
      return <AccountIcon4 />;
    case 'A05':
      return <AccountIcon5 />;
    case 'A06':
      return <AccountIcon6 />;
    case 'A07':
      return <AccountIcon7 />;
    case 'A08':
      return <AccountIcon8 />;
    case 'A09':
      return <AccountIcon9 />;

    // 申請
    case 'B01':
      return <ApplyIcon1 />;
    case 'B02':
      return <ApplyIcon2 />;
    case 'B03':
      return <ApplyIcon3 />;
    case 'B04':
      return <ApplyIcon4 />;
    case 'B05':
      return <ApplyIcon5 />;

    // 轉帳提款
    case 'C01':
      return <TransactionIcon1 />;
    case 'C02':
      return <TransactionIcon2 />;
    case 'C03':
      return <TransactionIcon3 />;
    case 'C04':
      return <TransactionIcon4 />;
    case 'C05':
      return <TransactionIcon5 />;
    case 'C06':
      return <TransactionIcon6 />;
    case 'C07':
      return <TransactionIcon7 />;
    case 'C08':
      return <TransactionIcon8 />;

    // 投資理財
    case 'D01':
      return <InvestIcon1 />;
    case 'D02':
      return <InvestIcon2 />;
    case 'D03':
      return <InvestIcon3 />;

    // 信用卡
    case 'E01':
      return <CreditCardIcon1 />;
    case 'E02':
      return <CreditCardIcon2 />;
    case 'E03':
      return <CreditCardIcon3 />;
    case 'E04':
      return <CreditCardIcon4 />;
    case 'E05':
      return <CreditCardIcon5 />;

    // 貸款
    case 'F01':
      return <LoanIcon1 />;
    case 'F02':
      return <LoanIcon2 />;

    // 金融助手
    case 'G01':
      return <HelperIcon1 />;
    case 'G02':
      return <HelperIcon2 />;
    case 'G03':
      return <HelperIcon3 />;
    case 'G04':
      return <HelperIcon4 />;
    case 'G05':
      return <HelperIcon5 />;
    case 'G06':
      return <HelperIcon6 />;
    case 'G07':
      return <HelperIcon7 />;
    case 'G08':
      return <HelperIcon8 />;
    case 'G09':
      return <HelperIcon9 />;
    case 'G010':
      return <HelperIcon10 />;
    case 'G011':
      return <HelperIcon11 />;

    // 社群圈
    case 'H01':
      return <SocialIcon1 />;
    case 'H02':
      return <SocialIcon2 />;
    case 'H03':
      return <SocialIcon3 />;

    default:
      return null;
  }
};
