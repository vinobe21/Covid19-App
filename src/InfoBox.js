import React, { active } from 'react';
import "./infoBox.css";
import { CardContent, Card, Typography } from '@material-ui/core';


function InfoBox({ isRed, title, cases, total, ...props }) {
    return (
        <Card onClick={props.onClick}
            className={`infoBox ${active && "infoBox--selected"} ${isRed && "infoBox--red"}`}
        >
            <CardContent>
                {/* title */}
                <Typography className="infoBox__title" color="textSecondary">
                    {title}
                </Typography>

                {/* Number of Cases */}
                <h2 className="infoBox__cases">{cases}</h2>

                {/* Total */}
                <Typography className="infoBox__total" color="textSecondary">{total}Total</Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
