import PropTypes from 'prop-types';
import { cloneElement, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import MuiAppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';

// project imports
import Logo from 'ui-component/Logo';
import RemixIcon from 'ui-component/RemixIcon';

function ElevationScroll({ children, window }) {
  const theme = useTheme();
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window
  });

  return cloneElement(children, {
    elevation: trigger ? 1 : 0,
    style: {
      backgroundColor: theme.vars.palette.background.default,
      color: (theme.vars.palette.text as any).dark
    }
  });
}

// ==============================|| MINIMAL LAYOUT APP BAR ||============================== //

export default function AppBar({ ...others }) {
  const [drawerToggle, setDrawerToggle] = useState(false);

  const drawerToggler = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerToggle(open);
  };

  return (
    <ElevationScroll {...others} window={undefined}>
      <MuiAppBar>
        <Container>
          <Toolbar sx={{ py: 2.5, px: `0 !important` }}>
            <Typography component={RouterLink} to="/" sx={{ flexGrow: 1, textAlign: 'left' }}>
              <Logo />
            </Typography>
            <Stack direction="row" sx={{ gap: { xs: 1.5, md: 2.5 }, display: { xs: 'none', sm: 'flex' } }}>
              <Button color="inherit" component={Link} href="#">
                Home
              </Button>
              <Button color="inherit" component={RouterLink} to="/login" target="_blank">
                Dashboard
              </Button>
              <Button color="inherit" component={Link} href="https://codedthemes.gitbook.io/berry" target="_blank">
                Documentation
              </Button>
              <Button component={Link} href="https://links.codedthemes.com/hsqll" disableElevation variant="contained" color="secondary">
                Purchase Now
              </Button>
            </Stack>
            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
              <IconButton color="inherit" onClick={drawerToggler(true)} size="large">
                <RemixIcon icon="ri-menu-line" size={24} />
              </IconButton>
              <Drawer anchor="top" open={drawerToggle} onClose={drawerToggler(false)}>
                {drawerToggle && (
                  <Box sx={{ width: 'auto' }} role="presentation" onClick={drawerToggler(false)} onKeyDown={drawerToggler(false)}>
                    <List>
                      <Link sx={{ textDecoration: 'none' }} href="#" target="_blank">
                        <ListItemButton component="a">
                          <ListItemIcon>
                            <Box className="ri-home-line" sx={{ fontSize: '20px' }} />
                          </ListItemIcon>
                          <ListItemText primary="Home" />
                        </ListItemButton>
                      </Link>
                      <Link sx={{ textDecoration: 'none' }} href="/login" target="_blank">
                        <ListItemButton component="a">
                          <ListItemIcon>
                            <Box className="ri-dashboard-line" sx={{ fontSize: '20px' }} />
                          </ListItemIcon>
                          <ListItemText primary="Dashboard" />
                        </ListItemButton>
                      </Link>
                      <Link sx={{ textDecoration: 'none' }} href="https://codedthemes.gitbook.io/berry" target="_blank">
                        <ListItemButton component="a">
                          <ListItemIcon>
                            <Box className="ri-book-line" sx={{ fontSize: '20px' }} />
                          </ListItemIcon>
                          <ListItemText primary="Documentation" />
                        </ListItemButton>
                      </Link>
                      <Link sx={{ textDecoration: 'none' }} href="https://links.codedthemes.com/hsqll" target="_blank">
                        <ListItemButton component="a">
                          <ListItemIcon>
                            <Box className="ri-bank-card-line" sx={{ fontSize: '20px' }} />
                          </ListItemIcon>
                          <ListItemText primary="Purchase Now" />
                        </ListItemButton>
                      </Link>
                    </List>
                  </Box>
                )}
              </Drawer>
            </Box>
          </Toolbar>
        </Container>
      </MuiAppBar>
    </ElevationScroll>
  );
}

ElevationScroll.propTypes = { children: PropTypes.node, window: PropTypes.any };
