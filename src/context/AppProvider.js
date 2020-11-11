import React, { useReducer, useEffect } from "react";
import AppContext from "./appContext";

const initialState = {
    powerData: null,
    chartMetric: "watts",
    chartTimeSpan: 6,
    fetching: false,
};

const serverRoot =
    window.location.hostname === "localhost" ? "http://192.168.4.37" : "";

const AppProvider = (props) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

    useEffect(() => {
        if (!state.powerData) setPowerData();
    }, []);

    useEffect(() => {
        setPowerData();
        const interval = setInterval(() => {
            if (!state.fetching) setPowerData();
        }, 10000);
        return () => clearInterval(interval);
    }, [state.chartTimeSpan]);

    const setPowerData = () => {
        dispatch({
            type: "SET_FETCHING"
        });
        fetch(serverRoot + "/api/hours/" + state.chartTimeSpan.toString())
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                dispatch({
                    type: "SET_POWER_DATA",
                    to: data,
                });
            });
    };

    const setChartMetric = (chartMetric) => {
        dispatch({ type: "SET_CHART_METRIC", to: chartMetric });
    };

    const setChartTimeSpan = (chartTimeSpan) => {
        dispatch({ type: "SET_CHART_TIME_SPAN", to: chartTimeSpan });
    };

    return (
        <AppContext.Provider
            value={{
                powerData: state.powerData,
                setPowerData,
                chartMetric: state.chartMetric,
                setChartMetric,
                chartTimeSpan: state.chartTimeSpan,
                setChartTimeSpan,
                fetching: state.fetching
            }}
        >
            {props.children}
        </AppContext.Provider>
    );
};

const appReducer = (state, action) => {
    switch (action.type) {
        case "SET_FETCHING":
            return {
                ...state,
                fetching: true,
            };
        case "SET_POWER_DATA":
            return {
                ...state,
                powerData: action.to,
                fetching: false,
            };
        case "SET_CHART_METRIC":
            return {
                ...state,
                chartMetric: action.to,
            };
        case "SET_CHART_TIME_SPAN":
            return {
                ...state,
                chartTimeSpan: parseInt(action.to, 10),
            };
        default:
            throw new Error();
    }
};

export default AppProvider;
