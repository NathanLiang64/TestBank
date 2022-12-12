/* eslint-disable object-curly-newline */
/* eslint-disable import/prefer-default-export */

/* ========= 通用函式 ========= */

/**
 * 將數字轉為加上千分位符號的字串
 * @param {Number} amount 金額，可以有小數
 * @param {Number?} float 小數位數，會捨位或補零
 * @param {Boolean?} showFloat 強制顯示小數部份，不受 float 的小數位數限制。
 */
export const toCurrency = (number, float = 0, showFloat = false) => {
  if (number === null) return '';
  if (number === '*') return '＊＊＊＊＊'; // 不顯示餘額。

  const parts = number.toString().split('.') ?? ['0']; // 預設為'0'
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // 取出整數加上千分位','

  /* 如台幣帳戶需顯示小數點，傳入isShowDecimal: true */
  if (showFloat && parts[1]) float = parts[1].length;

  if (float > 0) {
    parts[1] = `${parts[1] ?? ''}000000`.substring(0, float); // 小數位數補齊
  } else parts.splice(1, 1); // 不要顯示小數時，就把小數的數值刪掉。

  return parts.join('.');
};

// 將數字轉為「千」或「萬」，假設數字大於「千」，小於「千萬」
// 例：1000 -> 1千    10000 -> 1萬    1000000 -> 100萬
// 特例：999 -> 1千    10000000 -> 1,000萬
export const toThousandNotation = (number) => {
  const isTenThousand = Math.floor(number / 1000) >= 10;
  return isTenThousand ? `${toCurrency(number / 10000)}萬` : `${Math.round(number / 1000)}千`;
};

// 將帳號轉為指定字數間帶有分隔符 (-) 之顯示方式
export const accountFormatter = (account) => {
  const acct = account ?? '00000000000000';
  return `${acct.slice(0, 3)}-${acct.slice(3, 6)}-${acct.slice(6)}`;
};

const dateRule = /^((?<yTW>1\d\d|[789]\d)|(?<yyyy>19\d\d|20\d\d))(?<mm>[1-9]|0[1-9]|1[012])(?<dd>[1-9]|0[1-9]|[12]\d|3[01])$/;
/**
 * 將日期字串轉為 Date 物件。
 * @param {String} stringDate YYYYMMDD 或 YYYY/MM/DD 格式的日期字串。
 * @param {String?} splitter 輸出日期字串的間隔字元。例：'/'
 * @returns {Date} 若傳入空值，則傳回 null
 */
export const stringToDate = (stringDate, splitter) => {
  if (stringDate) {
    if (splitter) {
      const parts = stringDate.split(splitter);
      return new Date(parts[0], parts[1] - 1, parts[2]);
    }

    const matchs = stringDate.replace(/[^\d]/g, '').match(dateRule);
    if (matchs) {
      // yTWD = 民國年(7x~199)
      const { yTW, yyyy, mm, dd } = matchs.groups;
      const year = yyyy ?? (parseInt(yTW, 10) + 1911);

      const date = new Date(year, (mm - 1), dd);
      return new Date(date);
    }

    console.error('日期字串無法轉換為 Date 物件 : ', stringDate);
  }
  return null;
};

/**
 * 將日期格式轉為字串，預設格式為 yyyy/MM/dd。
 * @param {Date|String} date 要轉換的日期物件或 yyyyMMdd格式字串。
 * @param {String?} splitter 輸出日期字串的間隔字元，預設值為'/'。若要轉換為 yyyyMMdd 則將此參數設為空字串。
 * @param {Boolean?} mmddOnly 表示不需要年的部份。
 * @returns {String} 傳為以 splitter 為分隔字元的日期字串，例：2022/10/01
 */
export const dateToString = (date, splitter, mmddOnly) => {
  if (!date) return '';

  if (!(date instanceof Date)) {
    date = stringToDate(date);
    if (!date) return '';
  }

  const parts = [
    date.getFullYear(),
    (date.getMonth() + 1).toString().padStart(2, '0'),
    date.getDate().toString().padStart(2, '0'),
  ];
  if (mmddOnly) parts.splice(0, 1); // 移除年。

  return parts.join(splitter ?? '/');
};

/**
 * 將日期轉為 YYYYMMDD 字串
 * @param {Date} date 要轉換的日期；若為 null 則以 Today 為預設值。
 * @returns {String}
 */
export const dateToYMD = (date) => dateToString(date ?? new Date(), '');

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
  let number = String(num).split('.')[0];
  const digtalNum = String(num).split('.')[1];
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

