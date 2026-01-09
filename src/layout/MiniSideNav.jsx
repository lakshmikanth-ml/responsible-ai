// src/components/layout/MiniSideNav.jsx
import { Tooltip, IconButton, Box } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { FolderKanban, Users } from "lucide-react";
import { useSelector } from "react-redux";

const items = [
  { to: ['/app/model-catalog'], Icon: FolderKanban, label: 'Model Catalog' },
  { to: ['/app/admin'], Icon: Users, label: 'User Management' },
  { to: ['/app/transparencyexplainability'], Icon: FolderKanban, label: 'Transparency & Explainability' },
  { to: ['/app/privacyanddatasecurity'], Icon: FolderKanban, label: 'Privacy & Data Security' },
  { to: ['/app/accountability'], Icon: FolderKanban, label: 'Accountability' },
  { to: ['/app/fairnessandondiscrimination'], Icon: FolderKanban, label: 'Fairness & Non-Discrimination' },
  { to: ['/app/safetyandreliability'], Icon: FolderKanban, label: 'Safety & Reliability' },
  { to: ['/app/inclusiveness'], Icon: FolderKanban, label: 'Inclusiveness' },
  { to: ['/app/environmentsustainability'], Icon: FolderKanban, label: 'Environment & Sustainability' },

];

export default function MiniSideNav() {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const filteredMenuItems = user?.role === 'owner' ? items.filter(item => item.label !== 'User Management') : items;

  return (
    <Box
      sx={{
        position: 'fixed',
        left: 0,
        top: 64,
        height: 'calc(100vh - 64px)',
        width: 72,
        bgcolor: 'background.paper',
        borderRight: 1,
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 2,
        zIndex: 10,
      }}
    >
      {filteredMenuItems.map(({ to, Icon, label }) => {
        const active = to.some(path => location.pathname.startsWith(path));
        return (
          <Tooltip key={to} title={label} placement="right">
            <IconButton
              component={Link}
              to={to[0]}
              sx={{
                mb: 2,
                color: active ? 'primary.main' : 'text.secondary',
                bgcolor: active ? 'primary.50' : 'transparent',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <Icon />
            </IconButton>
          </Tooltip>
        );
      })}
    </Box>
  );
}