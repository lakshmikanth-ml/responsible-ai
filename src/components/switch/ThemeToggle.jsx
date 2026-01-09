import { Box, Switch, Tooltip, IconButton, useTheme } from "@mui/material";
import { Sun, Moon } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
// import { useSettingsContext } from "../settings";
import { toggleMode } from "../../redux/slices/theme";


export default function ThemeToggle() {
    const { mode } = useSelector(state => state.theme);
    const dispatch = useDispatch();
    const theme = useTheme();
    // const settings = useSettingsContext()
    const isDarkMode = theme.palette.mode === "dark";

    return (
        <Tooltip title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"} arrow>
            <IconButton
                onClick={() => dispatch(toggleMode())}
                sx={{
                    p: 1,
                    borderRadius: '50%',
                    backgroundColor: isDarkMode ? theme.palette.grey[800] : theme.palette.grey[200],
                    '&:hover': { backgroundColor: isDarkMode ? theme.palette.grey[700] : theme.palette.grey[300] },
                }}
            >
                {isDarkMode ? (
                    <Sun size={20} color={theme.palette.warning.main} />
                ) : (
                    <Moon size={20} color={theme.palette.text.secondary} />
                )}
            </IconButton>
        </Tooltip>
    );
}