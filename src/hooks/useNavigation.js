/* eslint-disable no-unused-vars */
import { useHistory } from 'react-router';
import { callAppJavaScript, funcStack } from 'utilities/AppScriptProxy';
import { showError } from 'utilities/MessageModal';

export const useNavigation = () => {
  const history = useHistory();
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

    funcID = funcID.replace(/^\/*/, ''); // 移掉前置的 '/' 符號,
    const data = {
      funcID,
      funcParams: funcParams ? JSON.stringify(funcParams) : null, // 要先轉 JSON 字串是為了配合 APP JavaScript
      keepData: keepData ? JSON.stringify(keepData) : null, // 要先轉 JSON 字串是為了配合 APP JavaScript
    };
    funcStack.push(data);

    // 只要不是 A00100 這種格式的頁面，一律視為 WebPage 而不透過 APP 的 Function Controller 轉導。
    const isFunction = /^[A-Z]\d{5}$/.test(funcID);
    if (isFunction) {
      await callAppJavaScript('startFunc', data, false, () => {
        history.push(`/${funcID}`);
      });
    } else {
      history.push(`/${funcID}`);
    }
  };

  /**
   * 觸發APP返回上一頁功能，並將指定的資料透過 loadFuncParams() 傳回給啟動目前功能的單元功能。
   * @param {*} response 傳回值，會暫存在 SessionStorate("funcResp") 中。
   */
  const closeFunc = async (response) => {
    // 將要傳回給前一功能（啟動目前功能的單元功能）的資料 存入 sessionStorage[funcResp]
    // 再由 loadFuncParams() 取出，放在啟動參數的 response 參數中。
    if (response && !response.target && !response.type) {
      // NOTE event物件會被誤判為傳回值，所以必需排除。
      sessionStorage.setItem('funcResp', JSON.stringify(response));
    }

    const closeItem = funcStack.peek(); // 因為 funcStack 還沒 pop，所以用 peek 還以取得正在執行中的 單元功能(例：A00100) 或是 頁面(例：moreTransactions)
    const isFunction = !closeItem || /^[A-Z]\d{5}$/.test(closeItem.funcID); // 表示 funcID 是由 Function Controller 控制的單元功能。

    const startItem = funcStack.pop();
    const webCloseFunc = async () => {
      // 當 funcStack.pop 不出項目時，表示可能是由 APP 先啟動了某項功能（例：首頁卡片或是下方MenuBar）
      if (startItem) {
        // 表示返回由 WebView 啟動的單元功能或頁面，例：從「更多」啟動了某項單元功能，當此單元功能關閉時，就會進到這裡。
        history.push(`/${startItem.funcID}`);
      } else {
        // 若是在登入前，無前一頁可以返回時，則一律回到 Login 頁。
        if (sessionStorage.getItem('isLogin') !== '1') {
          history.push('/login');
          return;
        }

        // 雖然 Web端的 funcStack 已經空了，但有可能要返回的功能是由 APP 啟動的；所以，要先詢問 APP 是否有正在執行中的單元功能。
        const appJsRs = await callAppJavaScript('getActiveFuncID', null, true); // 取得 APP 目前的 FuncID
        if (appJsRs) {
          // 例：首頁卡片 啟動 存錢計劃，當 存錢計劃 選擇返回前一功能時，就會進到這裡。（因為此時的 funcStack 是空的）
          history.push(`/${appJsRs.funcID}`);
        } else { history.push('/'); }
      }
    };

    if (isFunction) {
      await callAppJavaScript('closeFunc', null, false, webCloseFunc);
    } else {
      await webCloseFunc();
    }
  };

  const goHome = async () => {
    funcStack.clear();
    await callAppJavaScript('goHome', null, false, () => {
      startFunc('/');
    });
  };

  return {startFunc, closeFunc, goHome};
};
