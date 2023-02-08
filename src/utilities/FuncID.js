export const Func = {
  /**
   * 找出指定功能代碼的功能資訊。
   * @param {*} funcCode 功能代碼
   * @returns 功能資訊
   */
  find: (funcCode) => Object.entries(Func)
    .map((f) => f[1])
    .find((f) => (f.id === funcCode)),

  A00300: {
    id: 'A003',
    required: [],
  }, // 登入頁面 - 登入首頁
  A00400: {
    id: 'A004',
    required: [],
  }, // 登入頁面 - 開通APP
  A00600: {
    id: 'A006',
    required: [],
  }, // 登入頁面 - 定期更新個資 (六個月)
  A00700: {
    id: 'A007',
    authCode: 0x28,
    required: [],
  }, // 登入頁面 - 定期更新密碼 (一年)
  A00800: {
    id: 'A008',
    authCode: 0x01,
    required: [],
  }, // 訪客註冊
  B00100: {
    id: 'B001',
    required: [],
  }, // 首頁 - 首頁 (彩卡/優惠Banner)
  B00200: {
    id: 'B002',
    required: [],
  }, // 分享? TODO: 確認功能中文名稱
  B00300: {
    id: 'B003',
    required: [],
  }, // 快捷列_通知 - 訊息總覽
  B00500: {
    id: 'B005',
    required: [],
  }, // 首頁 - 優惠
  B00600: {
    id: 'B006',
    required: [],
  }, // 首頁 - 更多
  C00100: {
    id: 'C001',
    required: [],
  }, // 更多_帳戶服務 - 帳戶總覽頁
  C00200: {
    id: 'C002',
    required: [],
  }, // 更多_帳戶服務 - 社群帳本
  C00300: {
    id: 'C003',
    required: ['M'],
  }, // 更多_帳戶服務 - 臺幣活存 (存款卡(台)首頁)
  C00400: {
    id: 'C004',
    required: ['F'],
  }, // 更多_帳戶服務 - 外幣活存 (存款卡(外)首頁)
  C00500: {
    id: 'C005',
    required: ['S'],
  }, // 更多_帳戶服務 - 證券交割戶 (證券交割戶首頁)
  C00600: {
    id: 'C006',
    authCode: 0x20,
    required: ['M'],
  }, // 更多_帳戶服務 - 存錢計畫
  C00700: {
    id: 'C007',
    required: [],
  }, // 首頁 - 信用卡首頁 (含社群圈分潤)
  C00800: {
    id: 'C008',
    required: ['M', 'S'],
  }, // 更多_帳戶服務 - 匯出存摺
  C00900: {
    id: 'C009',
    authCode: 0x30,
    required: [],
  }, // 更多_帳戶服務 - 臺幣定存
  C01000: {
    id: 'C010',
    authCode: 0x30,
    required: [],
  }, // 更多_帳戶服務 - 外幣定存
  D00100_臺幣轉帳: {
    id: 'D001',
    authCode: {
      NONREG: 0x20, // 臺幣-非約轉帳
      REG: 0x30, // 臺幣-約定轉帳
    },
    required: ['M', 'S'],
  }, // 更多_轉帳提款 - 臺幣轉帳
  D00200: {
    id: 'D002',
    required: ['M', 'S'],
  }, // 更多_轉帳提款 - QR CODE轉帳
  D00300_無卡提款: {
    id: 'D003',
    authCode: 0x20,
    required: ['M'],
  }, // 更多_轉帳提款 - 無卡提款
  D00400: {
    id: 'D004',
    authCode: 0x20,
    required: ['M'],
  }, // 更多_轉帳提款 - 變更無卡提款密碼
  D00500: {
    id: 'D005',
    required: ['M', 'F', 'S'],
  }, // 更多_轉帳提款 - 常用帳號管理
  D00600: {
    id: 'D006',
    required: ['M', 'F', 'S'],
  }, // 更多_轉帳提款 - 約定帳號管理
  D00700: {
    id: 'D007',
    authCode: 0x30,
    required: ['F'],
  }, // 更多_轉帳提款 - 外幣轉帳_本行同幣別外幣轉帳流程
  D00800: {
    id: 'D008',
    authCode: 0x30,
    required: ['M', 'S'],
  }, // 更多_轉帳提款 - 預約轉帳查詢/取消
  D00900: {
    id: 'D009',
    required: [],
  }, // 更多_轉帳提款 - 境外快速匯款 Phase II
  E00100_換匯: {
    id: 'E001',
    authCode: {
      TWD_F: 0x30, // 換匯-台換外
      F_TWD: 0x30, // 換匯-外換台
    },
    required: ['M', 'F'],
  }, // 更多_投資理財 - 換匯
  E00200: {
    id: 'E002',
    required: [],
  }, // 更多_投資理財 - 匯率 (含在換匯裡的功能，另外拉出一個獨立入口)
  E00300: {
    id: 'E003',
    required: [],
  }, // 更多_投資理財 - 金融百貨
  F00100: {
    id: 'F001',
    required: [],
    hidden: 'M',
  }, // 更多_申請 - 申請臺幣數存
  F00200: {
    id: 'F002',
    required: [],
    hidden: 'S',
  }, // 更多_申請 - 申請證券交割戶
  F00300: {
    id: 'F003',
    required: [],
    hidden: 'F',
  }, // 更多_申請 - 申請外幣數存
  F00400: {
    id: 'F004',
    required: [],
    hidden: 'L',
  }, // 更多_申請 - 申請貸款
  F00500: {
    id: 'F005',
    required: [],
    hidden: 'CC',
  }, // 更多_申請 - 申請信用卡
  L00100: {
    id: 'L001',
    required: ['L'],
  }, // 更多_貸款 - 我的貸款 (原名：繳款紀錄)
  L00200: {
    id: 'L002',
    required: ['L'],
  }, // 更多_貸款 - 應繳查詢 (原名：應繳本息明細)
  L00300: {
    id: 'L003',
    required: [],
  }, // (入口：我的貸款) - 繳款紀錄
  M00100: {
    id: 'M001',
    required: [],
  }, // 更多_社群圈 - 社群圈 (社群圈首頁) 含 推薦碼分享
  M00200: {
    id: 'M002',
    required: [],
  }, // 更多_社群圈 - 好友查詢
  M00300: {
    id: 'M003',
    required: [],
  }, // ? TODO: 確認功能中文名稱
  N00200: {
    id: 'N002',
    required: [],
  }, // ? TODO: 確認功能中文名稱
  R00100: {
    id: 'R001',
    required: ['CC'],
  }, // 更多_信用卡 - 即時消費明細
  R00200: {
    id: 'R002',
    authCode: 0x30,
    required: ['CC'],
  }, // (入口：信用卡首頁) - 晚點付 (原名：分期)
  R00300: {
    id: 'R003',
    required: ['CC'],
  }, // 更多_信用卡 - 帳單明細
  R00400: {
    id: 'R004',
    authCode: 0x30,
    required: ['CC'],
  }, // 更多_信用卡 - 繳費
  R00500: {
    id: 'R005',
    authCode: 0x30,
    required: ['CC'],
  }, // 更多_信用卡 - 自動扣繳申請/查詢
  R00600: {
    id: 'R006',
    authCode: 0x30,
    required: [],
  }, // 更多_信用卡 - 額度臨調 Phase II
  S00100_我的最愛: {
    id: 'S001',
    required: [],
  }, // 更多_金融助手 - 我的最愛設定
  S00101_我的最愛v2: {
    id: 'S001',
    required: [],
  }, // 更多_金融助手 - 我的最愛設定
  S00200: {
    id: 'S002',
    required: [],
  }, // 更多_金融助手 - 約定本人帳號設定
  S00300: {
    id: 'S003',
    required: [],
  }, // 更多_金融助手 - 視訊約定帳號設定
  S00400: {
    id: 'S004',
    authCode: 0x30,
    required: [],
  }, // 更多_金融助手 - 訊息通知設定
  S00500: {
    id: 'S005',
    required: [],
  }, // 更多_金融助手 - 他行存款自動存入設定
  S00600: {
    id: 'S006',
    required: [],
  }, // 更多_金融助手 - 常見問題
  S00700: {
    id: 'S007',
    authCode: 0x20,
    required: ['M'],
  }, // 更多_金融助手 - 金融卡啟用
  S00800: {
    id: 'S008',
    authCode: 0x28,
    required: ['M'],
  }, // 更多_金融助手 - 金融卡掛失補發
  S00900: {
    id: 'S009',
    required: [],
  }, // 更多_金融助手 - 數存會員升級(超商驗證)
  T00100: {
    id: 'T001',
    required: [],
  }, // 更多_金融助手 - 個人化設定
  T00200: {
    id: 'T002',
    authCode: {
      SET: 0x11, // 生物辨識/圖形-設定
      MODIFY: 0x20, // 圖形-修改
      UNSET: 0x20, // 生物辨識/圖形-解除
    },
    required: [],
  }, // 更多_金融助手_個人化設定 - 快速登入設定
  T00300: {
    id: 'T003',
    authCode: {
      APPLY: 0x20, // 非約轉設定-申請
      EDIT: 0x21, // 非約轉設定-手機號碼修改
      CLOSE: 0x20, // 非約轉設定-關閉
    },
    required: ['M', 'S'],
  }, // 更多_金融助手_個人化設定 - 非約定轉帳設定
  T00400: {
    id: 'T004',
    authCode: 0x20,
    required: ['M'],
  }, // 更多_金融助手_個人化設定 - 無卡提款設定
  T00500: {
    id: 'T005',
    required: [],
  }, // 更多_金融助手_個人化設定 - 行動金融憑證設定
  T00600: {
    id: 'T006',
    authCode: 0x23,
    required: [],
  }, // 更多_金融助手 - 手機號碼收款設定
  T00700: {
    id: 'T007',
    authCode: {
      MOBILE: 0x31, // 基本資料變更-通訊門號
      EMAIL: 0x28, // 基本資料變更-電子郵件
      ADDRESS: 0x28, // 基本資料變更-通訊地址
    },
    required: [],
  }, // 更多_金融助手_個人化設定 - 基本資料變更
  T00800: {
    id: 'T008',
    authCode: 0x28,
    required: [],
  }, // 更多_金融助手_個人化設定 - 使用者代號變更
  T00900: {
    id: 'T009',
    authCode: 0x28,
    required: [],
  }, // 更多_金融助手_個人化設定 - 網銀密碼變更
  Z99997: {
    id: 'Z99997',
    required: [],
  }, // 更多_金融助手_個人化設定 - 搖一搖功能設定
};
