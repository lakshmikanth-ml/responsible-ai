import React from 'react'
import { Box, Typography, Paper } from "@mui/material";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";

const Index = () => {
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            minHeight="60vh"
        >
            <Paper
                elevation={0}
                sx={{
                    p: 6,
                    textAlign: "center",
                    borderRadius: 3,
                    maxWidth: 520,
                    border: "1px dashed",
                    borderColor: "divider",
                }}
            >
                <GavelOutlinedIcon
                    sx={{ fontSize: 56, color: "text.secondary", mb: 2 }}
                />


                <Typography variant="h5" fontWeight={700} gutterBottom>
                    Fairness & Non-Discrimination
                </Typography>


                <Typography variant="body1" color="text.secondary" gutterBottom>
                    This module is currently under development.
                </Typography>




                <Typography
                    variant="caption"
                    display="block"
                    color="text.secondary"
                    sx={{ mt: 3 }}
                >
                    🚧 Coming Soon
                </Typography>
            </Paper>
        </Box>
    )
}

export default Index
