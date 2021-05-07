import "./FEIBInput.scss";

const FEIBInput = ({ type, id, name, label, placeholder, inputMode, value, event }) => {
  return (
    <div className="FEIBInput">
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        placeholder={placeholder}
        inputMode={inputMode}
        onChange={event}
      />
    </div>
  );
};

export default FEIBInput;
