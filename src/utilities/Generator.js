/* eslint-disable import/prefer-default-export */

/* ========= 通用函式 ========= */

// 將數字轉為加上千分位符號的字串
export const toCurrency = (number) => {
  const parts = number.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

// 將日期格式轉為 YYYY/MM/DD 字串
export const dateFormatter = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}/${month}/${day}`;
};

// 將拉阿伯數字轉換為中文大寫
/* eslint-disable eqeqeq */
export const numberToChinese = (number) => {
  if (Number.isNaN(Number(number))) {
    return '(非數字)';
  }
  const chineseNumber = ('零壹貳參肆伍陸柒捌玖').split('');
  const amountSmallUnit = ['', '拾', '佰', '千'];
  const amountBigUnit = ['', '萬', '億', '兆', '京', '垓', '秭', '穰', '溝', '澗', '正', '載'];
  const arabicNumeralsSplitSplit = [];
  const arabicNumeralsSplitSplitCount = parseInt(number.length / 4, 10);

  for (let i = 0; i <= arabicNumeralsSplitSplitCount; i++) {
    if (i == 0 && number.length % 4 != 0) {
      arabicNumeralsSplitSplit[i] = number.substr(0, number.length % 4);
      number = number.slice(number.length % 4);
    } else if (number != '') {
      arabicNumeralsSplitSplit[i] = number.substr(0, 4);
      number = number.slice(4);
    }
  }

  let chineseBigNumber = '';

  for (let i = 0; i < arabicNumeralsSplitSplit.length; i++) {
    for (let j = 0; j < arabicNumeralsSplitSplit[i].length; j++) {
      if (arabicNumeralsSplitSplit[i][0] != 0 && j == 1
        && arabicNumeralsSplitSplit[i][j] == 0
        && arabicNumeralsSplitSplit[i].length == 4
        && arabicNumeralsSplitSplit[i][2] != 0) {
        chineseBigNumber += chineseNumber[arabicNumeralsSplitSplit[i][j]];
      } else if (arabicNumeralsSplitSplit[i][j] != 0) {
        chineseBigNumber += chineseNumber[arabicNumeralsSplitSplit[i][j]];
        chineseBigNumber += amountSmallUnit[arabicNumeralsSplitSplit[i].length - 1 - j];
      } else if (arabicNumeralsSplitSplit[i][j] == 0 && arabicNumeralsSplitSplit[i][j - 1] != 0) {
        if (arabicNumeralsSplitSplit[i][arabicNumeralsSplitSplit[i].length - 1] != 0) {
          chineseBigNumber += chineseNumber[arabicNumeralsSplitSplit[i][j]];
        }
      }
    }
    if (parseInt(arabicNumeralsSplitSplit[i], 10) != 0) {
      chineseBigNumber += amountBigUnit[arabicNumeralsSplitSplit.length - 1 - i];
    }
  }

  if (chineseBigNumber != '') {
    /* chineseBigNumber += '元整'; */
    chineseBigNumber = `(${chineseBigNumber}元)`;
  }
  return chineseBigNumber;
};
