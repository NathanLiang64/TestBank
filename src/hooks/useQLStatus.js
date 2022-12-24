import { useEffect, useState } from 'react';
import { getQLStatus, startFunc } from 'utilities/AppScriptProxy';
import { FuncID } from 'utilities/FuncID';
import { showCustomPrompt } from 'utilities/MessageModal';

export const useQLStatus = () => {
  const [QLResult, setQLResult] = useState(true);

  useEffect(async () => {
    const { QLStatus } = await getQLStatus();
    setQLResult(QLStatus === '2' || QLStatus === '1');
  }, []);

  const showUnbondedMsg = () => {
    showCustomPrompt({
      message: '無裝置認證，請先進行「APP裝置認證(快速登入設定)」，或致電客服。',
      okContent: '立即設定',
      onOk: () => startFunc(FuncID.T00200),
      onCancel: () => {},

    });
  };

  return { QLResult, showUnbondedMsg };
};
