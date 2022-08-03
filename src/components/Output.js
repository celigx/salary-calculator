import { formatHrk, formatEur, conversionRate } from "../helper/helpers";
import { childrenList } from "../components/data/ArrayList";
import { useContext, useEffect } from "react";
import { AppContext } from "../context/contextStore";

const Output = () => {
  const { salary, setSalary, option, setOption } = useContext(AppContext);

  const { grossSalary, netSalary } = salary;
  const { amount, residence, children, dependants, invalidity, type } = option;

  useEffect(() => {
    calculateNetSalary();
    calculateGrossSalary();
    // eslint-disable-next-line
  }, [amount, residence, children, invalidity, type]);

  // Calculate pension (I. i II. stup)
  const pensionI =
    type === "grossToNet" ? (amount * 15) / 100 : (grossSalary * 15) / 100;
  const pensionII =
    type === "grossToNet" ? (amount * 5) / 100 : (grossSalary * 5) / 100;
  // Calculate gross contribution
  const totalGrossContribution = pensionI + pensionII;

  // Personal deduction
  const personalDeduction = 2500 * 1.6;

  // Filter children list
  const childrenDeduction = childrenList.filter(
    (list) => list.value <= children
  );
  // Calculate total deduction for children
  const totalChildrenDeduction = childrenDeduction.reduce(
    (total, item) => item.value + total,
    0
  );

  // Calculate dependants deduction
  const numberOfDependants =
    dependants === "" ? 0 : 1750 * parseInt(dependants);

  // Total deduction
  const totalDeduction =
    amount === 0
      ? 0
      : personalDeduction +
        totalChildrenDeduction +
        numberOfDependants +
        invalidity;

  // Taxable income
  const taxableIncome =
    amount <= 5001
      ? 0
      : type === "grossToNet"
      ? amount - totalGrossContribution - totalDeduction
      : grossSalary - totalGrossContribution - totalDeduction;

  // 20% tax - baseline up to 30.000,00 kn
  const taxClass20 =
    taxableIncome <= 30000 ? (taxableIncome * 20) / 100 : (30000 * 20) / 100;
  // 30% tax - baseline from 30.000,00 kn
  const taxClass30 =
    taxableIncome > 30000 ? ((taxableIncome - 30000) * 30) / 100 : 0;

  // Calculate tax
  const tax = taxClass20 + taxClass30;

  // Calculate surtax
  const surtax = (tax * parseInt(residence)) / 100;

  // Calculate total tax + surtax only if salary is bigger than 5.000,00 kn
  const totalTax = amount <= 5001 ? 0 : tax + surtax;

  // Calculate health care contribution (16.5%)
  const healthCareContribution =
    type === "grossToNet" ? (amount * 16.5) / 100 : (grossSalary * 16.5) / 100;

  // Calculate gross 2
  const grossTwo =
    type === "grossToNet"
      ? parseInt(amount) + healthCareContribution
      : parseInt(grossSalary) + healthCareContribution;

  // Calculate net salary
  const calculateNetSalary = () => {
    setSalary((prevState) => ({
      ...prevState,
      netSalary:
        grossTwo - healthCareContribution - totalGrossContribution - totalTax,
    }));
  };

  const calculateGrossSalary = () => {
    // Surtax coefficient
    const surTaxCoefficient = residence / 100 + 1;
    // Tax and surtax coefficient for the rate of 20%
    const coefficient20 =
      (20 * surTaxCoefficient) / (100 - 20 * surTaxCoefficient) + 1;
    // Tax and surtax coefficient for the rate of 30%
    const coefficient30 =
      (30 * surTaxCoefficient) / (100 - 30 * surTaxCoefficient) + 1;

    if (parseInt(amount) < totalDeduction) {
      const grossSalary = parseInt(amount) * 1.25;
      setSalary((prevState) => ({ ...prevState, grossSalary: grossSalary }));
    } else if (
      parseInt(amount) <
      30000 - 6000 * surTaxCoefficient + totalDeduction
    ) {
      const grossSalary =
        ((parseInt(amount) - totalDeduction) * coefficient20 + totalDeduction) /
        0.8;
      setSalary((prevState) => ({ ...prevState, grossSalary: grossSalary }));
    } else if (
      parseInt(amount) >
      30000 - 6000 * surTaxCoefficient + totalDeduction
    ) {
      const grossSalary =
        Math.round(
          30000 +
            totalDeduction +
            (parseInt(amount) -
              (30000 - 6000 * surTaxCoefficient + totalDeduction)) *
              coefficient30
        ) / 0.8;
      setSalary((prevState) => ({ ...prevState, grossSalary: grossSalary }));
    }
  };

  return (
    <div className="outputTable">
      <div className="container">
        <h4 className="text color">Bruto 1</h4>
        <h4 className="number color">
          {type === "grossToNet" ? formatHrk(amount) : formatHrk(grossSalary)}
        </h4>
        <h4 className="number-eur color">
          {type === "grossToNet"
            ? formatEur(amount / conversionRate)
            : formatEur(grossSalary / conversionRate)}
        </h4>
      </div>

      <div className="container">
        <p className="text">I. stup mirovinskog osiguranja</p>
        <p className="percent">15.00%</p>
        <p className="number">{formatHrk(pensionI)}</p>
        <p className="number-eur">{formatEur(pensionI / conversionRate)}</p>
      </div>

      <div className="container">
        <p className="text">II. stup mirovinskog osiguranja</p>
        <p className="percent">5.00%</p>
        <p className="number">{formatHrk(pensionII)}</p>
        <p className="number-eur">{formatEur(pensionII / conversionRate)}</p>
      </div>

      <div className="container">
        <h4 className="text">Ukupno doprinosi iz bruta</h4>
        <h4 className="number">{formatHrk(totalGrossContribution)}</h4>
        <h4 className="number-eur">
          {formatEur(totalGrossContribution / conversionRate)}
        </h4>
      </div>

      <div className="container">
        <p className="text">Ukupna olakšica</p>
        <p className="number">{formatHrk(totalDeduction)}</p>
        <p className="number-eur">
          {formatEur(totalDeduction / conversionRate)}
        </p>
      </div>

      <div className="container">
        <h4 className="text">Oporezivi dohodak</h4>
        <h4 className="number">{formatHrk(taxableIncome)}</h4>
        <h4 className="number-eur">
          {formatEur(taxableIncome / conversionRate)}
        </h4>
      </div>

      <div className="container">
        <p className="text">Ukupni porez</p>
        <p className="number">{formatHrk(tax)}</p>
        <p className="number-eur">{formatEur(tax / conversionRate)}</p>
      </div>

      <div className="container">
        <p className="text">Ukupni prirez</p>
        <p className="percent">18.00%</p>
        <p className="number">{formatHrk(surtax)}</p>
        <p className="number-eur">{formatEur(surtax / conversionRate)}</p>
      </div>

      <div className="container">
        <h4 className="text">Ukupni porez i prirez</h4>
        <h4 className="number">{formatHrk(totalTax)}</h4>
        <h4 className="number-eur">{formatEur(totalTax / conversionRate)}</h4>
      </div>

      <div className="container">
        <h4 className="text">Bruto 2</h4>
        <h4 className="number">
          {amount === ""
            ? setOption((prevState) => ({ ...prevState, amount: 0 }))
            : formatHrk(grossTwo)}
        </h4>
        <h4 className="number-eur">
          {amount === ""
            ? setOption((prevState) => ({ ...prevState, amount: 0 }))
            : formatEur(grossTwo / conversionRate)}
        </h4>
      </div>

      <div className="container">
        <p className="text">Doprinos za zdravstveno osiguranje</p>
        <p className="percent">16.50%</p>
        <p className="number">{formatHrk(healthCareContribution)}</p>
        <p className="number-eur">
          {formatEur(healthCareContribution / conversionRate)}
        </p>
      </div>

      <div className="container">
        <h4 className="text">Ukupno doprinosi na bruto</h4>
        <h4 className="number">{formatHrk(healthCareContribution)}</h4>
        <h4 className="number-eur">
          {formatEur(healthCareContribution / conversionRate)}
        </h4>
      </div>

      <div className="container">
        <h4 className="text color">Neto plaća</h4>
        <h4 className="number color">
          {type === "grossToNet" ? formatHrk(netSalary) : formatHrk(amount)}
        </h4>
        <h4 className="number-eur color">
          {type === "grossToNet"
            ? formatEur(netSalary / conversionRate)
            : formatEur(amount / conversionRate)}
        </h4>
      </div>
    </div>
  );
};

export default Output;
