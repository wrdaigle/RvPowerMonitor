import React from "react";

import LatestData from "./LatestData";
import ChartTabs from "./ChartTabs";
import TimeSpanSelector from "./TimeSpanSelector";
import { Box, Grid } from "grommet";

function Layout() {
    return (
        <Box fill background="dark-1">
            <Grid fill rows={["6fr","auto", "3fr"]}>
                <ChartTabs />
                <TimeSpanSelector />
                {/* <></> */}
                <LatestData />
            </Grid>
        </Box>
    );
}

export default Layout;
