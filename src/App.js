import "reset-css";
import "./App.scss";

import FEIBField from "components/FEIBField/FEIBField";
import FEIBButton from "components/FEIBButton/FEIBButton";
import FEIBInput from "components/FEIBInput/FEIBInput";

import { useState } from "react";
import FEIBSelect from "components/FEIBSelect/FEIBSelect";

function App() {
  const animalsList = [
    {
      id: 0,
      value: 0,
      label: "Dog",
    },
    {
      id: 1,
      value: 1,
      label: "Tiger",
    },
    {
      id: 2,
      value: 2,
      label: "Bear",
    },
  ];

  const [animal, setAnimal] = useState("Cat");

  const buttonEvent = (data) => {
    alert("Button clicked! " + data);
  };

  const handleInputEvent = (event) => {
    setAnimal(event.target.value)
  }

  return (
    <div className="App">
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
        <FEIBButton event={buttonEvent.bind(null, "To be or not to be.")}>
          確認
        </FEIBButton>
      </FEIBField>
      <div>
        { animal }
      </div>
    </div>
  );
}

export default App;
