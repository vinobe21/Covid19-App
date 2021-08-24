import React, { useEffect, useState } from 'react';
import { FormControl, Select, MenuItem, Card, CardContent } from '@material-ui/core';
import InfoBox from './InfoBox';
import { sortData, prettyPrintStat } from './util';
import Map from './Map';
import Table from './Table';
import Graph from './Graph';
import './App.css';
import "leaflet/dist/leaflet.css";
import numeral from 'numeral';

function App() {
  const [conuntries, setCountries] = useState([]);
  const [country, setCountry] = useState('Worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 30, lng: 10 });
  const [mapZoom, setMapZoom] = useState(2);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    //these code run once when component loads
    //async  --> send a request, wait for it, do somethink
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => (
            {
              name: country.country, //United states, India
              value: country.countryInfo.iso2, //US , IND
            }
          ));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);


  const countryChange = async (e) => {
    const countryCode = e.target.value;
    //console.log('selected country', countryCode);
    setCountry(countryCode);

    const url = countryCode === "Worldwide"
      ? "https://disease.sh/v3/covid-19/countries"
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;



    await fetch(url)
      .then(response => response.json())
      .then(data => {
        setCountry(countryCode);
        //all of country data
        //console.log(data);
        setCountryInfo(data);

        //If change country map location change
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        //console.log([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);

      });

  }

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>Covid 19 tracker</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" onChange={countryChange} value={country} >
              <MenuItem value="Worldwide">Worldwide</MenuItem>
              {/* dropdown loop of all countries */}
              {
                conuntries.map(country => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))
              }
            </Select>

          </FormControl>
        </div> {/*end of Header */}
        <div className="app__stats">
          <InfoBox
            isRed
            active={casesType === "cases"}
            onClick={e => setCasesType("cases")}
            title="Coronavirus Cases"
            cases={numeral(countryInfo.todayCases).format("0,0")}
            total={prettyPrintStat(countryInfo.cases)}
          />
          <InfoBox
            active={casesType === "recovered"}
            onClick={e => setCasesType("recovered")}
            title="Recoverd"
            cases={numeral(countryInfo.todayRecovered).format("0,0")}
            total={prettyPrintStat(countryInfo.recovered)}
          />
          <InfoBox
            isRed
            active={casesType === "deaths"}
            onClick={e => setCasesType("deaths")}
            title="Deaths"
            cases={numeral(countryInfo.todayDeaths).format("0,0")}
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>{/*end of InfoBox */}

        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />{/*end of Map */}
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases </h3>
          <Table conuntries={tableData} />{/*right Table */}

          <h3 className="app__graphTitle">Worldwide New {casesType} </h3>
          <Graph
            className="app__graph"
            casesType={casesType}
          />{/*right bottom line graph */}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
