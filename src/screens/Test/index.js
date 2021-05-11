import { useState } from 'react';
import FEIBField from 'components/FEIBField/FEIBField';
import FEIBInput from 'components/FEIBInput/FEIBInput';
import FEIBSelect from 'components/FEIBSelect/FEIBSelect';
import FEIBButton from 'components/FEIBButton/FEIBButton';

/* Elements */
import {
  Input,
  InputLabel,
  InputAnimationWrapper,
  Select,
  Option,
  Button,
  BorderButton,
} from 'components/elements';

/* Global themes */
import theme from 'themes/theme';

/* Page themes */
import TestWrapper from './test.style';

const Test = () => {
  const animalsList = [
    { id: 0, value: 0, label: 'Dog' },
    { id: 1, value: 1, label: 'Tiger' },
    { id: 2, value: 2, label: 'Bear' },
  ];
  const [animal, setAnimal] = useState('Cat');
  const buttonEvent = (data) => {
    alert(`Button clicked! ${data}`);
  };
  const handleInputEvent = (event) => {
    setAnimal(event.target.value);
  };

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
          <InputLabel $color={theme.colors.primary.dark}>身分證字號</InputLabel>
          <Input
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
          <InputLabel $color={theme.colors.primary.dark}>使用者代號</InputLabel>
          <Input
            id="myInputUsername"
            name="username"
            value={inputValues.username}
            onChange={handleChangeInput}
            $color={theme.colors.primary.dark}
            $borderColor={theme.colors.primary.brand}
          />
        </div>
        <div>
          <Select
            defaultValue="aaa"
            // $fontSize={2}
            $color={theme.colors.primary.dark}
            $borderColor={theme.colors.primary.brand}
            // $focusBorderColor={theme.colors.state.danger}
            // $bottomSpace={false}
          >
            <Option value="aaa">AAA</Option>
            <Option value="bbb">BBB</Option>
          </Select>
        </div>

        <div className="buttons">
          <Button
            // $width={24}
            // $fontSize={1.6}
            $color={theme.colors.basic.white}
            $bgColor={theme.colors.primary.brand}
            $hoverBgColor={theme.colors.primary.dark}
          >
            確認
          </Button>
          <BorderButton
            // $width={26}
            $borderColor={theme.colors.primary.brand}
            $color={theme.colors.primary.dark}
          >
            取消
          </BorderButton>
        </div>
      </section>

      <section>
        <h2>With Animation Wrapper</h2>
        <div>
          <InputAnimationWrapper>
            <InputLabel $color={theme.colors.primary.dark}>身分證字號</InputLabel>
            <Input
              id="myInputIdAnimation"
              name="idAnimation"
              value={inputValues.idAnimation}
              onChange={handleChangeInput}
              $color={theme.colors.primary.dark}
              $borderColor={theme.colors.primary.brand}
            />
          </InputAnimationWrapper>
        </div>
        <div>
          <InputAnimationWrapper>
            <InputLabel $color={theme.colors.primary.dark}>使用者代號</InputLabel>
            <Input
              id="myInputUsernameAnimation"
              name="usernameAnimation"
              value={inputValues.usernameAnimation}
              onChange={handleChangeInput}
              $color={theme.colors.primary.dark}
              $borderColor={theme.colors.primary.brand}
            />
          </InputAnimationWrapper>
        </div>
      </section>

      <section>
        <h2>唯物提供之組件</h2>
        <FEIBField>
          <FEIBInput
            type="text"
            label="This is a input field"
            id="content"
            name="content"
            value={animal}
            placeholder="write something here"
            event={handleInputEvent}
          />
        </FEIBField>
        <FEIBField>
          <FEIBSelect
            label="Animal select"
            id="animal"
            name="animal"
            options={animalsList}
          />
        </FEIBField>
        <FEIBField>
          {/* eslint-disable-next-line react/jsx-no-bind */}
          <FEIBButton event={buttonEvent.bind(null, 'To be or not to be.')}>
            確認
          </FEIBButton>
        </FEIBField>
        <div>
          { animal }
        </div>
      </section>
    </TestWrapper>
  );
};

export default Test;
