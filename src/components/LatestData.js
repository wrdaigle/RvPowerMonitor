import React, { useContext } from "react";
import appContext from "../context/appContext";

import { Box, Grid, Meter, Stack, Text } from "grommet";

function LatestData({ isPortrait }) {
    const { powerData } = useContext(appContext);
    if (!powerData) return null;

    const batteryPercentage =
        (100 * powerData.latestData.amphours) / powerData.batteryCapacity;
    const amps = powerData.latestData.watts / powerData.latestData.voltage;
    const rows = isPortrait ? ["1/2", "1/2"] : ['auto'];
    const columns = isPortrait ? ["1/2", "1/2"] : ["1/4", "1/4", "1/4", "1/4"];

    return (
        <Grid fill columns={columns} rows={rows} pad="medium">
            <Box align="center" justify="center" direction="row">
                <Text size="xxlarge" weight="bold" color="accent-1">
                    {Math.round(powerData.latestData.watts * 10) / 10}
                </Text>
                <Text>&nbsp;watts</Text>
            </Box>
            <Box align="center" justify="center" direction="row">
                <Text size="xxlarge" weight="bold" color="accent-1">
                    {Math.round(amps * 100) / 100}
                </Text>
                <Text>&nbsp;amps</Text>
            </Box>
            <Box align="center" justify="center" direction="row">
                <Text size="xxlarge" weight="bold" color="accent-1">
                    {Math.round(powerData.latestData.voltage * 10) / 10}
                </Text>
                <Text>&nbsp;volts</Text>
            </Box>
            <Box>
                <Stack fill anchor="center">
                    <Box fill align="center">
                        <Meter
                            size="small"
                            type="circle"
                            background="dark-2"
                            values={[
                                {
                                    value: batteryPercentage,
                                    color: "accent-1",
                                },
                            ]}
                        />
                    </Box>
                    <Box align="center" direction="row">
                        <Text size="xxlarge" weight="bold">
                            {Math.round(batteryPercentage, 0)}
                        </Text>
                        <Text>%</Text>
                    </Box>
                </Stack>
            </Box>
        </Grid>
    );
}

export default LatestData;
