import { useState } from 'react';
import './App.sass';
import Select from 'react-select';
import { cityList, childrenList, invalidityList } from './components/data/ArrayList';

function App() {
  const [salary, setAmount] = useState('')
  const [residence, setResidence] = useState('')
  const [children, setChildren] = useState('0')
  const [dependants, setDependants] = useState('0')
  const [invalidity, setInvalidity] = useState('')

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

  // Calculate total tax + surtax
  const totalTax = tax + surtax

  // Calculate health care contribution (16.5%)
  const healthCareContribution = salary * 16.50 / 100

  // Calculate gross 2
  const grossTwo = parseInt(salary) + healthCareContribution

  // Calculate net salary
  const netSalary = grossTwo - healthCareContribution - totalGrossContribution - totalTax

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
            />
          </div>
        </div>

        <div className="right">
          <div className="children">
            <h5 className="inputTitle">Broj djece</h5>
            <Select 
              options={childrenList} 
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
          />
        </div>

      </div>
    </div>
  );
}

export default App;
