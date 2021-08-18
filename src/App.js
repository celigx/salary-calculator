import { useState } from 'react';
import './App.sass';
import Select from 'react-select';
import { cityList, childrenList, invalidityList } from './components/data/ArrayList';

function App() {
  const [amount, setAmount] = useState('')
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
