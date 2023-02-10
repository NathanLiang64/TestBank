/* eslint-disable no-use-before-define */
/* eslint-disable object-curly-newline */
import { useHistory } from 'react-router';
import { callAppJavaScript, forceLogout, funcStack } from 'utilities/AppScriptProxy';
import { callAPI } from 'utilities/axios';
import { Func } from 'utilities/FuncID';
import { showCustomPrompt, showError } from 'utilities/MessageModal';

export const useNavigation = () => {
  const history = useHistory();

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
  const isEnterFunc = async (funcInfo) => {
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

      const prodType = requiredList.find((f) => assetTypes.includes(f));

      // 找不到，就提示詢問申請該產品。
      if (!prodType) {
        await handleShowPrompt(requiredList[0]);
        return false;
      }
    }
    return true;
  };

  /**
   * 跟 Web Function Controller 註冊目前啟動的功能，以避免因原生端直接啟動，而造成 funcStack 不一致的情況。
   * 註：若是外開則不需要註冊！
   * @param {String} funcID 目前啟動的功能代碼。
   */
  const registFunc = async (funcID) => {
    const lastFunc = funcStack.peek();
    if (lastFunc?.funcID !== funcID) {
      funcStack.push({ funcID, isFunction: true });
    }
  };

  /**
   * 網頁通知APP跳轉指定功能
   * @param {*} funcID 單元功能代碼。
   * @param {*} funcParams 提共給啟動的單元功能的參數，被啟動的單元功能是透過 loadFuncParams() 取回。
   * @param {*} keepData 當啟動的單元功能結束後，返回原功能啟動時取回的資料。
   */
  const startFunc = async (funcID, funcParams, keepData) => {
    console.log('Start Function : ', funcID, funcParams, keepData); // DEBUG
    if (!funcID) {
      await showError('此功能尚未完成！');
      return;
    }

    funcID = funcID.replace(/^\/*/, ''); // 移掉前置的 '/' 符號,

    let funcInfo;
    // 只要不是 A001 這種格式的頁面，一律視為 WebPage 而不透過 Function Controller 轉導。
    let isFunction = /^[A-Z]\d{3}$/.test(funcID);
    if (isFunction) {
      funcInfo = Object.values(Func).find((value) => value.id === funcID);
      if (!funcInfo) isFunction = false; // 若不是 Func 中定義的代碼，也視為 WebPage
    }

    // 只有外開功能，不需納入 funcStack 管理，因為外開的功能沒有 Back 回原功能的需要。
    if (!funcInfo || (!funcInfo.isOpenExternalBrowser && !funcInfo.isAppFunc)) {
      funcStack.push({
        funcID,
        funcParams,
        keepData,
        isFunction,
      });

      // 寫入 Function 啟動參數，提供單元功能在啟動後，可以透過 loadFuncParams() 取得。
      window.FuncParams = (funcParams ?? null);
    }

    if (isFunction) {
      // 檢查是否可以進入頁面
      const isEnter = await isEnterFunc(funcInfo);
      if (!isEnter) return;

      // 只有原生及外開功能需透過APP啟動，其他功能都由 Web 自行控制。
      if (funcInfo.isAppFunc || funcInfo.isOpenExternalBrowser) {
        const appJsRq = {
          funcID,
          funcParams: funcParams ? JSON.stringify(funcParams) : null,
          keepData: keepData ? JSON.stringify(keepData) : null,
        };
        const appJsRs = await callAppJavaScript('startFunc', appJsRq, true, async () => await webStartFunc(funcInfo));
        // TODO 從 appJsRs 取得 URL
        console.log('******>> startFunc 傳回值：', appJsRs); // DEBUG
      } else {
        await webStartFunc(funcInfo);
      }
    } else {
      history.push(`/${funcID}`);
    }
  };

  /**
   * 啟動 Web 單元功能。
   * @param {*} funcInfo 功能代碼等資訊。
   * @returns
   */
  const webStartFunc = async (funcInfo) => {
    const funcID = funcInfo.id;

    // DEBUG 開發時以 Browser 測試時才會用到。
    if (funcInfo.isOpenExternalBrowser) {
      let prodCode;
      switch (funcID) {
        case Func.F00100.id: prodCode = 'DEPOSIT'; break; // 申請台幣數存
        case Func.F00200.id: prodCode = 'S01a'; break; // 申請證券交割戶
        case Func.F00300.id: prodCode = 'Fa'; break; // 申請外幣數存
        case Func.F00400.id: prodCode = 'La'; break; // 申請貸款
        case Func.F00500.id: prodCode = 'Ca'; break; // 申請信用卡
        default:
          alert(`尚未支援的的外開功能代碼: ${funcID}`);
          return { result: false }; // 無效的功能代碼，不外開直接結束。
      }
      // 外開瀏覽器，要提示用戶，詢問同意後才可以進行。
      window.open(`http://localhost:3006/F00000/${prodCode}`, '_blank');
    } else {
      // 暫時用固定版本 '00', 因為目前不是透過 API 取得，所以無法得到真實的URL
      history.push(`/${funcID}00`);
    }

    return {
      result: true,
    };
  };

  /**
   * 觸發APP返回上一頁功能，並將指定的資料透過 loadFuncParams() 傳回給啟動目前功能的單元功能。
   * @param {*} response 傳回值，會暫存在 SessionStorate("funcResp") 中。
   */
  const closeFunc = async (response) => {
    // 要傳回給前個一功能（啟動這個要被關閉的功能的那個單元功能）的資料
    // 再由 loadFuncParams() 取出，放在啟動參數的 response 參數中。
    if (response?.target || response?.type) response = null; // NOTE event物件會被誤判為傳回值，所以必需排除。

    const closedItem = funcStack.pop(); // 因為 funcStack 還沒 pop，所以用 peek 還以取得正在執行中的 單元功能(例：A001) 或是 頁面(例：moreTransactions)
    if (!closedItem) return; // 不可能發生，因為這是目前執行中的功能。

    console.log(`Close Function (${closedItem.funcID})`); // DEBUG
    delete window.FuncParams;

    // 建立要返回功能的啟動參數。
    const startItem = funcStack.peek();
    if (!startItem) { // 在登入後，啟動首頁前的 A006/B001/A007/A004 就會發生這種情況
      await callAppJavaScript('closeFunc', null, false);
      if (closedItem.funcID === Func.B001.id) forceLogout(); // 只有在首頁呼叫 closeFunc 才要登出
      return;
    }
    console.log(`Restore Function (${startItem.funcID})`); // DEBUG

    // 取回啟動被關閉的功能當時，提供給 startFunc 保存的資訊。
    const params = closedItem.keepData ?? startItem.funcParams ?? null;
    window.FuncParams = {
      ...params,
      response, // 前一單元功能的 傳回值
    };

    if (startItem.isFunction) {
      const funcInfo = Func[startItem.funcID];
      // NOTE 原生的功能不會叫 Web 的 closeFunc；所以在啟動時，也不會加入 stack 中。
      // await callAppJavaScript('closeFunc', null, false, async () => await webStartFunc(funcInfo));
      await webStartFunc(funcInfo);
    } else {
      // 不是單元功能時，表示關閉的是Web端自行管理的頁面。
      history.push(`/${startItem.funcID}`);
    }
  };

  const goHome = async () => {
    funcStack.clear();
    await callAppJavaScript('goHome', null, false, () => {
      startFunc(Func.B001.id);
      funcStack.push({ funcID: Func.B001.id, isFunction: true });
    });
  };

  return {registFunc, startFunc, closeFunc, goHome};
};
