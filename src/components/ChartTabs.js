import React, { useContext } from "react";
import appContext from "../context/appContext";
import Chart from "./Chart";

import {
    Tab,
    Tabs,
} from "grommet";

function Layout() {
    const {
        chartMetric,
        setChartMetric,
    } = useContext(appContext);
    const tabs = ["watts", "voltage", "amphours"];

    return (
        <Tabs
            flex
            activeIndex={tabs.indexOf(chartMetric)}
            onActive={(index) => setChartMetric(tabs[index])}
            alignControls="center"
        >
            <Tab title="Watts">
                <Chart />
            </Tab>
            <Tab title="Volts">
                <Chart />
            </Tab>
            <Tab title="Battery Capacity">
                <Chart />
            </Tab>
        </Tabs>
    );
}

export default Layout;
