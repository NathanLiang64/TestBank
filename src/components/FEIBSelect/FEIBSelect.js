import './FEIBSelect.scss';

const FEIBSelect = ({
  label,
  id,
  name,
  value,
  options,
}) => (
  <div className="FEIBSelect">
    <label htmlFor={id}>{label}</label>
    <select id={id} name={name} value={value}>
      {
        options.map((option) => (
          <option key={option.id} id={option.id} value={option.value}>
            {option.label}
          </option>
        ))
      }
    </select>
  </div>
);

export default FEIBSelect;
