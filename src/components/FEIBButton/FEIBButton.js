import './FEIBButton.scss';

const FEIBButton = ({ children, event }) => (
  <div className="FEIBButton">
    <button type="button" onClick={event}>{ children }</button>
  </div>
);

export default FEIBButton;
