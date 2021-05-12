import { useState } from 'react';

/* Elements */
import {
  FEIBInput,
  FEIBInputLabel,
  FEIBInputAnimationWrapper,
  FEIBSelect,
  FEIBOption,
  FEIBButton,
  FEIBBorderButton,
} from 'components/elements';

/* Global themes */
import theme from 'themes/theme';

/* Page themes */
import TestWrapper from './test.style';

const Test = () => {
  const [inputValues, setInputValues] = useState({
    id: '',
    username: '',
    idAnimation: '',
    usernameAnimation: '',
  });
  const handleChangeInput = (event) => {
    setInputValues({ ...inputValues, [event.target.name]: event.target.value });
  };

  return (
    <TestWrapper>

      <section>
        <h2>Without Animation Wrapper</h2>
        <div>
          <FEIBInputLabel $color={theme.colors.primary.dark}>身分證字號</FEIBInputLabel>
          <FEIBInput
            id="myInputId"
            name="id"
            value={inputValues.id}
            onChange={handleChangeInput}
            $color={theme.colors.primary.dark}
            $borderColor={theme.colors.primary.brand}
            // $focusBorderColor={theme.colors.state.danger}
          />
        </div>
        <div>
          <FEIBInputLabel $color={theme.colors.primary.dark}>使用者代號</FEIBInputLabel>
          <FEIBInput
            id="myInputUsername"
            name="username"
            value={inputValues.username}
            onChange={handleChangeInput}
            $color={theme.colors.primary.dark}
            $borderColor={theme.colors.primary.brand}
          />
        </div>
        <div>
          <FEIBSelect
            defaultValue="aaa"
            // $fontSize={2}
            $color={theme.colors.primary.dark}
            $borderColor={theme.colors.primary.brand}
            // $focusBorderColor={theme.colors.state.danger}
            // $bottomSpace={false}
          >
            <FEIBOption value="aaa">AAA</FEIBOption>
            <FEIBOption value="bbb">BBB</FEIBOption>
          </FEIBSelect>
        </div>

        <div className="buttons">
          <FEIBButton
            // $width={24}
            // $fontSize={1.6}
            $color={theme.colors.basic.white}
            $bgColor={theme.colors.primary.brand}
            $hoverBgColor={theme.colors.primary.dark}
          >
            確認
          </FEIBButton>
          <FEIBBorderButton
            // $width={26}
            $borderColor={theme.colors.primary.brand}
            $color={theme.colors.primary.dark}
          >
            取消
          </FEIBBorderButton>
        </div>
      </section>

      <section>
        <h2>With Animation Wrapper</h2>
        <div>
          <FEIBInputAnimationWrapper>
            <FEIBInputLabel $color={theme.colors.primary.dark}>身分證字號</FEIBInputLabel>
            <FEIBInput
              id="myInputIdAnimation"
              name="idAnimation"
              value={inputValues.idAnimation}
              onChange={handleChangeInput}
              $color={theme.colors.primary.dark}
              $borderColor={theme.colors.primary.brand}
            />
          </FEIBInputAnimationWrapper>
        </div>
        <div>
          <FEIBInputAnimationWrapper>
            <FEIBInputLabel $color={theme.colors.primary.dark}>使用者代號</FEIBInputLabel>
            <FEIBInput
              id="myInputUsernameAnimation"
              name="usernameAnimation"
              value={inputValues.usernameAnimation}
              onChange={handleChangeInput}
              $color={theme.colors.primary.dark}
              $borderColor={theme.colors.primary.brand}
            />
          </FEIBInputAnimationWrapper>
        </div>
      </section>
    </TestWrapper>
  );
};

export default Test;
