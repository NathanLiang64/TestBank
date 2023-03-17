import { callAPI } from './axios';
import { showCustomPrompt } from './MessageModal';

/**
 * 單元功能代表、執行條件、是否外開、是否原生功能...等資訊。
 * // TODO 應改為從 DB 取得。
 */
export const Func = {
  /**
   * 找出指定功能代碼的功能資訊。
   * @param {*} funcCode 功能代碼
   * @returns 功能資訊
   */
  find: (funcCode) => Object.entries(Func)
    .map((f) => f[1])
    .find((f) => f.id === funcCode),

  // NOTE 重要關念！
  //      功能代碼 與 Route所定義的 URL 無直接關係，目前雖然二者看起來是一致的，但URL是在DB中定義
  //      所以在Web端模擬時，用 HardCode URL才能進行測試

  /**
   * 登入頁
   */
  A003: {
    id: 'A003',
    required: [],
    isAppFunc: true, // 表示是原生的功能
  },

  /**
   * 開通APP
   */
  A004: {
    id: 'A004',
    required: [],
  },

  /**
   * 定期更新個資 (六個月)
   */
  A006: {
    id: 'A006',
    required: [],
  },

  /**
   * 定期更新密碼 (一年)
   */
  A007: {
    id: 'A007',
    authCode: 0x28,
    required: [],
  },

  /**
   * 訪客註冊
   */
  A008: {
    id: 'A008',
    authCode: 0x01,
    required: [],
    isOuterFunc: true, // 表示是在登入前所使用的功能
  },

  /**
   * 首頁
   */
  B001: {
    id: 'B001',
    required: [],
    isAppFunc: true, // 表示是原生的功能
  },

  /**
   * 分享? // TODO: 確認功能中文名稱
   */
  B00200: {
    id: 'B002',
    required: [],
  },

  /**
   * 訊息總覽(快捷列-通知)
   */
  B003: {
    id: 'B003',
    required: [],
  },

  /**
   * 優惠
   */
  B00500: {
    id: 'B005',
    required: [],
    isAppFunc: true, // 表示是原生的功能
  },

  /**
   * 更多
   */
  B006: {
    id: 'B006',
    required: [],
  },

  /**
   * 帳戶總覽頁
   */
  C001: {
    id: 'C001',
    required: [],
  },

  /**
   * 社群帳本
   */
  C00200: {
    id: 'C002',
    required: [],
    isAppFunc: true,
  },

  /**
   * 臺幣活存 (存款卡(台)首頁)
   */
  C003: {
    id: 'C003',
    required: ['M'],
  },

  /**
   * 外幣活存 (存款卡(外)首頁)
   */
  C004: {
    id: 'C004',
    required: ['F'],
  },

  /**
   * 證券交割戶 (證券交割戶首頁)
   */
  C005: {
    id: 'C005',
    required: ['S'],
  },

  /**
   * 存錢計畫
   */
  C006: {
    id: 'C006',
    authCode: 0x20,
    required: ['M'],
  },

  /**
   * 信用卡首頁 (含社群圈分潤)
   */
  C007: {
    id: 'C007',
    required: ['CC'],
  },

  /**
   * 匯出存摺
   */
  C008: {
    id: 'C008',
    required: ['M', 'S'],
  },

  /**
   * 臺幣定存
   */
  C00900: {
    id: 'C009',
    authCode: 0x30,
    required: [],
  },

  /**
   * 外幣定存
   */
  C01000: {
    id: 'C010',
    authCode: 0x30,
    required: [],
  },

  /**
   * 臺幣轉帳
   */
  D001: {
    id: 'D001',
    authCode: {
      NONREG: 0x20, // 臺幣-非約轉帳
      REG: 0x30, // 臺幣-約定轉帳
    },
    required: ['M', 'S'],
  },

  /**
   * QR CODE轉帳
   */
  D002: {
    id: 'D002',
    required: ['M', 'S'],
    isAppFunc: true, // 表示是原生的功能
  },

  /**
   * 無卡提款
   */
  D003: {
    id: 'D003',
    authCode: 0x20,
    required: ['M'],
  },

  /**
   * 變更無卡提款密碼
   */
  D004: {
    id: 'D004',
    authCode: 0x20,
    required: ['M'],
  },

  /**
   * 常用帳號管理
   */
  D005: {
    id: 'D005',
    required: ['M', 'F', 'S'],
  },

  /**
   * 約定帳號管理
   */
  D006: {
    id: 'D006',
    required: ['M', 'F', 'S'],
  },

  /**
   * 外幣轉帳_本行同幣別外幣轉帳流程
   */
  D007: {
    id: 'D007',
    authCode: 0x30,
    required: ['F'],
  },

  /**
   * 預約轉帳查詢/取消
   */
  D008: {
    id: 'D008',
    authCode: 0x30,
    required: ['M', 'S'],
  },

  /**
   * 境外快速匯款 Phase II
   */
  D00900: {
    id: 'D009',
    required: [],
  },

  /**
   * 換匯(包含 台換外、外換台)
   */
  E001: {
    id: 'E001',
    authCode: 0x30,
    required: ['M,F', 'S,F'], // NOTE 表示需要同時具有(M 及 F)或(S 及 F)
  },

  /**
   * 匯率 (含在換匯裡的功能，另外拉出一個獨立入口)
   */
  E002: {
    id: 'E002',
    required: [],
  },

  /**
   * 金融百貨
   */
  E003: {
    id: 'E003',
    required: [],
  },

  /**
   * 外幣到價通知設定
   */
  E004: {
    id: 'E004',
    required: [],
  },

  /**
   * 申請臺幣數存
   */
  F00100: {
    id: 'F001',
    required: [],
    hidden: 'M',
    isOpenExternalBrowser: true,
  },

  /**
   * 申請證券交割戶
   */
  F00200: {
    id: 'F002',
    required: [],
    hidden: 'S',
    isOpenExternalBrowser: true,
  },

  /**
   * 申請外幣數存
   */
  F00300: {
    id: 'F003',
    required: [],
    hidden: 'F',
    isOpenExternalBrowser: true,
  },

  /**
   * 申請貸款
   */
  F00400: {
    id: 'F004',
    required: [],
    // hidden: 'L', 貸款可重複申請
    isOpenExternalBrowser: true,
  },

  /**
   * 申請信用卡
   */
  F00500: {
    id: 'F005',
    required: [],
    hidden: 'CC',
    isOpenExternalBrowser: true,
  },

  /**
   * 我的貸款 (原名：繳款紀錄)
   */
  L001: {
    id: 'L001',
    required: ['L'],
  },

  /**
   * 貸款應繳查詢 (原名：應繳本息明細)
   */
  L002: {
    id: 'L002',
    required: ['L'],
  },

  /**
   * 貸款繳款紀錄
   */
  L003: {
    id: 'L003',
    required: [],
  },

  /**
   * 社群圈 (社群圈首頁) 含 推薦碼分享
   */
  M001: {
    id: 'M001',
    required: [],
  },

  /**
   * 社群圈 好友查詢
   */
  M002: {
    id: 'M002',
    required: [],
  },

  /**
   * ? // TODO: 確認功能中文名稱
   */
  M00300: {
    id: 'M003',
    required: [],
  },

  /**
   * 會員專區
   */
  N00100: {
    id: 'N001',
    required: [],
    isAppFunc: true, // 表示是原生的功能
  },

  /**
   * 信用卡 - 即時消費明細
   */
  R001: {
    id: 'R001',
    required: ['CC'],
  },

  /**
   * 信用卡 - 晚點付 (原名：分期)
   */
  R002: {
    id: 'R002',
    authCode: 0x30,
    required: ['CC'],
  },

  /**
   * 信用卡 - 帳單明細
   */
  R003: {
    id: 'R003',
    required: ['CC'],
  },

  /**
   * 信用卡 - 繳費
   */
  R004: {
    id: 'R004',
    authCode: 0x30,
    required: ['CC'],
  },

  /**
   * 信用卡 - 自動扣繳申請/查詢
   */
  R005: {
    id: 'R005',
    authCode: 0x30,
    required: ['CC'],
  },

  /**
   * 信用卡 - 額度臨調 Phase II
   */
  R00600: {
    id: 'R006',
    authCode: 0x30,
    required: [],
  },

  /**
   * 我的最愛
   */
  S001: {
    id: 'S001',
    required: [],
  },

  /**
   * 約定本人帳號設定
   */
  S00200: {
    id: 'S002',
    required: [],
    isOpenExternalBrowser: true,
  },

  /**
   * 視訊約定帳號設定
   */
  S00300: {
    id: 'S003',
    required: [],
    isOpenExternalBrowser: true,
  },

  /**
   * 訊息通知設定
   */
  S004: {
    id: 'S004',
    authCode: 0x30,
    required: [],
  },

  /**
   * 他行存款自動存入設定
   */
  S00500: {
    id: 'S005',
    required: [],
    isOpenExternalBrowser: true,
  },

  /**
   * 常見問題
   */
  S006: {
    id: 'S006',
    required: [],
  },

  /**
   * 金融卡啟用
   */
  S007: {
    id: 'S007',
    authCode: 0x20,
    required: ['M'],
  },

  /**
   * 金融卡掛失補發
   */
  S008: {
    id: 'S008',
    authCode: 0x28,
    required: ['M'],
  },

  /**
   * 數存會員升級(超商驗證)
   */
  S00900: {
    id: 'S009',
    required: [],
    isOpenExternalBrowser: true,
  },

  /**
   * 個人化設定
   */
  T001: {
    id: 'T001',
    required: [],
  },

  /**
   * 快速登入設定
   */
  T002: {
    id: 'T002',
    authCode: {
      SET: 0x11, // 生物辨識/圖形-設定
      MODIFY: 0x20, // 圖形-修改
      UNSET: 0x20, // 生物辨識/圖形-解除
    },
    required: [],
  },

  /**
   * 非約定轉帳設定
   */
  T003: {
    id: 'T003',
    authCode: {
      APPLY: 0x20, // 非約轉設定-申請
      EDIT: 0x21, // 非約轉設定-手機號碼修改
      CLOSE: 0x20, // 非約轉設定-關閉
    },
    required: ['M', 'S'],
  },

  /**
   * 無卡提款設定
   */
  T004: {
    id: 'T004',
    authCode: 0x20,
    required: ['M'],
  },

  /**
   * 行動金融憑證設定
   */
  T00500: {
    id: 'T005',
    required: [],
  },

  /**
   * 手機號碼收款設定
   */
  T006: {
    id: 'T006',
    authCode: 0x23,
    required: [],
  },

  /**
   * 基本資料變更
   */
  T007: {
    id: 'T007',
    authCode: {
      /** 除了通訊地址及電子郵件之外，甲包含通訊門號 */
      MOBILE: 0x31,
      /** 除了通訊地址及電子郵件之外，甲包含通訊門號 */
      EMAIL_ADDRESS: 0x28,
    },
    required: [],
  },

  /**
   * 使用者代號變更
   */
  T008: {
    id: 'T008',
    authCode: 0x28,
    required: [],
  },

  /**
   * 網銀密碼變更
   */
  T009: {
    id: 'T009',
    authCode: 0x28,
    required: [],
  },

  /**
   * 搖一搖功能設定
   */
  Z99997: {
    id: 'Z903',
    required: [],
    isAppFunc: true, // 表示是原生的功能
  },
};

