// src/components/layout/Layout.jsx
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import SideNav from './SideNav';
import { Box, useTheme, useMediaQuery } from '@mui/material';

// Sidebar width constants
const drawerWidth = 250;
const collapsedWidth = 72;

export default function Layout() {
  const theme = useTheme();
  const darkMode = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  return (
    <Box sx={{
      display: 'flex', minHeight: '100vh',
     background: darkMode ? 'unset' : "rgb(244, 250, 255)"
      // background: darkMode ? 'unset' : 'linear-gradient(to bottom, #F4FAFF80, #F8FBFD, #FCFCFC)'
    }}>
      <Header
        onMenuClick={handleDrawerToggle}
        open={!collapsed}
        mobileOpen={mobileOpen}
      />
      <SideNav
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        collapsed={collapsed}
        toggleCollapse={() => setCollapsed(!collapsed)}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: { xs: 2, md: 3 },
          py: { xs: 2, md: 3 },
          width: {
            xs: '100%',
            md: `calc(100% - ${collapsed ?
              collapsedWidth : drawerWidth}px)`
          },
          ml: {
            xs: 0,
            // md: collapsed ? `${collapsedWidth}px` : `${drawerWidth}px`
          },
          maxWidth: { xs: '100%', lg: '1440px' },
          mx: { xs: 0, lg: 'auto' },
          mt: { xs: 8, lg: '66px' }, // Space for the fixed header
          transition: (theme) =>
            theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
