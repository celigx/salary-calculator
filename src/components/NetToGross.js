import { formatHrk, formatEur, conversionRate } from "../helper/helpers";

const NetToGross = ({ grossSalary, net }) => {
  return (
    <div className="outputContainer">
      <div className="grossContainer">
        <h4>Bruto plaća:</h4>
        <h2 className="gross">{formatHrk(grossSalary(net))}</h2>
        <h2 className="gross-eur">{formatEur(grossSalary(net / conversionRate))}</h2>
      </div>
      <div className="netContainer">
        <h4>Neto plaća:</h4>
        <h2 className="net">{formatHrk(net)}</h2>
        <h2 className="net-eur">{formatEur(net / conversionRate)}</h2>
      </div>
    </div>
  );
};

export default NetToGross;
