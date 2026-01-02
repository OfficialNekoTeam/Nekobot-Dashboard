import { Link as RouterLink } from 'react-router-dom';

// material-ui
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project imports
import { DASHBOARD_PATH } from 'config';
import Logo from 'ui-component/Logo';

// ==============================|| MAIN LOGO ||============================== //

interface LogoSectionProps {
  drawerOpen?: boolean;
}

export default function LogoSection({ drawerOpen = true }: LogoSectionProps) {
  return (
    <Link component={RouterLink} to={DASHBOARD_PATH} aria-label="theme-logo">
      <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5 }}>
        <Logo />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: '1.1rem',
            letterSpacing: '-0.5px',
            color: 'text.primary',
            textDecoration: 'none',
            opacity: drawerOpen ? 1 : 0,
            transition: 'opacity 0.2s ease-in-out',
            whiteSpace: 'nowrap',
          }}
        >
          NekoBot WebUI
        </Typography>
      </Stack>
    </Link>
  );
}
