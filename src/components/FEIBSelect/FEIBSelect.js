import './FEIBSelect.scss'

const FEIBSelect = ({ label, id, name, value, options }) => {
  return (
    <div className="FEIBSelect">
      <label for={id}>{label}</label>
      <select id={id} name={name} value={value}>
        {options.map((option) => {
          return (
            <option key={option.id} id={option.id} value={option.value}>
              {option.label}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default FEIBSelect;
