import './FEIBButton.scss'

const FEIBButton = ({children, event}) => {
  return (
    <div className="FEIBButton">
      <button onClick={event}>{ children }</button>
    </div>
  )
}

export default FEIBButton
