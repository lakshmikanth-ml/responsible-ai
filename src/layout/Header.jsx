import React from "react";
import {
  alpha,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  styled,
  useMediaQuery,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Box,

} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { ChevronRight } from "@mui/icons-material";
import PersonOutline from "@mui/icons-material/PersonOutline";
import Logout from "@mui/icons-material/Logout";
import Settings from "@mui/icons-material/Settings";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../instance";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Icon } from "@iconify/react";
import LogoFineTuninglight from "../assets/enkefalos_logo.png";
import ThemeToggle from "../components/switch/ThemeToggle";


export const drawerWidth = 250;
export const collapsedWidth = 72;
export const DEMO_CREDENTIALS = {
  email: "demo@example.com",
  password: "Demo@123",
};

export const validateDemoCredentials = (email, password) =>
  email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password;

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  width: "100%",

  backgroundColor: theme.palette.background.navbar,
  borderWidth: 0,
  borderColor: "#FCFDFFff",
  borderBottomWidth: "thin",
  borderBottom: "1px solid rgba(117, 117, 117, 0.2)",

  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  // Desktop styles when sidebar is open/collapsed
  [theme.breakpoints.up("md")]: {
    ...(open && {
      // marginLeft: `${drawerWidth}px`,
      // width: `calc(100% - ${drawerWidth}px)`,
    }),
    ...(!open && {
      marginLeft: `${collapsedWidth}px`,
      width: `calc(100% - ${collapsedWidth}px)`,
    }),
  },
  // Mobile styles
  [theme.breakpoints.down("md")]: {
    width: "100%",
    marginLeft: 0,
  },
}));

export default function Header({ onMenuClick, open = true, user, mobileOpen }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch();
  const showMenuButton = isMobile || !open;
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state?.auth);

  // notifications menu
  const [notifAnchor, setNotifAnchor] = React.useState(null);
  const notifOpen = Boolean(notifAnchor);
  const notifications = [
    { id: 1, title: "Sync complete", desc: "Claims DB finished syncing" },
    { id: 2, title: "Schema update", desc: "New column detected in policies" },
  ];

  const handleNotifOpen = (e) => setNotifAnchor(e.currentTarget);
  const handleNotifClose = () => setNotifAnchor(null);

  // profile menu
  const [profileAnchor, setProfileAnchor] = React.useState(null);
  const profileOpen = Boolean(profileAnchor);
  const displayName = user?.name || localStorage.getItem("userName") || "";
  const avatarUrl = user?.avatarUrl || "";

  const handleProfileOpen = (e) => setProfileAnchor(e.currentTarget);
  const handleProfileClose = () => setProfileAnchor(null);

  const handleGotoProfile = () => {
    handleProfileClose();
    navigate("/app/profile");
  };

  React.useEffect(() => {
    const storedEmail = localStorage.getItem("demoEmail");
    const storedPassword = localStorage.getItem("demoPassword");
    if (storedEmail && storedPassword) {
      const valid = validateDemoCredentials(storedEmail, storedPassword);
      if (!valid) {
        dispatch({ type: "RESET_APP" });
        axiosInstance.defaults.headers.common["Authorization"] = "";
        localStorage.removeItem("demoEmail");
        localStorage.removeItem("demoPassword");
        navigate("/", { replace: true });
      }
    }
  }, [dispatch, navigate]);

  const handleLogout = () => {
    handleProfileClose();
    // default logout behavior - customize as needed
    dispatch({ type: "RESET_APP" });
    axiosInstance.defaults.headers.common["Authorization"] = "";
    localStorage.removeItem("demoEmail");
    localStorage.removeItem("demoPassword");
    navigate("/", { replace: true });
  };

  // show hamburger when:
  // - mobile (always), OR
  // - desktop and sidebar is collapsed (so user can expand it)
  return (
    <StyledAppBar elevation={0} open={open}>
      <Toolbar sx={{
        minHeight: 64,
        pr: { xs: 1, md: "8px" },
        pl: { xs: 1, md: "8px" },
        // minHeight: "62px !important",
        //     borderBottom:"1px solid ${theme.palette.divider}",
      }}>
        {/* {showMenuButton && ( */}

        {/* )} */}
        {/* Mobile menu button */}
        {/* {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )} */}

        {/* Desktop menu button when sidebar is collapsed */}
        {/* {!isMobile && !open && (
          <IconButton
            color="inherit"
            aria-label="expand drawer"
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )} */}

        <Box sx={{ display: "flex", alignItems: "center",
         
         }}>
          {!isMobile && open && <img
            src={
              theme.palette.mode === "dark"
                ? LogoFineTuninglight
                : LogoFineTuninglight
            }
            alt="Logo"
            style={{ width: "180px", height: "auto" }}
          />}
          <Box sx={{
            
            marginLeft: showMenuButton ?
              "0px" : "20px"
          }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={onMenuClick}
              edge="start"
              sx={{
                mr: 0,
                display: "inline-flex", width: 30,
                height: 30,
                borderRadius: 1,
                color: isDark ? theme.palette.text.secondary : theme.palette.grey[700],
                backgroundColor: isDark ? alpha(theme.palette.grey[700], 0.7) : "#f0f0f0ff",
                "&:hover": {
                  backgroundColor: isDark ? alpha(theme.palette.grey[700], 1) : "#ebebebff",
                },
              }}
              size="small"
            >
              <Icon
                icon={
                  showMenuButton
                    ? "line-md:menu-fold-right" : "line-md:menu-fold-left"


                }
                width={20}
                height={20}
                style={{
                  transition: "transform 0.25s ease",
                }}
              />
              {/* <MenuIcon /> */}
            </IconButton>
          </Box>
        </Box>


        <Typography variant="h6" noWrap component="div"
          sx={{ flexGrow: 1, fontWeight: 600, opacity: 0 }}>
          G
        </Typography>

        {/* Right-side actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>

          <ThemeToggle />

          {/* Profile / Avatar */}
          <IconButton onClick={handleProfileOpen} size="small" sx={{ ml: 0 }}>
            <Avatar src={avatarUrl}
              sx={(theme) => ({
                width: 36,
                height: 36,
                fontSize: 14,
                borderRadius: "50%",
                background: theme.palette.primary.main,
              })}>


              {(!avatarUrl && isLoggedIn?.user?.username ?
                isLoggedIn?.user?.username?.charAt(0) : "")}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={profileAnchor}
            open={profileOpen}
            onClose={handleProfileClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{ sx: { width: 220 } }}
          >
            <Box sx={{ px: 2, py: 1.25 }}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {isLoggedIn?.user?.username || "Demo"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {isLoggedIn?.user?.email || ""}
              </Typography>
            </Box>

            <Divider />

            {/* <MenuItem onClick={handleGotoProfile}>
              <ListItemIcon>
                <PersonOutline fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>

            <MenuItem onClick={() => { handleProfileClose(); navigate("/app/settings"); }}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>

            <Divider /> */}

            <MenuItem onClick={handleLogout} sx={{ color: "text.secondary" }}>
              <ListItemIcon>
                <Logout fontSize="small" sx={{ color: "text.secondary" }} />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
}
