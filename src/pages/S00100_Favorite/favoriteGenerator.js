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
    case FuncID.B00500: return <B005 />;
    case FuncID.N00200: return <N002 />;
    case FuncID.C00100: return <C001 />;
    case FuncID.C00300: return <C003 />;
    case FuncID.C00400: return <C004 />;
    case FuncID.C00500: return <C005 />;
    case FuncID.C00900: return <C009 />;
    case FuncID.C00600: return <C006 />;
    case FuncID.C00200: return <C002 />;
    case 'account8': return <AccountIcon8 />;
    case FuncID.C00800: return <C008 />;
    case FuncID.C01000: return <C010 />;
    case FuncID.F00100: return <F001 />;
    case FuncID.F00300: return <F003 />;
    case FuncID.F00200: return <F002 />;
    case FuncID.F00500: return <F005 />;
    case FuncID.F00400: return <F004 />;
    case FuncID.D00100_臺幣轉帳: return <D001 />;
    case FuncID.D00700: return <D007 />;
    case FuncID.D00200: return <D002 />;
    case FuncID.D00300_無卡提款: return <D003 />;
    case FuncID.D00400: return <D004 />;
    case FuncID.D00900: return <D009 />;
    case FuncID.D00500: return <D005 />;
    case FuncID.D00600: return <D006 />;
    case FuncID.E00100_換匯: return <E001 />;
    case FuncID.E00200: return <E002 />;
    case FuncID.E00300: return <E003 />;
    case FuncID.R00100: return <R001 />;
    case FuncID.R00200: return <R001 />; // TODO 缺 R002
    case FuncID.R00300: return <R003 />;
    case FuncID.R00400: return <R004 />;
    case FuncID.R00600: return <R006 />;
    case FuncID.R00500: return <R005 />;
    case FuncID.L00100: return <L001 />;
    case FuncID.L00200: return <L002 />;
    case FuncID.T00100: return <T001 />;
    case FuncID.S00200: return <S002 />;
    case FuncID.S00101_我的最愛v2: return <S001 />;
    case FuncID.T00600: return <T006 />;
    case FuncID.S00900: return <S009 />;
    case FuncID.D00800: return <D008 />;
    case FuncID.S00300: return <S003 />;
    case FuncID.S00400: return <S004 />;
    case FuncID.S00500: return <S005 />;
    case FuncID.S00600: return <S006 />;
    case FuncID.S00700: return <S007 />;
    case FuncID.S00800: return <S008 />;
    case FuncID.M00100: return <M001 />;
    case FuncID.M00200: return <M002 />;
    case FuncID.M00300: return <M003 />;
    default: return null;
  }
};