/**
 * 無法進入目標畫面時所顯示之彈窗
 */
const handleShowPrompt = async (type) => {
  let errMsg;
  switch (type) {
    case 'M':
      errMsg = {
        message: 'Bankee臺幣數存',
        link: `${process.env.REACT_APP_APLFX_URL}prod=Ta`,
      };
      break;
    case 'F':
      errMsg = {
        message: 'Bankee外幣數存',
        link: `${process.env.REACT_APP_APLFX_URL}prod=Ta`,
      };
      break;
    case 'MF':
      errMsg = {
        message: 'Bankee臺幣及外幣數存',
        link: `${process.env.REACT_APP_APLFX_URL}prod=Ta`,
      };
      break;
    case 'S':
      errMsg = {
        message: 'Bankee證券交割帳戶',
        link: `${process.env.REACT_APP_APLFX_URL}prod=S01a`,
      };
      break;
    case 'CC':
      errMsg = {
        message: 'Bankee信用卡',
        link: `${process.env.REACT_APP_APLFX_URL}prod=Ca`,
      };
      break;
    case 'L':
      errMsg = {
        message: 'Bankee貸款',
        link: `${process.env.REACT_APP_APLFX_URL}prod=La`,
      };
      break;
    default:
      break;
  }

  await showCustomPrompt({
    title: '溫馨提醒',
    message: `您尚未擁有${errMsg.message}，是否立即申請？`,
    okContent: '立即申請',
    onOk: () => window.open(errMsg.link, '_blank'),
    cancelContent: '我再想想',
    showCloseButton: false,
  });
};

