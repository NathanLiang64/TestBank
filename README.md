# APP2_WebView

- [項目規劃 | Miro](https://miro.com/app/board/o9J_laeZLto=/)
- [執行計畫 - 五月執行計畫 | Google Sheets](https://docs.google.com/spreadsheets/d/1cTYmOp07_f6_CwY3X05aFmljbC-mBkLQIU-WAJni-f0/edit#gid=288572326)
- [系統分析書 | Axure](https://wi87pn.axshare.com/)
- API | Swagger UI
- 設計稿 | Figma

---

## 進行中
- 無卡提款 - 唯物
- QRCode 轉帳 (QRCodeTransfer) - 聖森
- 存款優惠利率額度 (DepositPlus) - 聖森 (待提供設計稿)
- 常用帳號列表 (AccountMaintenance) - 聖森 (暫不需實作)
- 元件封裝 - 唯物 & 聖森

---

## 已完成
- 功能
  - E2EE 加密 - 聖森
  - 存款卡首頁 (DepositOverview) - 聖森
  - 圖形密碼登入設定 (PatternLockSetting) - 聖森
  - 信用卡繳費 (BillPay) - 聖森
  - 金融卡掛失補發 (LossReissue) - 聖森
  - JWE & JWT 加密 - 聖森
  - 登入頁 (Login) - 聖森
  

- 元件封裝
  - FEIBInput - 聖森
  - FEIBInputLabel - 聖森
  - FEIBInputAnimationWrapper - 聖森
  - FEIBSelect - 聖森
  - FEIBOption - 聖森
  - FEIBButton - 聖森
  - FEIBIconButton - 聖森
  - FEIBLinkButton - 聖森
  - FEIBBorderButton - 聖森
  - FEIBTextarea - 唯物
  - FEIBCheckbox - 聖森
  - FEIBCheckboxLabel - 聖森
  - FEIBRadio - 聖森
  - FEIBRadioLabel - 聖森
  - FEIBSwitch - 唯物
  - FEIBSwitchLabel - 唯物
  - FEIBCollapse - 唯物
  - FEIBTabContext - 唯物
  - FEIBTabList - 唯物
  - FEIBTab - 唯物
  - FEIBTabPanel - 唯物


- 組件封裝
  - ConfirmButtons - 聖森
  - Dialog - 聖森
  - BottomDrawer - 聖森
  - Layout - 聖森
  - Alert - 聖森
  - NoticeArea - 聖森
  - Header - 聖森
  - DebitCard - 聖森
  - DetailCard - 聖森

---

## 目錄結構說明
```
App2_WebView
|-- __json_server_mock__  (mock api)
|   |-- db.json
|   |-- routes.json(
|
|-- public/
|   |-- favicon.ico
|   |-- index.html
|   |-- logo.png
|
|-- src/
|   |-- apis/
|   |   |-- axiosConfig.js  (axios 設定文件)
|   |   |-- headerApi.js  (某功能內的所有 Api)
|   |   |-- index.js  (該 apis 入口文件)
|   |   |-- ### call api 相關方法放置此處 ###
|   |
|   |-- assets/
|   |   |-- images/
|   |   |   |-- logo.png
|   |   |   |-- ### 圖片放置此處 ###
|   |   |   
|   |   |-- ### 其它資源，如 fonts/, files/ 等放置此處 ###
|   |
|   |-- components/
|   |   |-- elements/
|   |   |   |-- _defaultElements/
|   |   |   |   |-- FEIBdefaultButton.js
|   |   |   |   |-- ### 需被其它元件繼承的基礎元件放置此處 ###
|   |   |   |
|   |   |   |-- FEIBBtton.js
|   |   |   |-- FEIBInput.js
|   |   |   |-- ### 封裝後的 JSX 元件放置此處 ###
|   |   |
|   |   |-- ### 共用的 components 放置此處 ###
|   |
|   |-- hooks/
|   |   |-- ### Custom hooks 放置此處，如 useWatch.js 等 ### 
|   |
|   |-- pages/
|   |   |-- Login/
|   |   |   |-- stores/  (個別頁面內的 redux 狀態管理)
|   |   |   |   |-- actions.js
|   |   |   |   |-- index.js  (該 stores 入口文件)
|   |   |   |   |-- reducers.js
|   |   |   |   |-- types.js
|   |   |   |   |-- ### 個別頁面內的 redux 相關方法放置此處 ###
|   |   |   |
|   |   |   |-- index.js  (該頁面入口文件)
|   |   |   |-- login.style.js  (該頁面樣式文件)
|   |   |
|   |   |-- Test/  (用來測試封裝元件的頁面)
|   |   |   |-- index.js  (該頁面入口文件)
|   |   |
|   |   |--- ### 頁面放置此處 ###
|   |   
|   |-- stores/  (管理整個 app 的 redux 設定)
|   |   |-- reducers/
|   |   |   |-- index.js  (綁定各個頁面的 reducer 文件)
|   |   |
|   |   |-- index.js  (整個 app 的 redux 設定文件)
|   |
|   |-- themes/
|   |   |-- globalStyles.js  (全域樣式設定文件)
|   |   |-- theme.js  (樣式變數文件)
|   |   |-- ### 管理整個 app 樣式相關模組放置此處 ###
|   |
|   |-- utilities/
|   |   |-- ### 通用的其它文件或模組放置此處，如 JWE 等 ###
|   |
|   |-- App.js
|   |-- index.js
|   |-- routes.js  (路由設定文件)
|
|-- .env  (產品上線時的環境設定文件)
|-- .env.development  (開發模式時的環境設定文件)
|-- .eslintrc  (Eslint 設定文件)
|-- .gitignore
|-- jsconfig.json
|-- package.json
|-- package-lock.json
|-- README.md
```

---

## 封裝元件說明
#### /src/components/elements/*.js
- 檔名與組件名需加上 `FEIB` 前綴，如封裝後的 `input` 元件應為 `FEIBInput`
- 封裝元件的可用選項需以 `$` 前綴開頭，如 `fontSize` 非 JSX 預先提供之屬性，應定義為 `$fontSize`
- 封裝元件的可用選項需在該文件內部寫上使用方式註解
  
若有新增或更動元件需更新至 Git `components` 分支上，一律由此分支管理元件。

---

## 樣式變數說明
#### /src/themes/theme.js
- `font` 為字體變數
- `colors` 為顏色物件，底下可再細分多個分類，如 primary 主色、secondary 輔色等
- `filters` 為濾淨特效物件
- `transition` 為動畫樣式變數

關於樣式變數底下是否能再有其它變數無硬性規定，假設未來開發時需使用多組字體，可再將 `font` 變數改為 `fonts` 物件。

---

## Git 分支說明
- `master` - 主分支
- `components` - 封裝元件
- `vjinc` - 唯物主分支
- `SS_master` - 聖森主分支
- `SS_Adrian` - 聖森前端開發人員 Adrian
- `SS_Archie` - 聖森前端開發人員 Archie
- `vjinc_Benny` - 唯物前端開發人員 Benny

---

## 功能模組(Function_code) 資料夾命名規則
pages 資料夾底下為功能模組(Function_code)，資料夾命名方式依照1.0的功能模組下去命名。
如果今天 相同 Function_code 增加一個版本則以 {Function_code}_v2。
```

{Function_code}/
|-- stores/  (個別頁面內的 redux 狀態管理)
|   |   |-- actions.js (改變狀態動作)
|   |   |-- index.js  (該 stores 入口文件)
|   |   |-- reducers.js 
|   |   |-- types.js (定義常數)
|   |-- ### 個別頁面內的 redux 相關方法放置此處 ###
|   |-- xxxxx_2.js  (頁面數量2)
|   |-- xxxxx_3.js  (頁面數量3)
|   |-- xxxxx_4.js  (頁面數量4)
|   |-- index.js  (該頁面入口文件)
|   |-- {Function_code}.style.js  (該頁面樣式文件)

---
```
