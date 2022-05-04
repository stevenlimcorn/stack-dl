import React from "react";
import { Backdrop, CircularProgress } from "@mui/material";

function Spinner({ isLoading }) {
    return (
        <div>
            <Backdrop
                sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
}

export default Spinner;
