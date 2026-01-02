import { useEffect, useRef, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import useConfig from 'hooks/useConfig';
import { useAuth } from 'contexts/AuthContext';
import { useNavigate } from 'react-router';

// assets
import User1 from 'assets/images/users/user-round.svg';

// ==============================|| PROFILE MENU ||============================== //

export default function ProfileSection() {
  const theme = useTheme();
  const {
    state: { borderRadius }
  } = useConfig();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setOpen(false);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <Tooltip title="用户菜单">
        <IconButton
          ref={anchorRef}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          aria-label="user-menu"
          sx={{
            ml: 1,
            width: 40,
            height: 40,
            borderRadius: '50%',
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            '&:hover': {
              bgcolor: 'action.hover',
            },
          }}
        >
          <Box className="ri-user-3-line" sx={{ fontSize: '20px' }} />
        </IconButton>
      </Tooltip>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 14]
            }
          }
        ]}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Transitions in={open} {...TransitionProps}>
              <Paper>
                {open && (
                  <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                    {/* 用户信息 */}
                    <Box sx={{ p: 2, pb: 1 }}>
                      <Stack spacing={0.5}>
                        <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5 }}>
                          <Typography variant="h5">你好,</Typography>
                          <Typography component="span" variant="h5" sx={{ fontWeight: 600 }}>
                            {user?.username || 'User'}
                          </Typography>
                        </Stack>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          管理员
                        </Typography>
                      </Stack>
                    </Box>

                    <Divider />

                    {/* 菜单选项 */}
                    <Box sx={{ p: 1 }}>
                      <List
                        component="nav"
                        sx={{
                          width: '100%',
                          py: 0,
                          borderRadius: `${borderRadius}px`,
                          '& .MuiListItemButton-root': {
                            borderRadius: `${borderRadius}px`,
                            mx: 0.5,
                          },
                        }}
                      >
                        <ListItemButton
                          sx={{ borderRadius: `${borderRadius}px` }}
                          onClick={() => {
                            setOpen(false);
                            navigate('/settings/reset-password');
                          }}
                        >
                          <ListItemIcon>
                            <Box className="ri-lock-password-line" sx={{ fontSize: '20px' }} />
                          </ListItemIcon>
                          <ListItemText primary={<Typography variant="body2">重置密码</Typography>} />
                        </ListItemButton>
                        <ListItemButton
                          sx={{ borderRadius: `${borderRadius}px` }}
                          onClick={handleLogout}
                        >
                          <ListItemIcon>
                            <Box className="ri-logout-box-r-line" sx={{ fontSize: '20px' }} />
                          </ListItemIcon>
                          <ListItemText primary={<Typography variant="body2">退出登录</Typography>} />
                        </ListItemButton>
                      </List>
                    </Box>
                  </MainCard>
                )}
              </Paper>
            </Transitions>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  );
}
