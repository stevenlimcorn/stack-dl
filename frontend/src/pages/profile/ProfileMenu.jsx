import { useState } from "react";
import { Chart, registerables } from "chart.js";
import { Bar } from "react-chartjs-2";
import { Box, Typography } from "@mui/material";

function ProfileMenu({ statistics }) {
    const [selected, setSelected] = useState("User Info");
    Chart.register(...registerables);
    const state = {
        labels: Object.keys(statistics),
        datasets: [
            {
                barPercentage: 0.3,
                minBarLength: 2,
                backgroundColor: ["red", "blue", "green"],
                borderColor: "rgba(0,0,0,1)",
                borderWidth: 2,
                data: Object.values(statistics),
            },
        ],
    };
    return (
        <Box>
            <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                <Bar
                    legend={{ display: false }}
                    data={state}
                    options={{
                        plugins: {
                            legend: {
                                display: false,
                            },
                            title: {
                                display: true,
                                text: "User Statistics",
                            },
                        },
                        responsive: true,
                        maintainAspectRatio: true,

                        tooltips: {
                            enabled: false,
                        },
                    }}
                />
            </Box>
        </Box>
    );
}

export default ProfileMenu;
