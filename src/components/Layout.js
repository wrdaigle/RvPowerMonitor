import React, { useEffect, useState } from "react";

import LatestData from "./LatestData";
import ChartTabs from "./ChartTabs";
import TimeSpanSelector from "./TimeSpanSelector";
import { Box, Grid } from "grommet";

function Layout() {
    const [isPortrait, set_isPortrait] = useState(window.innerHeight > window.innerWidth);

    const handleWindowResize = () => {
        set_isPortrait(window.innerHeight > window.innerWidth);
    };

    useEffect(() => {
        window.addEventListener("resize", handleWindowResize);
        return () => window.removeEventListener("resize", handleWindowResize);
    }, []);

    const chartHeight = isPortrait ? "3fr" : "6fr";
    console.debug(chartHeight)
    return (
        <Box fill background="dark-1">
            <Grid fill rows={[chartHeight, "auto", "2fr"]}>
                <ChartTabs />
                <TimeSpanSelector />
                <LatestData isPortrait={isPortrait} />
                <></>
            </Grid>
        </Box>
    );
}

export default Layout;
