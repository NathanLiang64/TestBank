import { useState } from 'react';
import FEIBField from 'components/FEIBField/FEIBField';
import FEIBInput from 'components/FEIBInput/FEIBInput';
import FEIBSelect from 'components/FEIBSelect/FEIBSelect';
import FEIBButton from 'components/FEIBButton/FEIBButton';

/* Elements */
import {
  Input,
  InputLabel,
  Select,
  Option,
} from 'components/elements';

/* Global themes */
import theme from 'themes/theme';

const Test = () => {
  const animalsList = [
    { id: 0, value: 0, label: 'Dog' },
    { id: 1, value: 1, label: 'Tiger' },
    { id: 2, value: 2, label: 'Bear' },
  ];

  const [inputValue, setInputValue] = useState('');
  const handleChangeInput = (event) => {
    setInputValue(event.target.value);
  };

  const [animal, setAnimal] = useState('Cat');
  const buttonEvent = (data) => {
    alert(`Button clicked! ${data}`);
  };
  const handleInputEvent = (event) => {
    setAnimal(event.target.value);
  };

  return (
    <div style={{ margin: '0 auto', width: '500px' }}>
      <InputLabel $color={theme.colors.primary.dark}>身分證字號 / 手機</InputLabel>

      <Input
        id="myInputId"
        name="myInputName"
        value={inputValue}
        onChange={handleChangeInput}
        // $fontSize={2}
        $color={theme.colors.primary.dark}
        $borderColor={theme.colors.primary.brand}
        $focusBorderColor={theme.colors.state.danger}
      />

      <Select
        defaultValue="aaa"
        $fontSize={2}
        $color={theme.colors.primary.dark}
        $borderColor={theme.colors.primary.brand}
        $focusBorderColor={theme.colors.state.danger}
      >
        <Option value="aaa">AAA</Option>
        <Option value="bbb">BBB</Option>
      </Select>

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
    </div>
  );
};

export default Test;
