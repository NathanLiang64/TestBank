import BlockPink from 'assets/images/favoriteBlock/blockPink.svg';
import BlockYellow from 'assets/images/favoriteBlock/blockYellow.svg';
import BlockBlue from 'assets/images/favoriteBlock/blockBlue.svg';
import BlockOrange from 'assets/images/favoriteBlock/blockOrange.svg';
import BlockGreen from 'assets/images/favoriteBlock/blockGreen.svg';
import BlockPurple from 'assets/images/favoriteBlock/blockPurple.svg';

/**
 * 取得單元功能按鈕的背景色。
 * 目前提供六種顏色。
 * @param {Number} index
 */
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
