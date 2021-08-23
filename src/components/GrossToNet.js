const GrossToNet = ({ formatNumber, amount, netSalary }) => {
  return(
    <div className="outputContainer">
      <div className="grossContainer">
        <h4>Bruto plaća:</h4>
        <h2 className="gross">{formatNumber(amount)}</h2>
      </div>
      <div className="netContainer">
        <h4>Neto plaća:</h4>
        <h2 className="net">{formatNumber(netSalary)}</h2>
      </div>
    </div>
  )
}

export default GrossToNet;