// 帳務總覽對應名稱和卡色
// 卡牌顏色:
// 1. 母帳戶(深紫)
// 2. 社群圈(粉)
// 3. 存錢計劃(黃)
// 4. 證卷交割帳戶(藍)
// 5. 外幣帳戶(橘)
// 6. 信用卡(綠)
// 7. 貸款卡(淺紫)
// 8. 社群帳本卡(粉)
export const accountOverviewCardVarient = (type) => {
  switch (type) {
    case 'M':
      return { name: '母帳戶', color: 'purple' };
    case 'S':
      return { name: '證券戶', color: 'blue' };
    case 'F':
      return { name: '外幣帳戶', color: 'orange' };
    case 'C':
      return { name: '子帳戶', color: 'yellow' };
    case 'CC':
      return { name: '信用卡', color: 'green' };
    case 'L':
      return { name: '貸款', color: 'lightPurple' };
    default:
      return { name: '', color: '' };
  }
};

export const CurrencyInfo = [
  // TODO NTD ? TWD ? 應統一才對！
  { code: 'NTD', name: '新台幣', symbol: '$', float: 0 },
  { code: 'TWD', name: '新台幣', symbol: '$', float: 0 },
  { code: 'USD', name: '美元', symbol: 'US$', float: 2 },
  { code: 'GBP', name: '英鎊', symbol: '£', float: 2 },
  { code: 'HKD', name: '港幣', symbol: 'HK$', float: 2 },
  { code: 'CHF', name: '瑞士法郎', symbol: 'Fr', float: 2 },
  { code: 'AUD', name: '澳幣', symbol: 'A$', float: 2 },
  { code: 'SGD', name: '新加坡幣', symbol: 'S$', float: 2 },
  { code: 'JPY', name: '日幣', symbol: '¥', float: 0 },
  { code: 'CAD', name: '加幣', symbol: 'CAN$', float: 2 },
  { code: 'THB', name: '泰幣', symbol: '฿', float: 0 },
  { code: 'ZAR', name: '南非幣', symbol: 'R', float: 2 },
  { code: 'PLN', name: '波蘭幣', symbol: 'zł', float: 2 },
  { code: 'CNY', name: '人民幣', symbol: 'RMB¥', float: 0 },
  { code: 'EUR', name: '歐元', symbol: '€', float: 2 },
  { code: 'NZD', name: '紐西蘭幣', symbol: 'NZ$', float: 2 },
];

/**
 * 取得指定幣別的（代碼、名稱、符號、小數位數）資訊。
 * @param {string} currency 貨幣代碼；可為空值，表示所有貨幣。
 * @return 指定幣別資訊；若未指定則傳回所有幣別資訊。
 */
export const getCurrenyInfo = (currency = null) => {
  const ccyInfo = CurrencyInfo.find((ccy) => currency === null || ccy.code === currency);
  return ccyInfo;
};

/**
 * 取得指定幣別的名稱。
 * @param {String} currency 幣別代碼。
 * @returns {String} 幣別的名稱, 當找不到指定幣別名稱時，以原代碼傳回。
 */
export const getCurrenyName = (currency) => {
  const ccyInfo = getCurrenyInfo(currency);
  return ccyInfo ? ccyInfo.name : currency;
};

/**
 * 貨幣單位文字轉為符號
 * @param {String} currency 幣別代碼，例：TWD
 * @param {Number} amount 金額，可以有小數
 * @param {Boolean?} showFloat 強制顯示小數部份，不受各幣別內定的小數位數限制。
 */
export const currencySymbolGenerator = (currency, amount, showFloat = false) => {
  const ccyInfo = CurrencyInfo.find((ccy) => ccy.code === currency);
  const amtStr = toCurrency(amount, ccyInfo?.float, showFloat) ?? '';
  if (ccyInfo) {
    return ccyInfo.symbol + amtStr;
  }
  return amtStr;
};

// 貨幣單位英文轉華文
export const currencyZhGenerator = (currency) => {
  const ccyInfo = CurrencyInfo[currency];
  return ccyInfo?.name ?? currency;
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

// 將全形文字轉為半形
export const toHalfWidth = (str) => str?.replace(
  /[\uff01-\uff5e]/g,
  (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0),
);

// 將數字中的0轉換為中文
export const switchZhNumber = (numIndication, isPlus) => {
  // 計算位數
  // eslint-disable-next-line no-bitwise
  const logedNum = (Math.log(numIndication) * Math.LOG10E + 1) | 0;

  // 依據位數判斷回傳數字級單位
  switch (logedNum) {
    case 4: // 千
      return `${numIndication / 1000}千`;
    case 5: // 萬
      // eslint-disable-next-line no-case-declarations
      const thousand = (numIndication % 10000) / 1000;
      // eslint-disable-next-line no-case-declarations
      const tenThousand = Math.floor(numIndication / 10000);
      return `${tenThousand}萬${thousand !== 0 ? `${thousand}千` : ''}`;
    case 6: // 十萬
      return `${numIndication / 10000}萬`;
    case 7: // 百萬
      return isPlus
        ? `${numIndication / 10000}萬`
        : `${numIndication / 1000000}百萬`;
    case 8: // 千萬
      return `${numIndication / 10000000}千萬`;
    case 9: // 億
      return `${numIndication / 100000000}億`;
    default:
      return '0';
  }
};
