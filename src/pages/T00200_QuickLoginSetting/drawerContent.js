import styled from 'styled-components';
import { FEIBInput, FEIBInputLabel } from 'components/elements';
import ConfirmButtons from 'components/ConfirmButtons';

const DrawerContentWrapper = styled.div`
  padding: 1rem;
  .noticeWording {
    margin-bottom: 2.4rem;
    padding: 1.6rem 1.2rem;
    border-radius: .8rem;
    background: ${({ theme }) => theme.colors.background.lighterBlue};
    color: ${({ theme }) => theme.colors.text.light};
  }

  .agreeWording {
    margin: 2.4rem 0;
    color: ${({ theme }) => theme.colors.text.dark};
  }
`;

const DrawerContent = ({
  confirmClick,
  cancelClick,
  midPhone,
}) => (
  <DrawerContentWrapper>
    <div className="noticeWording">
      為保障您的交易安全，將為您進行裝置綁定，以啟用快速登入
    </div>
    <FEIBInputLabel>請問您目前使用裝置搭配的門號？</FEIBInputLabel>
    <FEIBInput value={midPhone} disabled />
    <div className="agreeWording">
      點選確認即同意進行裝置綁定與
      <span>
        APP裝置綁定使用條款
      </span>
      ，並將與您的電信公司確認您的手機門號與 SIM 卡是否一致，若無請至本行更新手機門號，以完成裝置綁定。
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
