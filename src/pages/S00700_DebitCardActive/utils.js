import { SuccessDescWrapper } from './S00700.style';

export const successDesc = () => (
  <SuccessDescWrapper>
    <div className="success_title">
      <h3>
        預設密碼：
      </h3>
      <div>民國出生年月日後6位數字</div>
    </div>
    <div className="success_detail">
      您的金融卡已啟用成功!
      <br />
      為保障您的交易安全，請您盡速於全台任一ATM或Web ATM進行密碼變更。
    </div>

  </SuccessDescWrapper>
);
