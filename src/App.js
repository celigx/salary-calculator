import { useState } from "react";
import "./App.sass";
import {
  cityList,
  childrenList,
  invalidityList,
  typeList,
} from "./components/data/ArrayList";

import Title from "./components/Title";
import Input from "./components/Input";
import Output from "./components/Output";
import GrossToNet from "./components/GrossToNet";
import NetToGross from "./components/NetToGross";

import { AppContext } from "./context/contextStore";

function App() {
  const [option, setOption] = useState({
    amount: 0,
    residence: cityList[313].value,
    children: childrenList[0].value,
    dependants: 0,
    invalidity: invalidityList[0].value,
    type: typeList[0].value,
  });

  const [salary, setSalary] = useState({
    netAmount: 0,
    grossAmount: 0,
    netSalary: 0,
    grossSalary: 0,
  });

  return (
    <AppContext.Provider value={{ salary, setSalary, option, setOption }}>
      <div className="app">
        <Title />
        <Input />
        {option.type === "grossToNet" ? <GrossToNet /> : <NetToGross />}
        <Output />
      </div>
    </AppContext.Provider>
  );
}

export default App;
