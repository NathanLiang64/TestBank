/* eslint-disable object-curly-newline */
/* eslint-disable import/prefer-default-export */

/* ========= 通用函式 ========= */

// 將數字轉為加上千分位符號的字串
export const toCurrency = (number, float = 0) => {
  if (number === null) return '';
  if (number === '*') return '＊＊＊＊＊'; // 不顯示餘額。

  const parts = number.toString().split('.') ?? ['0', '']; // 預設為'0'
  let amount = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // 取出整數加上千分位','
  if (float > 0) {
    amount = `${amount}.${(`${parts[1] ?? ''}000000`).substring(0, float)}`; // 將小數加回
  }
  return amount;
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

/**
 * 將日期格式轉為 YYYYMMDD 字串。
 * @param {Date} date 要轉換的日期。
 * @param {String?} splitter 輸出日期字串的間隔字元。
 */
export const dateToString = (date, splitter) => {
  const parts = [
    date.getFullYear(),
    (date.getMonth() + 1).toString().padStart(2, '0'),
    date.getDate().toString().padStart(2, '0'),
  ];
  return parts.join(splitter ?? '/');
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
  if (stringDate) {
    const dateArray = stringDate.split('');
    dateArray.splice(4, 0, '/');
    dateArray.splice(7, 0, '/');
    return dateArray.join('');
  }
  return '';
};

/**
 * 將日期字串轉為 Date 物件。
 * @param {*} stringDate YYYYMMDD 或 YYYY/MM/DD 格式的日期字串。
 * @returns {Date} 轉換後的日期。
 */
export const stringToDate = (stringDate) => {
  if (stringDate) {
    if (stringDate.match(/^\d{8}$/)) {
      return new Date(stringDateFormatter(stringDate));
    }
    return new Date(stringDate);
  }
  return null;
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

// 貨幣單位文字轉為符號
export const currencySymbolGenerator = (currency, amount = null) => {
  const ccyInfo = CurrencyInfo.find((ccy) => ccy.code === currency);
  if (ccyInfo) {
    return ccyInfo.symbol + toCurrency(amount, ccyInfo.float);
  }
  return `$${amount ?? ''}`;
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

/**
 * 更新本地 SessionStoreage 中的資料。
 * @param {*} storeName 存在 SessionStoreage 時使用的名稱。
 * @param {*} newData 要存入的新資料；若為 null 將在 SessionStoreage 中清除此項目。
 * @returns
 */
export const setLocalData = async (storeName, newData) => {
  if (newData) {
    sessionStorage.setItem(storeName, JSON.stringify(newData));
  } else {
    sessionStorage.removeItem(storeName);
  }
  return newData;
};

/**
 * 載入本地 SessionStoreage 中的資料。
 * @param {*} storeName 存在 SessionStoreage 時使用的名稱。
 * @param {*} loadDataFunc 當 SessionStoreage 沒有資料時，可以透過這個方法取得 預設值。
 * @returns {Promise<*>} 存在 SessionStoreage 中的資料。
 */
export const loadLocalData = async (storeName, loadDataFunc) => {
  let data = sessionStorage.getItem(storeName);
  try {
    data = JSON.parse(data);
  } catch (ex) {
    sessionStorage.removeItem(storeName);
    data = null;
  }

  if (!data && loadDataFunc) {
    const result = loadDataFunc();
    if (result instanceof Promise) {
      await result.then((response) => {
        setLocalData(storeName, response); // 暫存入以減少API叫用
        data = response;
      });
    } else {
      data = result;
    }
  }

  return data;
};

// 將全形文字轉為半形
export const toHalfWidth = (str) => str.replace(
  /[\uff01-\uff5e]/g,
  (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0),
);

// 將數字中的0轉換為中文
export const switchZhNumber = (numIndication) => {
  // eslint-disable-next-line no-bitwise
  const logedNum = (Math.log(numIndication) * Math.LOG10E + 1) | 0;
  switch (logedNum) {
    case 0:
      return '';
    case 1:
      return '千';
    case 2:
      return '萬';
    case 3:
      return '0萬';
    case 4:
      return '百萬';
    case 5:
      return '千萬';
    default:
      return '億';
  }
};

// 調整優惠列表中的數字顯示
export const handleLevelList = (list) => list.map((item, index) => {
  // 調整offlineDepositRange中數字
  const offlineDepositRange = item.offlineDepositRange.replace(/,/g, '');
  const offlineDepositRangeNum = {
    firstNum: offlineDepositRange.match(/\d+/g)[0],
    secondNum: offlineDepositRange.match(/\d+/g)[1],
  };
  const offlineDepositRangeDevidedByThousand = {
    firstNum: parseInt(offlineDepositRangeNum.firstNum, 10) / 1000,
    secondNum: parseInt(offlineDepositRangeNum.secondNum, 10) / 1000,
  };
  let offlineDepositRangeFinalRes = '';

  if (index === 0) {
    offlineDepositRangeFinalRes = `${offlineDepositRangeDevidedByThousand.firstNum
      .toString()
      .replace(/0/g, '')
      + switchZhNumber(offlineDepositRangeDevidedByThousand.firstNum)
    }元 (不含) 以下`;
  } else if (index === 13) {
    offlineDepositRangeFinalRes = `${offlineDepositRangeDevidedByThousand.firstNum
      .toString()
      .replace(/0/g, '')
      + switchZhNumber(offlineDepositRangeDevidedByThousand.firstNum)
    }元 (含) 以上`;
  } else {
    offlineDepositRangeFinalRes = `${offlineDepositRangeDevidedByThousand.firstNum
      .toString()
      .replace(/0/g, '')
      + switchZhNumber(offlineDepositRangeDevidedByThousand.firstNum)
    }元 (含) ~${
      offlineDepositRangeDevidedByThousand.secondNum
        .toString()
        .replace(/0/g, '')
    }${switchZhNumber(offlineDepositRangeDevidedByThousand.secondNum)
    }元`;
  }

  // 調整plus中數字 TODO: 針對有 50的狀況修改
  const plus = item.offlineDepositRange.replace(/,/g, '');
  const plusDevidedByThousand = parseInt(plus, 10) / 1000;
  const plusFinalRes = `${plusDevidedByThousand.toString().replace(/0/g, '')
    + switchZhNumber(plusDevidedByThousand)
  }(含)`;

  // 更新數字格式後的資料
  const newItem = {
    ...item,
    plus: plusFinalRes,
    offlineDepositRange: offlineDepositRangeFinalRes,
  };

  return newItem;
});
