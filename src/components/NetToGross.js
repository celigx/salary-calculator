const NetToGross = ({ formatNumber, amount, grossSalary }) => {
  return (
    <div className="outputContainer">
      <div className="grossContainer">
        <h4>Bruto plaća:</h4>
        <h2 className="gross">{formatNumber(grossSalary())}</h2>
      </div>
      <div className="netContainer">
        <h4>Neto plaća:</h4>
        <h2 className="net">{formatNumber(amount)}</h2>
      </div>
    </div>
  )
}

export default NetToGross; 