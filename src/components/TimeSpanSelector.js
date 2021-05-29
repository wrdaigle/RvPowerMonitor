import React, { useContext } from "react";
import appContext from "../context/appContext";

import { Box, RadioButtonGroup, Text } from "grommet";



function TimeSpanSelector() {
    const { chartTimeSpan, setChartTimeSpan, fetching } = useContext(appContext);
    return (
        <Box align="end">
            <RadioButtonGroup

                name="radio"
                direction="row"
                gap="small"
                pad={{right:'medium'}}
                options={[
                    {
                        disabled:fetching,
                        value: 2,
                        label: "2 hours",
                    },
                    {
                        disabled:fetching,
                        value: 6,
                        label: "6 hours",
                    },
                    {
                        disabled:fetching,
                        value: 24,
                        label: "1 day",
                    },
                    {
                        disabled:fetching,
                        value: 72,
                        label: "3 days",
                    },
                    {
                        disabled:fetching,
                        value: 168,
                        label: "1 week",
                    },
                    {
                        disabled:fetching,
                        value: 672,
                        label: "4 weeks",
                    },
                ]}
                value={chartTimeSpan}
                onChange={(event) => {
                    setChartTimeSpan(event.target.value);
                }}
            >
                {(option, { checked, hover }) => {
                    let background;
                    if (checked) background = "accent-1";
                    else if (hover && !fetching) background = "dark-4";
                    else background = "dark-2";
                    return (
                        <Box background={background} pad="xsmall">
                            <Text size='xsmall'> {option.label}</Text>
                        </Box>
                    );
                }}
            </RadioButtonGroup>
        </Box>
    );
}

export default TimeSpanSelector;
