/* eslint-disable import/prefer-default-export */

/* ========= 通用函式 ========= */

// 將數字轉為加上千分位符號的字串
export const toCurrency = (number) => {
  if (number) {
    const parts = number.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }
  if (number === 0 || number === '0') return '0';
  return '';
};

// 將帳號轉為指定字數間帶有分隔符 (-) 之顯示方式
export const accountFormatter = (account) => (
  account ? `${account.slice(0, 3)}-${account.slice(3, 6)}-${account.slice(6)}` : '-'
);

// 將日期格式轉為 YYYY/MM/DD 字串或 YYYY-MM-DD 字串 (傳入第 2 個參數，值為 truthy)
export const dateFormatter = (date, dashType) => {
  if (date) {
    date = new Date(date);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    if (dashType) return `${year}-${month}-${day}`;
    return `${year}/${month}/${day}`;
  }
  return '';
};

// 將日期格式轉為 YYYYMMDD 字串
export const stringDateCodeFormatter = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}${month}${day}`;
};

// 將日期格式由 YYYYMMDD 字串轉為 YYYY/MM/DD 字串
export const stringDateFormatter = (stringDate) => {
  const dateArray = stringDate.split('');
  dateArray.splice(4, 0, '/');
  dateArray.splice(7, 0, '/');
  return dateArray.join('');
};

// 將時間格式轉為 HH:DD 字串
export const timeFormatter = (time) => {
  time = new Date(time);
  const hour = time.getHours().toString().padStart(2, '0');
  const minute = time.getMinutes().toString().padStart(2, '0');
  return `${hour}:${minute}`;
};

// 將時間格式轉為 HH:DD:SS 字串
export const timeSecondFormatter = (time) => {
  time = new Date(time);
  const hour = time.getHours().toString().padStart(2, '0');
  const minute = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  return `${hour}:${minute}:${seconds}`;
};

// 將秒數轉為 MM:SS 字串
export const countdownTimerFormatter = (count) => {
  const min = Math.floor(count / 60);
  const sec = count % 60;
  return `${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`;
};

// 將數字 1-7 轉為中文大寫
export const weekNumberToChinese = (value) => {
  switch (parseInt(value, 10)) {
    case 1:
      return '一';
    case 2:
      return '二';
    case 3:
      return '三';
    case 4:
      return '四';
    case 5:
      return '五';
    case 6:
      return '六';
    case 7:
      return '日';
    default:
      return '';
  }
};

// 將拉阿伯數字轉換為中文大寫
/* eslint-disable eqeqeq */
export const numberToChinese = (num) => {
  if (Number.isNaN(Number(num))) {
    return '(非數字)';
  }
  let number = num.split('.')[0];
  const digtalNum = num.split('.')[1];
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
    if (!digtalNum) {
      chineseBigNumber = `(${chineseBigNumber}元)`;
    } else {
      let chineseDigtalNumber = '';
      for (let i = 0; i < digtalNum.length; i++) {
        chineseDigtalNumber += chineseNumber[Number(digtalNum[i])];
      }
      chineseBigNumber = `(${chineseBigNumber}點${chineseDigtalNumber}元)`;
    }
  }
  return chineseBigNumber;
};

// 帳戶科目別對應的存款卡顏色
export const accountTypeColorGenerator = (currency) => {
  switch (currency) {
    case '001': // 活期存款
      return '';
    case '003': // 行員存款
      return '';
    case '004': // 活期儲蓄存款
      return 'purple';
    case '007': // 外幣存款
      return 'blue';
    case '010': // 定存 (010 科目別包含台外幣定存)
      return '';
    case '031': // 支存
      return '';
    case '041': // 信託
      return '';
    case '050': // 放款
    default:
      return null;
  }
};

// 貨幣單位文字轉為符號
export const currencySymbolGenerator = (currency) => {
  switch (currency) {
    case 'NTD': // 新台幣
      return '$';
    case 'TWD': // 新台幣
      return '$';
    case 'USD': // 美金
      return 'US$';
    case 'GBP': // 英鎊
      return '£';
    case 'HKD': // 港幣
      return 'HK$';
    case 'CHF': // 瑞士法郎
      return 'Fr';
    case 'AUD': // 澳幣
      return 'A$';
    case 'SGD': // 新加坡幣
      return 'S$';
    case 'JPY': // 日幣
      return '¥';
    case 'CAD': // 加幣
      return 'CAN$';
    case 'THB': // 泰幣
      return '฿';
    case 'ZAR': // 南非幣
      return 'R';
    case 'PLN': // 波蘭幣
      return 'zł';
    case 'CNY': // 人民幣
      return 'RMB¥';
    case 'EUR': // 歐元
      return '€';
    case 'NZD': // 紐西蘭幣
      return 'NZ$';
    default:
      return null;
  }
};

// 貨幣單位英文轉華文
export const currencyZhGenerator = (currency) => {
  switch (currency) {
    case 'TWD': // 新台幣
      return '新台幣';
    case 'NTD': // 新台幣
      return '新台幣';
    case 'USD': // 美金
      return '美金';
    case 'GBP': // 英鎊
      return '英鎊';
    case 'HKD': // 港幣
      return '港幣';
    case 'CHF': // 瑞士法郎
      return '瑞士法郎';
    case 'AUD': // 澳幣
      return '澳幣';
    case 'SGD': // 新加坡幣
      return '新加坡幣';
    case 'JPY': // 日幣
      return '日圓';
    case 'CAD': // 加幣
      return '加幣';
    case 'THB': // 泰幣
      return '泰銖';
    case 'ZAR': // 南非幣
      return '南非幣';
    case 'PLN': // 波蘭幣
      return '波蘭幣';
    case 'CNY': // 人民幣
      return '人民幣';
    case 'EUR': // 歐元
      return '歐元';
    case 'NZD': // 紐西蘭幣
      return '紐西蘭幣';
    default:
      return null;
  }
};

// 姓名隱碼化，王小明 -> 王Ｏ明
export const hideName = (name) => {
  if (!name) return;

  /* eslint-disable consistent-return */
  const nameLength = name.length;
  const firstCharacter = name.substr(0, 1);

  if (nameLength < 2) return firstCharacter;
  if (nameLength < 3) return `${firstCharacter}Ｏ`;

  const lastCharacter = name.substr(nameLength - 1, 1);
  const others = [];
  for (let i = 0; i < name.length - 2; i++) others.push('Ｏ');
  return firstCharacter + others.join('') + lastCharacter;
};
