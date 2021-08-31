const NetToGross = ({ formatNumber, grossSalary, net }) => {
  return (
    <div className="outputContainer">
      <div className="grossContainer">
        <h4>Bruto plaća:</h4>
        <h2 className="gross">{formatNumber(grossSalary(net))}</h2>
      </div>
      <div className="netContainer">
        <h4>Neto plaća:</h4>
        <h2 className="net">{formatNumber(net)}</h2>
      </div>
    </div>
  )
}

export default NetToGross; 