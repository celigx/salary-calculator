import { useState } from 'react';
import './App.sass';
import Select from 'react-select';
import { cityList, childrenList, invalidityList } from './components/data/ArrayList';

function App() {
  const [salary, setAmount] = useState('')
  const [residence, setResidence] = useState(cityList[313].value)
  const [children, setChildren] = useState(childrenList[0].value)
  const [dependants, setDependants] = useState('0')
  const [invalidity, setInvalidity] = useState(invalidityList[0].value)

  const handleAmount = (e) => {
    setAmount(e.target.value)
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

  // Calculate pension (I. i II. stup)
  const pensionI = salary * 15 / 100
  const pensionII = salary * 5 / 100
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
  const taxableIncome = salary - totalGrossContribution - totalDeduction

  // Tax class (lower than 30.000,00 kn = 20%, higher than 30.000,00 kn = 30%)
  const taxClass = salary <= 30000 ? 20 : 30
  // Calculate tax
  const tax = taxableIncome * taxClass / 100

  // Calculate surtax
  const surtax = tax * parseInt(residence) / 100

  // Calculate total tax + surtax only if salary is bigger than 5.000,00 kn
  const totalTax = salary <= 5001 ? 0 : tax + surtax

  // Calculate health care contribution (16.5%)
  const healthCareContribution = salary * 16.50 / 100

  // Calculate gross 2
  const grossTwo = parseInt(salary) + healthCareContribution

  // Calculate net salary
  const netSalary = grossTwo - healthCareContribution - totalGrossContribution - totalTax
  console.log('netSalary:', netSalary);

  // Calculate gross salary
  const grossSalary = () => {
    // Surtax coefficient
    const surTaxCoefficient = (residence / 100) + 1
    // Tax and surtax coefficient for the rate of 20%
    const coefficient20 = (20 * surTaxCoefficient) / (100 - (20 * 1.18)) + 1
    // Tax and surtax coefficient for the rate of 30%
    const coefficient30 = (30 * surTaxCoefficient) / (100 - (30 * surTaxCoefficient)) + 1

    if (parseInt(salary) < totalDeduction) {
      const grossSalary = parseInt(salary) * 1.25
      return grossSalary
    } else if (parseInt(salary) < 30000 - 6000 * surTaxCoefficient + totalDeduction) {
      const grossSalary = Math.floor( ((parseInt(salary) - totalDeduction) * coefficient20) + totalDeduction ) / 0.80
      return grossSalary
    } else if (parseInt(salary) > 30000 - 6000 * surTaxCoefficient + totalDeduction) {
      const grossSalary = Math.floor( (30000 + totalDeduction) + ((parseInt(salary) - (30000 - 6000 * surTaxCoefficient+ totalDeduction)) * coefficient30) ) / 0.80
      return grossSalary
    }
  }

  console.log('residence:', residence);
  console.log('invalidity:', invalidity);
  
  return (
    <div className="app">
      <div className="titleContainer">
        <h1 className="title">Kalkulator za izračun plaće<span className="dot">.</span></h1>
      </div>

      <div className="inputContainer">

        <div className="left">
          <div className="amount">
            <h5 className="inputTitle">Iznos</h5>
            <input className="input" type="text" placeholder="20000" onChange={handleAmount} />
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
          <h5 className="inputTitle">Invalidnost</h5>
          <Select 
            options={invalidityList} 
            onChange={handleInvalidity} 
            defaultValue={invalidityList[0]}
          />
        </div>

      </div>
    </div>
  );
}

export default App;
