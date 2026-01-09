import React, { useEffect, useState } from "react";
import {
    Box,
    Drawer,
    Divider,
    Typography,
    IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

/**
 * ReusableDrawer
 * --------------------------------------------------
 * Generic, reusable drawer shell with:
 * - Right-anchored drawer
 * - Single-click half/full toggle
 * - Smooth width transition
 * - Header + content slot
 *
 * This component intentionally contains NO business logic
 * and can be reused for Users, Projects, Jobs, Settings, etc.
 */
export default function ReusableDrawer({
    open,
    title,
    onClose,
    children,
    size = "default", // 'default' | 'half' | 'full'
    showToggle = true,
    zIndexOffset = 2,
}) {
    const [drawerSize, setDrawerSize] = useState(size);

    useEffect(() => {
        setDrawerSize(size);
    }, [size]);

    const toggleHalfFull = (e) => {
        e.stopPropagation();
        setDrawerSize((prev) => (prev === "full" ? "half" : "full"));
    };

    const paperSx = {
        p: 2,
        height: "100vh",
        top: 0,
        overflow: "auto",
        transition: "width 240ms ease",
        width:
            drawerSize === "full"
                ? "100%"
                : drawerSize === "half"
                    ? { xs: "100%", sm: "50%", md: "50%" }
                    : { xs: "100%", sm: 640, md: 640 },
    };

    return (
        <Drawer
            anchor="right"
            open={Boolean(open)}
            onClose={onClose}
            sx={{ zIndex: (theme) => theme.zIndex.drawer + zIndexOffset }}
            PaperProps={{ sx: paperSx }}
            ModalProps={{ keepMounted: true }}
        >
            {/* Header */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography variant="subtitle1" sx={{ flex: 1 }}>
                    {title}
                </Typography>

                {showToggle && (
                    <IconButton size="small" onClick={toggleHalfFull}>
                        {drawerSize === "full" ? <FullscreenExitIcon /> : <FullscreenIcon />}
                    </IconButton>
                )}

                <IconButton size="small" onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <Divider sx={{ mb: 1.6 }} />

            {/* Content */}
            {children}
        </Drawer>
    );
}
