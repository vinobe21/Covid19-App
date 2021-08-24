import React from 'react';
import numeral from "numeral";
import "./Table.css";

function Table({ conuntries }) {
    return (
        <div className="table" >
            {
                conuntries.map(({ country, cases }) => (
                    <tr>
                        <td>{country}</td>
                        <td>
                            <strong>{numeral(cases).format("0,0")}</strong>
                        </td>
                    </tr>
                ))
            }
        </div>
    )
}

export default Table
