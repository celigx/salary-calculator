import { useContext } from "react";
import { AppContext } from "../context/contextStore";
import { formatHrk, formatEur, conversionRate } from "../helper/helpers";

const GrossToNet = () => {
  const { option, salary } = useContext(AppContext);

  const { netSalary } = salary;
  const { amount } = option;

  return (
    <div className="outputContainer">
      <div className="grossContainer">
        <h4>Bruto plaća:</h4>
        <h2 className="gross">{formatHrk(amount)}</h2>
        <h2 className="gross-eur">{formatEur(amount / conversionRate)}</h2>
      </div>
      <div className="netContainer">
        <h4>Neto plaća:</h4>
        <h2 className="net">{formatHrk(netSalary)}</h2>
        <h2 className="net-eur">{formatEur(netSalary / conversionRate)}</h2>
      </div>
    </div>
  );
};

export default GrossToNet;
