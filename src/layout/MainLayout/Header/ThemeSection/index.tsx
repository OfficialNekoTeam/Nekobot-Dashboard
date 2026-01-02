// material-ui
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { useColorScheme, useTheme } from '@mui/material/styles';

// ==============================|| THEME SECTION ||============================== //

export default function ThemeSection() {
  const theme = useTheme();
  const { mode, setMode } = useColorScheme();

  const handleToggle = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  return (
    <Tooltip title={mode === 'light' ? '切换到深色模式' : '切换到浅色模式'}>
      <Box sx={{ ml: 2 }}>
        <Avatar
          variant="rounded"
          sx={{
            ...theme.typography.commonAvatar,
            ...theme.typography.mediumAvatar,
            transition: 'all .2s ease-in-out',
            color: theme.vars.palette.info.dark,
            background: theme.vars.palette.info.light,
            '&:hover': {
              color: theme.vars.palette.info.light,
              background: theme.vars.palette.info.dark
            }
          }}
          onClick={handleToggle}
          aria-label="toggle theme"
        >
          <Box
            className={mode === 'light' ? 'ri-moon-line' : 'ri-sun-line'}
            sx={{ fontSize: '20px' }}
          />
        </Avatar>
      </Box>
    </Tooltip>
  );
}
