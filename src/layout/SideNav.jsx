// src/components/layout/SideNav.jsx
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Box,
  useTheme,
  useMediaQuery,
  styled, Tooltip,
  Typography,
  alpha
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useLocation } from "react-router-dom";
// import data_foundation from "../assets/data_foundation-2.svg";
import {
  Brain,
  Database,
  LayersIcon,
  ChartNoAxesColumnIncreasing,
  Users,
  CreditCard
} from "lucide-react";
import { FolderKanban, BookImage, Calculator } from "lucide-react";
import { useSelector } from "react-redux";
import LogoFineTuningdark from "../assets/GenAIFoundry inverted Logo final.svg";
import LogoFineTuninglight from "../assets/enkefalos_logo.png";
import LogoShort from '../components/logo/logo-short';
import { Icon } from "@iconify/react";

// import icon from "../assets/logo.png"

const drawerWidth = 250;
const collapsedWidth = 72;

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: open ? drawerWidth : collapsedWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",

  "& .MuiDrawer-paper": {
    width: open ? drawerWidth : collapsedWidth,
    backgroundColor: theme.palette.background.paper,
    // borderRight: `1px solid ${theme.palette.divider}`,
    boxShadow: "none",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
  },
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: "8px",
  // borderBottom: `1px solid ${theme.palette.divider}`,
  ...theme.mixins.toolbar,
}));

const menuItems = [
  // { to: ['/app/roi'], Icon: Calculator,
  //   label: 'Roi Calculator' },
  {
    to: ['/app/transparencyexplainability'],
    Icon: Calculator,
    label: 'Transparency Explainability'
  },
  {
    to: ['/app/fairnessandondiscrimination'],
    Icon: Calculator,
    label: `Fairness &
     Non-Discrimination`
  },
  {
    to: ['/app/privacyanddatasecurity'],
    Icon: CreditCard,
    label: 'Privacy & Data Security'
  },
  {
    to: ['/app/accountability'],
    Icon: Database,
    label: 'Accountability'
  },

  {
    to: ['/app/safetyandreliability'],
    Icon: Database,
    label: 'Safety & Reliability'
  },
  {
    to: ['/app/inclusiveness'],
    Icon: Database,
    label: 'Inclusiveness'
  },
  {
    to: ['/app/environmentsustainability'],
    Icon: Database,
    label: 'Environment & Sustainability'
  }
];

export default function SideNav({
  mobileOpen,
  onClose,
  collapsed,
  toggleCollapse,
}) {
  const location = useLocation();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user } = useSelector((state) => state.auth);

  const finalCollapsed = isMobile ? false : collapsed;

  // Navbar tokens (same page, no theme override)
  const navbarBg = theme.palette.background.paper;
  const navbarBorder = theme.palette.divider;

  const itemHoverBg = isDark
    ? alpha(theme.palette.common.white, 0.04)
    : alpha(theme.palette.common.black, 0.04);

  const itemActiveBg = isDark
    ? "linear-gradient(to right, rgba(1,144,254,0.12), rgba(1,144,254,0.08))"
    : "linear-gradient(to right, rgb(232,241,255), rgb(248,251,255))";

  const itemActiveColor = theme.palette.primary.main;

  const drawerContent = (
    <>
      <DrawerHeader>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            justifyContent: finalCollapsed ? "center" : "space-between",
            px: finalCollapsed ? 0 : 1,
          }}
        >
          {!finalCollapsed && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <img
                src={isDark ? LogoFineTuningdark : LogoFineTuninglight}
                alt="Logo"
                style={{ width: "180px" }}
              />
            </Box>
          )}

          {!isMobile && (
            finalCollapsed ? (
              <LogoShort />
            ) : (
              <IconButton
                onClick={toggleCollapse}
                size="small"
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: 1,
                  color: theme.palette.text.secondary,
                  backgroundColor: isDark
                    ? alpha(theme.palette.common.white, 0.06)
                    : alpha(theme.palette.common.black, 0.04),
                  "&:hover": {
                    backgroundColor: isDark
                      ? alpha(theme.palette.common.white, 0.1)
                      : alpha(theme.palette.common.black, 0.08),
                  },
                }}
              >
                <Icon
                  icon="line-md:menu-fold-left"
                  width={20}
                  height={20}
                />
              </IconButton>
            )
          )}
        </Box>
      </DrawerHeader>

      <Divider />

      <List sx={{ px: 1, pt: 1 }}>
        {menuItems.map(({ to, label, Icon: MenuIcon }) => {
          const isActive = to.some((path) =>
            location.pathname.startsWith(path)
          );

          return (
            <ListItem key={to[0]} disablePadding sx={{ mb: 0.5 }}>
              <Tooltip title={finalCollapsed ? label : ""} placement="right">
                <ListItemButton
                  component={Link}
                  to={to[0]}
                  selected={isActive}
                  onClick={onClose}
                  sx={{
                    borderRadius: "999px",
                    py: "6px",
                    px: "12px",
                    color: theme.palette.text.secondary,

                    "&:hover": {
                      backgroundColor: itemHoverBg,
                    },

                    ...(isActive && {
                      background: itemActiveBg,
                      color: itemActiveColor,
                      fontWeight: 500,

                      "&:hover": {
                        background: itemActiveBg,
                      },

                      "& .MuiListItemIcon-root": {
                        color: itemActiveColor,
                      },
                    }),
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth:
                        finalCollapsed ? "auto" : 24,
                      color: "inherit",
                    }}
                  >
                    <MenuIcon size={18} />
                  </ListItemIcon>

                  {!finalCollapsed && (
                    <ListItemText
                      primary={label}
                      // primaryTypographyProps={{
                      //   fontSize: "0.875rem",
                      //   fontWeight: isActive ? 500 : 400,
                      // }}
                      primaryTypographyProps={{
                        fontSize: "0.875rem",
                        fontWeight: isActive ? 500 : 400,
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                        overflowWrap: "anywhere",
                        lineHeight: 1.3,
                      }}

                    />
                  )}

                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>
    </>
  );

  // Mobile drawer
  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
          onBackdropClick: onClose
        }}
        sx={{
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  // Desktop drawer
  return (
    <StyledDrawer variant="permanent" open={!finalCollapsed}>
      {drawerContent}
    </StyledDrawer>
  );
}
