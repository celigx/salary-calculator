import { useContext } from "react";
import Select from "react-select";
import {
  cityList,
  childrenList,
  invalidityList,
  typeList,
} from "../components/data/ArrayList";
import { AppContext } from "../context/contextStore";

// Custom styling for react-select
const customStyles = {
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected ? "black" : "black",
    background: state.isSelected ? "#c8e0f9" : "#fff",
  }),
  control: (provided, state) => ({
    ...provided,
    border: state.isFocused ? "1px solid #c8e0f9" : "1px solid #ccc",
    boxShadow: state.isFocused ? "0 0 0 1px #c8e0f9" : "#ccc",
    "&:hover": {
      borderColor: state.isFocused ? "#c8e0f9" : "#b3b3b3",
    },
  }),
};

const Input = () => {
  const { setOption } = useContext(AppContext);

  const handleAmount = (e) => {
    setOption((prevState) => ({ ...prevState, amount: e.target.value }));
  };

  const handleResidence = (option) => {
    setOption((prevState) => ({ ...prevState, residence: option.value }));
  };

  const handleChildren = (option) => {
    setOption((prevState) => ({ ...prevState, children: option.value }));
  };

  const handleDependants = (e) => {
    setOption((prevState) => ({ ...prevState, dependants: e.target.value }));
  };

  const handleInvalidity = (option) => {
    setOption((prevState) => ({ ...prevState, invalidity: option.value }));
  };

  const handleType = (option) => {
    setOption((prevState) => ({ ...prevState, type: option.value }));
  };

  return (
    <div className="inputContainer">
      <div className="left">
        <div className="amount">
          <h5 className="inputTitle">Iznos</h5>
          <input
            className="input"
            type="number"
            placeholder="0"
            onChange={handleAmount}
          />
        </div>
        <div className="residence">
          <h5 className="inputTitle">Mjesto prebivališta</h5>
          <Select
            styles={customStyles}
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
            styles={customStyles}
            options={childrenList}
            defaultValue={childrenList[0]}
            onChange={handleChildren}
          />
        </div>
        <div className="dependants">
          <h5 className="inputTitle">Broj uzdržavanih osoba</h5>
          <input
            className="input"
            type="text"
            placeholder="0"
            onChange={handleDependants}
          />
        </div>
      </div>

      <div className="bottom">
        <div className="invalidity">
          <h5 className="inputTitle">Stupanj invaliditeta</h5>
          <Select
            styles={customStyles}
            options={invalidityList}
            onChange={handleInvalidity}
            defaultValue={invalidityList[0]}
          />
        </div>
        <div className="type">
          <h5 className="inputTitle">Vrsta izračuna</h5>
          <Select
            styles={customStyles}
            options={typeList}
            onChange={handleType}
            defaultValue={typeList[0]}
          />
        </div>
      </div>
    </div>
  );
};

export default Input;
