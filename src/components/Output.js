import { formatHrk, formatEur, conversionRate } from "../helper/helpers";
import { childrenList } from "./data/ArrayList";
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
      <div className="container highlight">
        <div className="flex">
          <h4 className="text">BRUTO</h4>
          <div className="flex">
            <h4 className="number mr-40">
              {type === "grossToNet"
                ? formatHrk(amount)
                : formatHrk(grossSalary)}
            </h4>
            <h4 className="number-eur">
              {type === "grossToNet"
                ? formatEur(amount / conversionRate)
                : formatEur(grossSalary / conversionRate)}
            </h4>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row border">
          <p className="text">Doprinos za mirovinsko 1. stup (15%)</p>
          <span className="flex">
            <p className="number mr-40">{formatHrk(pensionI)}</p>
            <p className="number-eur">{formatEur(pensionI / conversionRate)}</p>
          </span>
        </div>
        <div className="row border thick">
          <p className="text">Doprinos za mirovinski 2. stup (5%)</p>
          <span className="flex">
            <p className="number mr-40">{formatHrk(pensionII)}</p>
            <p className="number-eur">
              {formatEur(pensionII / conversionRate)}
            </p>
          </span>
        </div>
        <div className="row border">
          <h4 className="text">UKUPNO DOPRINOSI IZ BRUTA (20%)</h4>
          <span className="flex">
            <h4 className="number mr-40">
              {formatHrk(totalGrossContribution)}
            </h4>
            <h4 className="number-eur">
              {formatEur(totalGrossContribution / conversionRate)}
            </h4>
          </span>
        </div>
      </div>

      <div className="container">
        <div className="flex">
          <p className="text">OSOBNI ODBITAK</p>
          <span className="flex">
            <p className="number mr-40">{formatHrk(totalDeduction)}</p>
            <p className="number-eur">
              {formatEur(totalDeduction / conversionRate)}
            </p>
          </span>
        </div>
      </div>

      <div className="container">
        <div className="row border">
          <p className="text">Porez (20%)</p>
          <span className="flex">
            <p className="number mr-40">{formatHrk(taxClass20)}</p>
            <p className="number-eur">
              {formatEur(taxClass20 / conversionRate)}
            </p>
          </span>
        </div>
        <div className="row border">
          <p className="text">Porez (30%)</p>
          <span className="flex">
            <p className="number mr-40">{formatHrk(taxClass30)}</p>
            <p className="number-eur">
              {formatEur(taxClass30 / conversionRate)}
            </p>
          </span>
        </div>
        <div className="row border thick">
          <p className="text">Prirez (18%)</p>
          <span className="flex">
            <p className="number mr-40">{formatHrk(surtax)}</p>
            <p className="number-eur">{formatEur(surtax / conversionRate)}</p>
          </span>
        </div>
        <div className="row border">
          <h4 className="text">UKUPNO POREZ I PRIREZ</h4>
          <span className="flex">
            <h4 className="number mr-40">{formatHrk(totalTax)}</h4>
            <h4 className="number-eur">
              {formatEur(totalTax / conversionRate)}
            </h4>
          </span>
        </div>
      </div>

      <div className="container highlight">
        <div className="flex">
          <h4 className="text">BRUTO 2</h4>
          <span className="flex">
            <h4 className="number mr-40">
              {amount === ""
                ? setOption((prevState) => ({ ...prevState, amount: 0 }))
                : formatHrk(grossTwo)}
            </h4>
            <h4 className="number-eur">
              {amount === ""
                ? setOption((prevState) => ({ ...prevState, amount: 0 }))
                : formatEur(grossTwo / conversionRate)}
            </h4>
          </span>
        </div>
      </div>

      <div className="container">
        <div className="row border thick">
          <p className="text">Doprinos za zdravstveno osiguranje</p>
          <span className="flex">
            <p className="number mr-40">{formatHrk(healthCareContribution)}</p>
            <p className="number-eur">
              {formatEur(healthCareContribution / conversionRate)}
            </p>
          </span>
        </div>
        <div className="row border">
          <h4 className="text">UKUPNO DOPRINOSI NA BRUTO</h4>
          <span className="flex">
            <h4 className="number mr-40">
              {formatHrk(healthCareContribution)}
            </h4>
            <h4 className="number-eur">
              {formatEur(healthCareContribution / conversionRate)}
            </h4>
          </span>
        </div>
      </div>

      <div className="container highlight">
        <div className="flex">
          <h4 className="text">NETO</h4>
          <span className="flex">
            <h4 className="number mr-40">
              {type === "grossToNet" ? formatHrk(netSalary) : formatHrk(amount)}
            </h4>
            <h4 className="number-eur">
              {type === "grossToNet"
                ? formatEur(netSalary / conversionRate)
                : formatEur(amount / conversionRate)}
            </h4>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Output;
