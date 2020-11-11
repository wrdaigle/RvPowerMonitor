import React from "react";
import AppProvider from "./context/AppProvider";

import { Grommet } from "grommet";
import { grommet } from "grommet/themes";
import { deepMerge } from "grommet/utils";
import Layout from "./components/Layout";

import "./App.css";

const customTheme = deepMerge(grommet, {
    global: {
        focus: {
            border: {
                color: 'transparent'
            }
        }
    },
    tab: {
        color: "rgb(140,140,140)",
        active: {
            color: "accent-1",
        },
        border: {
            side: "bottom",
            color: 'rgb(140,140,140)',
            active: {
                color: 'control'
            }
        }
    },
});

function App() {
    return (
        <AppProvider>
            <Grommet full theme={customTheme}>
                <Layout />
            </Grommet>
        </AppProvider>
    );
}

export default App;
