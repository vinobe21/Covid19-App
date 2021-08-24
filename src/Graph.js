import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import numeral from 'numeral';


const options = {
    legend: {
        display: true,
    },
    elements: {
        point: {
            radius: 1,
        },
    },
    resposive: true,
    maintainAspectRatio: true,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            lable: function (tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll",
                },
            },
        ],
        yAxes: [
            {
                gridLines: {
                    display: false,
                },
                ticks: {
                    callback: function (value, index, values) {
                        return numeral(value).format("0a");
                    },
                },
            },
        ],
    },
};


const buildChartData = (data, casesType = "cases") => {
    let chartData = [];
    let lastDataPoint;
    for (let date in data.cases) {
        if (lastDataPoint) {
            let newDataPoint = {
                x: date,
                y: data[casesType][date] - lastDataPoint,
            };
            chartData.push(newDataPoint);
        }
        lastDataPoint = data[casesType][date];
    }

    return chartData;

};

function Graph({ casesType = "cases", ...props }) {
    const [data, setData] = useState({});


    useEffect(() => {
        const fetchData = async () => {
            await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=30")
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    let chartData = buildChartData(data, casesType);
                    setData(chartData);
                });
        };
        fetchData();
    }, [casesType]);


    return (
        <div className={props.className}>
            {data?.length > 0 && (
                <Line
                    data={{
                        datasets: [
                            {
                                label: "Count",
                                backgroundColor: "rgba(75,192,192,1)",
                                borderColor: "rgba(0,0,0,1)",
                                borderWidth: 2,
                                data: data,
                            },
                        ],
                    }}
                    options={options}
                />
            )}
        </div>
    );
};

export default Graph;
