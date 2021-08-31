import { useEffect, useState } from 'react';
import './App.sass';
import Select from 'react-select';
import { cityList, childrenList, invalidityList, typeList } from './components/data/ArrayList';
import GrossToNet from './components/GrossToNet';
import NetToGross from './components/NetToGross';

function App() {
  const [amount, setAmount] = useState(0)
  const [residence, setResidence] = useState(cityList[313].value)
  const [children, setChildren] = useState(childrenList[0].value)
  const [dependants, setDependants] = useState(0)
  const [invalidity, setInvalidity] = useState(invalidityList[0].value)
  const [type, setType] = useState(typeList[0].value)
  const [net, setNet] = useState(0)

  useEffect(() => {
    type === 'grossToNet' ? setAmount(net) : setAmount(grossSalary(net))

    // If dependants input is empty return 0, else return input value
    dependants === '' ? setDependants(0) : setDependants(dependants)
  }, [type, net, dependants])

  console.log('dep', dependants);

  const handleAmount = (e) => {
    setAmount(e.target.value)
    setNet(e.target.value)
    console.log('amount:', e.target.value)
  }

  const handleResidence = (option) => {
    setResidence(option.value)
    console.log('residence:', option.value)
  }

  const handleChildren = (option) => {
    setChildren(option.value)
    console.log('children:', option.value)
  }

  const handleDependants = (e) => {
    setDependants(e.target.value)
    console.log('dependants:', e.target.value)
  }

  const handleInvalidity = (option) => {
    setInvalidity(option.value)
    console.log('invalidity:', option.value)
  }

  const handleType = (option) => {
    setType(option.value)
    console.log('type:', option.value);
  }

  // Calculate pension (I. i II. stup)
  const pensionI = amount * 15 / 100
  const pensionII = amount * 5 / 100
  // Calculate gross contribution
  const totalGrossContribution = pensionI + pensionII

  // Personal deduction
  const personalDeduction = 2500 * 1.6
  
  // Filter children list
  const childrenDeduction = childrenList.filter(list => list.value <= children)
  // Calculate total deduction for children
  const totalChildrenDeduction = childrenDeduction.reduce((total, item) => item.value + total, 0)

  // Calculate dependants deduction
  const numberOfDependants = dependants === '0' ? 0 : 1750 * parseInt(dependants)

  // Total deduction
  const totalDeduction = personalDeduction + totalChildrenDeduction + numberOfDependants + invalidity

  // Taxable income
  const taxableIncome = amount === 0 ? 0 : amount - totalGrossContribution - totalDeduction

  // 20% tax - baseline up to 30.000,00 kn
  const taxClass20 = taxableIncome <= 30000 ? taxableIncome * 20 / 100 : 30000 * 20 / 100
  // 30% tax - baseline from 30.000,00 kn
  const taxClass30 = taxableIncome > 30000 ? (taxableIncome - 30000) * 30 / 100 : 0
  
  // Calculate tax
  const tax = taxClass20 + taxClass30

  // Calculate surtax
  const surtax = tax * parseInt(residence) / 100

  // Calculate total tax + surtax only if salary is bigger than 5.000,00 kn
  const totalTax = amount <= 5001 ? 0 : tax + surtax

  // Calculate health care contribution (16.5%)
  const healthCareContribution = amount * 16.50 / 100

  // Calculate gross 2
  const grossTwo = parseInt(amount) + healthCareContribution

  // Calculate net salary
  const netSalary = Math.round(grossTwo - healthCareContribution - totalGrossContribution - totalTax)
  // console.log('netSalary:', netSalary);

  // Calculate gross salary
  const grossSalary = (n) => {
    // Surtax coefficient
    const surTaxCoefficient = (residence / 100) + 1
    // Tax and surtax coefficient for the rate of 20%
    const coefficient20 = (20 * surTaxCoefficient) / (100 - (20 * surTaxCoefficient)) + 1
    // Tax and surtax coefficient for the rate of 30%
    const coefficient30 = (30 * surTaxCoefficient) / (100 - (30 * surTaxCoefficient)) + 1

    if (parseInt(n) < totalDeduction) {
      const grossSalary = parseInt(n) * 1.25
      return grossSalary
    } else if (parseInt(n) < 30000 - 6000 * surTaxCoefficient + totalDeduction) {
      const grossSalary =  ( ((parseInt(n) - totalDeduction) * coefficient20) + totalDeduction ) / 0.80
      console.log('two', grossSalary);
      return grossSalary
    } else if (parseInt(n) > 30000 - 6000 * surTaxCoefficient + totalDeduction) {
      const grossSalary = Math.round( (30000 + totalDeduction) + ((parseInt(n) - (30000 - 6000 * surTaxCoefficient + totalDeduction)) * coefficient30) ) / 0.80
      console.log('three', grossSalary);
      return grossSalary
    }
  }

  // Format number to currency
  const formatNumber = (value) => {
    return new Intl.NumberFormat('hr-HR', {style: 'currency', currency: 'HRK'}).format(value)
  }

  return (
    <div className="app">
      <div className="titleContainer">
        <h1 className="title">Kalkulator za izračun plaće<span className="dot">.</span></h1>
      </div>

      <div className="inputContainer">

        <div className="left">
          <div className="amount">
            <h5 className="inputTitle">Iznos</h5>
            <input className="input" type="number" placeholder="20000" onChange={handleAmount} />
          </div>
          <div className="residence">
            <h5 className="inputTitle">Mjesto prebivališta</h5>
            <Select 
              options={cityList} 
              onChange={handleResidence}
              defaultValue={cityList[313]}
            />
          </div>
        </div>

        <div className="right">
          <div className="children">
            <h5 className="inputTitle">Broj djece</h5>
            <Select 
              options={childrenList} 
              defaultValue={childrenList[0]}
              onChange={handleChildren} 
            />
          </div>
          <div className="dependants">
            <h5 className="inputTitle">Broj uzdržavanih osoba</h5>
            <input className="input" type="text" placeholder="0" onChange={handleDependants} />
          </div>
        </div>

        <div className="bottom">
          <div className="invalidity">
            <h5 className="inputTitle">Invalidnost</h5>
            <Select 
              options={invalidityList} 
              onChange={handleInvalidity} 
              defaultValue={invalidityList[0]}
              />
          </div>
          <div className="type">
            <h5 className="inputTitle">Izračun</h5>
            <Select 
              options={typeList} 
              onChange={handleType} 
              defaultValue={typeList[0]}
            />
          </div>
        </div>

      </div>

      {/* Display output based on selected input option */}
      {type === 'grossToNet' 
        ? <GrossToNet formatNumber={formatNumber} amount={amount} netSalary={netSalary} /> 
        : <NetToGross formatNumber={formatNumber} grossSalary={grossSalary} net={net} />}

      <div className="outputTable">
      <div className="container">
        <h4 className="text color">Bruto 1</h4>
        <h4 className="number color">{type === 'grossToNet' ? formatNumber(net) : formatNumber(grossSalary(net))}</h4>
      </div>

      <div className="container">
        <p className="text">I. stup mirovinskog osiguranja</p>
        <p className="percent">15.00%</p>
        <p className="number">{formatNumber(pensionI)}</p>
      </div>

      <div className="container">
        <p className="text">II. stup mirovinskog osiguranja</p>
        <p className="percent">5.00%</p>
        <p className="number">{formatNumber(pensionII)}</p>
      </div>

      <div className="container">
        <h4 className="text">Ukupno doprinosi iz bruta</h4>
        <h4 className="number">{formatNumber(totalGrossContribution)}</h4>
      </div>

      <div className="container">
        <p className="text">Ukupna olakšica</p>
        <p className="number">{formatNumber(totalDeduction)}</p>
      </div>

      <div className="container">
        <h4 className="text">Oporezivi dohodak</h4>
        <h4 className="number">{formatNumber(taxableIncome)}</h4>
      </div>

      <div className="container">
        <p className="text">Ukupni porez</p>
        <p className="number">{formatNumber(tax)}</p>
      </div>

      <div className="container">
        <p className="text">Ukupni prirez</p>
        <p className="percent">18.00%</p>
        <p className="number">{formatNumber(surtax)}</p>
      </div>

      <div className="container">
        <h4 className="text">Ukupni porez i prirez</h4>
        <h4 className="number">{formatNumber(totalTax)}</h4>
      </div>

      <div className="container">
        <h4 className="text">Bruto 2</h4>
        <h4 className="number">{formatNumber(grossTwo)}</h4>
      </div>

      <div className="container">
        <p className="text">Ukupni prirez</p>
        <p className="percent">16.50%</p>
        <p className="number">{formatNumber(healthCareContribution)}</p>
      </div>

      <div className="container">
        <h4 className="text">Ukupno doprinosi na bruto</h4>
        <h4 className="number">{formatNumber(healthCareContribution)}</h4>
      </div>

      <div className="container">
        <h4 className="text color">Neto plaća</h4>
        <h4 className="number color">{type === 'grossToNet' ? formatNumber(netSalary) : formatNumber(net)}</h4>
      </div>

      </div>

    </div>
  );
}

export default App;
