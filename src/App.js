import React, { useState, useEffect } from 'react';
import { Chart } from "react-google-charts";
import Button from './shared/components/FormElements/Button';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';

import './App.css';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [interests, setUserInterests] = useState([]);
  const [city, setCity] = useState('haarlem');
  const [cityEmpty, setCityEmpty] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  async function fetchData() {
    setLoading(true);
    try {
      const response = await fetch(`https://amity-hackathon.herokuapp.com/city/${city}/interest`);
      const json = await response.json();

      let userData = [];
      userData.push(json);

      if(json.city === null){
        setCityEmpty(true);
        setErrorMessage('Cannot find results for the city searched, please try another city!!');
      }else{
        setCityEmpty(false);
        setErrorMessage(null);
      }
      let temp = [];
      temp.push(["Interests", "Count of Interests"]);
      userData[0].interestCountList.forEach((item) => temp.push([item.interest, item.count]));

      setUserInterests(temp);
      setCity(json.city);
    } catch (error) {
      console.error(error.message);
    }
    setLoading(false);
  }
  useEffect(() => {
    fetchData();
  }, []);

  const options = {
    legend: "none",
    pieSliceText: "label",
    title: `Interests of people in ${city}`,
    pieStartAngle: 100,
  };

  const changeHandler = event => {
    setCity(event.target.value);
  }

  const submitHandler = event => {
   event.preventDefault();
   fetchData();
  }

  return (
    <React.Fragment>
    <div className="center">
      <div className ="errorMessage">{errorMessage}</div>
      {loading && <LoadingSpinner />}
      <div className ="form-container">
        <form className="city-search-form" onSubmit={submitHandler}>
          <label className="city-label">Type a City:</label>
          <input type="text" value={`${city}`} onChange={changeHandler} />
          <Button disabled={!`${city}`} type="submit"> Search</Button>
        </form>
      </div>
      <div className="reactChart">
        {!loading && !cityEmpty  && (
          <Chart
          chartType="PieChart"
          data={interests}
          options={options}
          width={"100%"}
          height={"600px"}  />
        )}
      </div>
    </div>
    </React.Fragment>
  );
};
export default App;