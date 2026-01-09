import React from "react";
import { Box } from "@mui/material";
import PreLoadImage from "../../assets/enk-icon 1.svg";

export default function Preloader() {
    return (
        <Box
            sx={{
                position: "fixed",
                inset: 0,
                height: "100vh",
                display: "grid",
                placeItems: "center",
                // bgcolor: "rgba(0,0,0,1)", // replace with your theme color if needed
                zIndex: 9999,
            }}
        >
            <Box
                sx={{
                    width: 80,
                    height: 80,
                    animation: "imageBeat 2s infinite ease",
                    "@keyframes imageBeat": {
                        "0%, 100%": { transform: "scale(1)" },
                        "50%": { transform: "scale(1.1)" },
                    },
                }}
            >
                <Box
                    component="img"
                    src={PreLoadImage}
                    alt="loading"
                    sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                    }}
                />
            </Box>
        </Box>
    );
}
