import { FuncID } from 'utilities/FuncID';
import BlockPink from 'assets/images/favoriteBlock/blockPink.svg';
import BlockYellow from 'assets/images/favoriteBlock/blockYellow.svg';
import BlockBlue from 'assets/images/favoriteBlock/blockBlue.svg';
import BlockOrange from 'assets/images/favoriteBlock/blockOrange.svg';
import BlockGreen from 'assets/images/favoriteBlock/blockGreen.svg';
import BlockPurple from 'assets/images/favoriteBlock/blockPurple.svg';
import {
  B002, AccountIcon8,
  B005,
  C001, C003, C004, C005, C009, C006, C002, C008, C010,
  F001, F003, F002, F005, F004,
  D001, D007, D002, D003, D004, D009, D005, D006,
  E001, E002, E003,
  R001, R003, R004, R006, R005,
  L001, L002,
  T001, S002, T006, S009, S003, D008, S004, S005, S006, S007, S008, S001,
  M001, M002, M003, N002,
} from 'assets/images/icons';

export const getFuncButtonBackground = (index) => {
  // 只有六種顏色背景
  const remainder = index % 6;
  switch (remainder) {
    case 0: return BlockPink;
    case 1: return BlockYellow;
    case 2: return BlockBlue;
    case 3: return BlockOrange;
    case 4: return BlockGreen;
    case 5: return BlockPurple;
    default: return BlockPurple;
  }
};

/**
 * 取得單元功能圖示。 // TODO 參考 B00600 更多改用 Icons 的方法。
 * @param {String} funcCode 功能代碼.
 * @returns
 */
export const iconGenerator = (funcCode) => {
  switch (funcCode) {
    case 'share': return <B002 />;
    case 'N00100': return <B005 />;
    case 'N00200': return <N002 />;
    case 'C00100': return <C001 />;
    case 'C00300': return <C003 />;
    case 'C00400': return <C004 />;
    case 'C00500': return <C005 />;
    case 'C00900': return <C009 />;
    case 'C00600': return <C006 />;
    case 'C00200': return <C002 />;
    case 'account8': return <AccountIcon8 />;
    case 'C00800': return <C008 />;
    case 'C01000': return <C010 />;
    case 'F00100': return <F001 />;
    case 'F00300': return <F003 />;
    case 'F00200': return <F002 />;
    case 'F00500': return <F005 />;
    case 'F00400': return <F004 />;
    case FuncID.D00100_臺幣轉帳: return <D001 />;
    case 'D00700': return <D007 />;
    case 'D00200': return <D002 />;
    case 'D00300': return <D003 />;
    case 'D00400': return <D004 />;
    case 'D00900': return <D009 />;
    case 'D00500': return <D005 />;
    case 'D00600': return <D006 />;
    case FuncID.E00100_換匯: return <E001 />;
    case 'E00200': return <E002 />;
    case 'E00300': return <E003 />;
    case 'R00100': return <R001 />;
    case 'R00200': return <R001 />; // TODO 缺 R002
    case 'R00300': return <R003 />;
    case 'R00400': return <R004 />;
    case 'R00600': return <R006 />;
    case 'R00500': return <R005 />;
    case 'L00100': return <L001 />;
    case 'L00200': return <L002 />;
    case 'T00100': return <T001 />;
    case 'S00200': return <S002 />;
    case 'S00100': return <S001 />;
    case 'T00600': return <T006 />;
    case 'S00900': return <S009 />;
    case 'D00800': return <D008 />;
    case 'S00300': return <S003 />;
    case 'S00400': return <S004 />;
    case 'S00500': return <S005 />;
    case 'S00600': return <S006 />;
    case 'S00700': return <S007 />;
    case 'S00800': return <S008 />;
    case 'M00100': return <M001 />;
    case 'M00200': return <M002 />;
    case 'M00300': return <M003 />;
    default: return null;
  }
};
