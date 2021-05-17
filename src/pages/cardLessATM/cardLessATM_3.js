import { useState } from 'react';

/* Elements */
// import theme from 'themes/theme';
import {
  FEIBBorderButton,
} from 'components/elements';
import Dialog from 'components/Dialog';

/* Styles */
import CardLessATMWrapper from './cardLessATM.style';

const CardLessATM3 = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const dialogContent = '您已取消本次交易';

  const cancleWithdrawal = () => {
    setOpenDialog(true);
  };

  const handleToggleDialog = () => {
    setOpenDialog(false);
  };

  return (
    <CardLessATMWrapper>
      <div className="account-info">
        <h1>
          設定提款成功
        </h1>
        <h1>
          剩餘提款時間 15:00
        </h1>
      </div>
      <div className="tip">
        <h1>您已完成無卡提款交易</h1>
        <h1>到任何一個ATM提領您的現金吧！</h1>
      </div>
      <div>
        Table
      </div>
      <div className="withdrawal-info">
        請您於
        <span>2021/05/27 16:18:54</span>
        前至本行或他行有提供無卡提款功能之ATM完成提款！
      </div>
      <div>
        Table
      </div>
      <div className="tip">注意事項</div>
      <FEIBBorderButton onClick={cancleWithdrawal}>取消交易</FEIBBorderButton>

      <Dialog
        isOpen={openDialog}
        onClose={() => handleToggleDialog(false)}
        content={dialogContent}
        // action={(
        //   <ConfirmButtons
        //     mainButtonOnClick={handleClickMainButton}
        //     subButtonOnClick={() => handleToggleDialog(false)}
        //   />
        // )}
      />
    </CardLessATMWrapper>
  );
};

export default CardLessATM3;
