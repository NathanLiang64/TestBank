import { FEIBInput, FEIBInputLabel } from 'components/elements';
import ConfirmButtons from 'components/ConfirmButtons';
// import Accordion from 'components/Accordion';

/* style */
import { DrawerContentWrapper } from './T00200.style';

const DrawerContent = ({
  confirmClick,
  cancelClick,
  midPhone,
}) => (
  // TODO: #1037 條款外開PDF檔案，後續再來看是否可以藉接文檔系統
  <DrawerContentWrapper>
    <FEIBInputLabel>請確認您目前設定之手機門號，與您使用之SIM卡門號一致。</FEIBInputLabel>
    <FEIBInput value={midPhone} disabled />
    <div className="agreeWording">
      <p>
        本服務係透過臺灣網路認證股份有限公司提供之裝置確認服務(SIM卡認證)，並將與您的電信公司確認您的手機門號與SIM卡門號是否一致，若否則請至本行更新手機號碼，以完成APP裝置認證，點選確認即閱讀並同意
        <a href="https://drive.google.com/file/d/19EZcLREu79ScFvcoZLSbKSmDDqI1UfP3/view?usp=sharing" target="_blank" rel="noreferrer">利用行動電話號碼辦理身分驗證服務條款</a>
        。
      </p>
      <p>
        為保障您的交易安全，將為您進行裝置認證，以啟用快速登入，點選確認即閱讀並同意
        <a href="https://drive.google.com/file/d/1z-x5wk_GZVUX0o81ifVuYWfV_Mn67Mhe/view?usp=sharing" target="_blank" rel="noreferrer">快速登入設定條款</a>
      </p>
    </div>
    <ConfirmButtons
      mainButtonValue="確認"
      mainButtonOnClick={confirmClick}
      subButtonValue="取消"
      subButtonOnClick={cancelClick}
    />
  </DrawerContentWrapper>
);

export default DrawerContent;