/**
 * 檢查是否可以進入目標頁面
 * @param {*} funcInfo 要檢查的功能資訊。
 */
export const isEnterFunc = async (funcInfo) => {
  const requiredList = funcInfo.required;
  if (requiredList.length > 0) {
    // 取得擁有的產品代碼清單，例：[M, F, S, C, CC, L]
    let assetTypes = sessionStorage.getItem('assetTypes');
    if (assetTypes) {
      assetTypes = assetTypes.split(',');
    } else {
      const apiRs = await callAPI('/personal/v1/getAssetTypes');
      assetTypes = apiRs.data;
      sessionStorage.setItem('assetTypes', assetTypes);
    }
    // console.log(assetTypes);

    // requiredList = ['M, 'CC'] 或 ['M,F', 'S,F']
    // item = 'M' 或 'M,F'
    const omitTypes = requiredList.map((item) => { // 找出缺少的項目。
      const omitType = item.split(',').filter((t) => !assetTypes.includes(t));
      // console.log(requiredList, omitType, omitType.join(''));
      return (omitType && omitType.length) ? omitType.join('') : null; // 沒有缺，就是符合的項目。
    });

    // 只要有任何一個項目，就可以進入單元功能；否則就詢問是否申請缺少的項目。
    const isAnyMatch = omitTypes.includes(null) && omitTypes.length >= 0;
    // console.log(isAnyMatch, omitTypes, omitTypes.includes(null), omitTypes.length >= 0);
    if (!isAnyMatch) {
      // console.log(omitTypes[0]);
      await handleShowPrompt(omitTypes[0]);
      return false;
    }
  }
  return true;
};
