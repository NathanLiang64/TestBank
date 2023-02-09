/* eslint-disable object-curly-newline */
import { useHistory } from 'react-router';
import { callAppJavaScript, funcStack, getOsType, storeData } from 'utilities/AppScriptProxy';
import { callAPI } from 'utilities/axios';
import { cleanupAccount } from 'utilities/CacheData';
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
   */
  const isEnterFunc = async (funcKeyName) => {
    // 取得擁有的產品代碼清單，例：[M, F, S, C, CC, L]
    let assetTypes = sessionStorage.getItem('assetTypes');
    if (assetTypes) {
      assetTypes = assetTypes.split(',');
    } else {
      const apiRs = await callAPI('/personal/v1/getAssetTypes');
      assetTypes = apiRs.data;
      sessionStorage.setItem('assetTypes', assetTypes);
    }

    const requiredList = Func[funcKeyName].required;
    if (requiredList.length > 0) {
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
   * 網頁通知APP跳轉指定功能
   * @param {*} funcID 單元功能代碼。
   * @param {*} funcParams 提共給啟動的單元功能的參數，被啟動的單元功能是透過 loadFuncParams() 取回。
   * @param {*} keepData 當啟動的單元功能結束後，返回原功能啟動時取回的資料。
   */
  const startFunc = async (funcID, funcParams, keepData) => {
    if (!funcID) {
      await showError('此功能尚未完成！');
      return;
    }

    // 只要不是 A001 這種格式的頁面，一律視為 WebPage 而不透過 APP 的 Function Controller 轉導。
    const isFunction = /^[A-Z]\d{3}$/.test(funcID);
    funcID = funcID.replace(/^\/*/, ''); // 移掉前置的 '/' 符號,

    const data = {
      funcID,
      funcParams: funcParams ? JSON.stringify(funcParams) : null, // 要先轉 JSON 字串是為了配合 APP JavaScript
      keepData: keepData ? JSON.stringify(keepData) : null, // 要先轉 JSON 字串是為了配合 APP JavaScript
    };
    funcStack.push(data);

    // 只要不是單元功能，一律視為 WebPage 而不透過 APP 的 Function Controller 轉導。
    if (isFunction) {
      // 檢查是否可以進入頁面
      const funcKeyName = Object.keys(Func).find((key) => Func[key].id === funcID);
      const isEnter = await isEnterFunc(funcKeyName);
      if (!isEnter) return;

      const appJsRs = await callAppJavaScript('startFunc', data, true, () => {
        // 只要是 Fxxxxx 以 F 開頭的功能代碼，就是外開功能，不需納入 Function Controller 管理。
        // TODO 這是暫時的做法，因為 WebView 並不知道那些功能是需要外開，只有 APP Function Controller 才知道。
        const isOpenExternalBrowser = funcID.startsWith('F');
        if (isOpenExternalBrowser) {
          funcStack.pop(); // 外開功能，不需納入 funcStack 管理，因為新開的功能沒有 Back 回原功能的需要。
          // NOTE 重要關念！
          //      功能代碼 與 Route所定義的 URL 無直接關係，目前雖然二者看起來是一致的，但URL是在DB中定義
          //      所以在Web端模擬時，用 HardCode URL才能進行測試
          let url;
          switch (funcID) {
            case Func.F00100.id: url = 'F00000/DEPOSIT'; break; // 申請台幣數存
            case Func.F00200.id: url = 'F00000/S01a'; break; // 申請證券交割戶
            case Func.F00300.id: url = 'F00000/Fa'; break; // 申請外幣數存
            case Func.F00400.id: url = 'F00000/La'; break; // 申請貸款
            case Func.F00500.id: url = 'F00000/Ca'; break; // 申請信用卡
            default:
              alert(`無效的功能代碼: ${funcID}`);
              return { result: false }; // 無效的功能代碼，不外開直接結束。
          }
          // TODO 提示用戶要外開，詢問同意。
          window.open(`http://localhost:3006/${url}`, '_blank');
        } else history.push(`/${funcID}00`);
        return {
          result: !isOpenExternalBrowser,
        };
      });
      console.log('******>> startFunc 傳回值：', appJsRs);
    } else {
      history.push(`/${funcID}`);
    }
  };

  /**
   * 觸發APP返回上一頁功能，並將指定的資料透過 loadFuncParams() 傳回給啟動目前功能的單元功能。
   * @param {*} response 傳回值，會暫存在 SessionStorate("funcResp") 中。
   */
  const closeFunc = async (response) => {
    // 將要傳回給前一功能（啟動目前功能的單元功能）的資料 存入 APP-DD[funcResp]
    // 再由 loadFuncParams() 取出，放在啟動參數的 response 參數中。
    if (response && !response.target && !response.type) { // NOTE event物件會被誤判為傳回值，所以必需排除。
      storeData('funcResp', response);
    }

    const closeItem = funcStack.peek(); // 因為 funcStack 還沒 pop，所以用 peek 還以取得正在執行中的 單元功能(例：A00100) 或是 頁面(例：moreTransactions)
    const isFunction = !closeItem || /^[A-Z]\d{3}$/.test(closeItem.funcID); // 表示 funcID 是由 Function Controller 控制的單元功能。

    const startItem = funcStack.pop();
    const isStartItemFunction = !startItem || /^[A-Z]\d{3}$/.test(startItem.funcID);
    const webCloseFunc = async () => {
      // 當 funcStack.pop 不出項目時，表示可能是由 APP 先啟動了某項功能（例：首頁卡片或是下方MenuBar）
      if (startItem) {
        // 表示返回由 WebView 啟動的單元功能或頁面，例：從「更多」啟動了某項單元功能，當此單元功能關閉時，就會進到這裡。
        history.push(`/${startItem.funcID}${isStartItemFunction ? '00' : ''}`);
      } else {
        // 若是在登入前，無前一頁可以返回時，則一律回到 Login 頁。
        if (getOsType(true) === 3) {
          history.push('/login');
          return;
        }

        // 雖然 Web端的 funcStack 已經空了，但有可能要返回的功能是由 APP 啟動的；所以，要先詢問 APP 是否有正在執行中的單元功能。
        const appJsRs = await callAppJavaScript('getActiveFuncID', null, true); // 取得 APP 目前的 FuncID
        if (appJsRs) {
          // 例：從首頁卡片啟動[存錢計劃]，當[存錢計劃]選擇返回前一功能時，就會進到這裡。（因為此時的 funcStack 是空的）
          history.push(`/${appJsRs.funcID}`);
        } else { history.push('/'); }
      }
    };

    if (isFunction) {
      await callAppJavaScript('closeFunc', null, false, webCloseFunc);
    } else {
      // 不是單元功能時，表示關閉的是Web端自行管理的頁面。
      await webCloseFunc();
    }
  };

  const goHome = async () => {
    // NOTE 若 funcStack 內有 C003/C004/C005 的服務 (取得交易紀錄)，
    // 需要清除 redux 內 accounts 的 txnDetails，
    const arr = [Func.C00300.id, Func.C00400.id, Func.C00500.id];
    const stacks = funcStack.getStack();
    const isExisted = stacks.find((stack) => arr.includes(stack.funcID));
    if (isExisted) cleanupAccount();

    funcStack.clear();
    await callAppJavaScript('goHome', null, false, () => {
      startFunc('/');
    });
  };

  return {startFunc, closeFunc, goHome};
};
