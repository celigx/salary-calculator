import { useContext } from "react";
import { AppContext } from "../context/contextStore";
import { formatHrk, formatEur, conversionRate } from "../helper/helpers";

const NetToGross = () => {
  const { option, salary } = useContext(AppContext);

  const { amount } = option;
  const { grossSalary } = salary;

  return (
    <div className="outputContainer">
      <div className="grossContainer">
        <h4>Bruto plaća:</h4>
        <h2 className="gross">{formatHrk(grossSalary)}</h2>
        <h2 className="gross-eur">{formatEur(grossSalary / conversionRate)}</h2>
      </div>
      <div className="netContainer">
        <h4>Neto plaća:</h4>
        <h2 className="net">{formatHrk(amount)}</h2>
        <h2 className="net-eur">{formatEur(amount / conversionRate)}</h2>
      </div>
    </div>
  );
};

export default NetToGross;
