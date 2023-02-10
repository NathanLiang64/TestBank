import { Func } from 'utilities/FuncID';
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
    case Func.B00500.id: return <B005 />;
    case Func.N00200.id: return <N002 />;
    case Func.C001.id: return <C001 />;
    case Func.C003.id: return <C003 />;
    case Func.C004.id: return <C004 />;
    case Func.C005.id: return <C005 />;
    case Func.C009.id: return <C009 />;
    case Func.C006.id: return <C006 />;
    case Func.C00200.id: return <C002 />;
    case 'account8': return <AccountIcon8 />;
    case Func.C008.id: return <C008 />;
    case Func.C01000.id: return <C010 />;
    case Func.F00100.id: return <F001 />;
    case Func.F00300.id: return <F003 />;
    case Func.F00200.id: return <F002 />;
    case Func.F00500.id: return <F005 />;
    case Func.F00400.id: return <F004 />;
    case Func.D001.id: return <D001 />;
    case Func.D007.id: return <D007 />;
    case Func.D00200.id: return <D002 />;
    case Func.D003.id: return <D003 />;
    case Func.D004.id: return <D004 />;
    case Func.D00900.id: return <D009 />;
    case Func.D005.id: return <D005 />;
    case Func.D006.id: return <D006 />;
    case Func.E001.id: return <E001 />;
    case Func.E002.id: return <E002 />;
    case Func.E003.id: return <E003 />;
    case Func.R001.id: return <R001 />;
    case Func.R002.id: return <R001 />; // TODO 缺 R002
    case Func.R003.id: return <R003 />;
    case Func.R004.id: return <R004 />;
    case Func.R00600.id: return <R006 />;
    case Func.R005.id: return <R005 />;
    case Func.L001.id: return <L001 />;
    case Func.L002.id: return <L002 />;
    case Func.T001.id: return <T001 />;
    case Func.S00200.id: return <S002 />;
    case Func.S001.id: return <S001 />;
    case Func.T006.id: return <T006 />;
    case Func.S00900.id: return <S009 />;
    case Func.D008.id: return <D008 />;
    case Func.S00300.id: return <S003 />;
    case Func.S004.id: return <S004 />;
    case Func.S00500.id: return <S005 />;
    case Func.S006.id: return <S006 />;
    case Func.S007.id: return <S007 />;
    case Func.S008.id: return <S008 />;
    case Func.M001.id: return <M001 />;
    case Func.M002.id: return <M002 />;
    case Func.M00300.id: return <M003 />;
    default: return null;
  }
};
