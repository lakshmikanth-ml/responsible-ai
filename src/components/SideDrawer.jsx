import { useEffect, useState } from "react";
import { Drawer, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

/**
 * Reusable side drawer with optional resize toggle and sticky footer.
 */
export default function SideDrawer({
  open,
  onClose,
  title,
  subtitle,
  allowResize = true,
  anchor = "right",
  initialSize = "half",
  paperSx,
  headerActions,
  children,
  footer,
}) {
  const [drawerSize, setDrawerSize] = useState(initialSize);

  useEffect(() => {
    if (open) setDrawerSize(initialSize);
  }, [open, initialSize]);

  const toggleSize = (e) => {
    e.stopPropagation();
    setDrawerSize((prev) => (prev === "full" ? "half" : "full"));
  };

  const widthMap = {
    full: "100%",
    half: { xs: "100%", sm: "50%", md: "50%" },
    default: { xs: "100%", sm: "640px", md: "640px" },
  };

  const mergedPaperSx = {
    p: 2,
    top: 0,
    transition: "width 240ms ease",
    width: widthMap[drawerSize] || widthMap.default,
    ...paperSx,
  };

  return (
    <Drawer
      anchor={anchor}
      open={open}
      onClose={onClose}
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 2 }}
      PaperProps={{ sx: mergedPaperSx }}
      ModalProps={{ keepMounted: true }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Box>
            {title && (
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="caption" >
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
            {headerActions}
            {allowResize && (
              <IconButton size="small" onClick={toggleSize}>
                {drawerSize === "full" ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
            )}
            <IconButton size="small" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ flex: 1, overflowY: "auto", p: 1 }}>{children}</Box>

        {footer && (
          <Box
            sx={{
              position: "sticky",
              bottom: 0,
              bgcolor: "background.paper",
              borderTop: "1px solid",
              borderColor: "divider",
              p: 2,
            }}
          >
            {footer}
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
