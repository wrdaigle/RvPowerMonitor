import React, { useContext } from "react";
import appContext from "../context/appContext";

import {
    Area,
    ComposedChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import moment from "moment";
import { Box } from "grommet";

function PowerCharts() {
    const { powerData, chartMetric, chartTimeSpan } = useContext(appContext);
    if (!powerData) return null;

    return (
        <Box fill>
            <ResponsiveContainer>
                <ComposedChart
                    data={powerData.graphData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid stroke='rgba(120,120,120,0.2)'  />
                    <XAxis
                        dataKey="time"
                        scale="time"
                        type="number"
                        domain={["auto", "auto"]}
                        allowDataOverflow
                        tickFormatter={(timestamp) =>
                            moment(timestamp).format(
                                chartTimeSpan < 48 ? "LT" : "MM/DD h:mm a"
                            )
                        }
                        style={{ fontSize: "10px", fill: "rgb(200,200,200)" }}
                    />
                    <YAxis
                        width={30}
                        type="number"
                        domain={
                            chartMetric === "amphours"
                                ? [0.2]
                                : ["dataMin", "dataMax"]
                        }
                        style={{ fontSize: "10px", fill: "rgb(200,200,200)" }}
                        ticks={
                            chartMetric === "amphours"
                                ? [0, 25, 50, 75, 100, 125, 150, 175, 200]
                                : null
                        }
                    />
                    {chartMetric === "watts" && [
                        <Line
                            key={chartMetric}
                            type="linear"
                            dataKey={chartMetric}
                            stroke="#6FFFB0"
                            strokeWidth={2}
                            dot={false}
                        />,
                        <Line
                            key={"watts_min"}
                            type="linear"
                            dataKey={"watts_min"}
                            stroke="rgba(111, 255, 176,0.5)"

                            strokeDasharray="5 5"
                            strokeWidth={1}
                            dot={false}
                        />,
                        <Line
                            key={"watts_max"}
                            type="linear"
                            dataKey={"watts_max"}
                            stroke="rgba(111, 255, 176,0.5)"
                            strokeDasharray="5 5"
                            strokeWidth={1}
                            dot={false}
                        />
                    ]}
                    {chartMetric === "voltage" && (
                        <Line
                            key={chartMetric}
                            type="linear"
                            dataKey={chartMetric}
                            stroke="#ff6fe7"
                            strokeWidth={2}
                            dot={false}
                        />
                    )}
                    {chartMetric === "amphours" && (
                        <Area
                            key={chartMetric}
                            type="linear"
                            dataKey={chartMetric}
                            stroke="#6fafff"
                        />
                    )}
                </ComposedChart>
            </ResponsiveContainer>
        </Box>
    );
}

export default PowerCharts;
