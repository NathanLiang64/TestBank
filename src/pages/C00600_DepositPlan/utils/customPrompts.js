import { showCustomPrompt } from 'utilities/MessageModal';

export const showNoMainAccountAlert = ({ onDismiss }) => {
  showCustomPrompt({
    title: '新增存錢計畫',
    message: '您尚未持有Bankee存款帳戶',
    onOk: onDismiss,
    okContent: '現在就來申請吧!',
  });
};

export const showUnavaliableSubAccountAlert = ({ onDismiss }) => {
  showCustomPrompt({
    title: '新增存錢計畫',
    message: '目前沒有可作為綁定存錢計畫之子帳戶，請先關閉帳本後，或先完成已進行中的存錢計畫。',
    onOk: onDismiss,
    okContent: '了解',
  });
};

export const showNonZeroBalanceAlert = ({ onDismiss }) => {
  showCustomPrompt({
    title: '新增存錢計畫',
    message: '欲作為存錢計劃之子帳戶餘額須為0，請先將子帳戶內餘額清除。',
    onOk: onDismiss,
    okContent: '了解',
  });
};
