import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Popper from '@mui/material/Popper';
import Box from '@mui/material/Box';

// third party
import PopupState, { bindPopper, bindToggle } from 'material-ui-popup-state';

// project imports
import Transitions from 'ui-component/extended/Transitions';

import { forwardRef, HTMLAttributes, ReactNode } from 'react';

interface HeaderAvatarProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

const HeaderAvatar = forwardRef<HTMLDivElement, HeaderAvatarProps>(({ children, ...others }, ref) => {
  const theme = useTheme();

  return (
    <Avatar
      ref={ref}
      variant="rounded"
      sx={{
        ...theme.typography.commonAvatar,
        ...theme.typography.mediumAvatar,
        color: theme.vars.palette.secondary.dark,
        background: theme.vars.palette.secondary.light,
        '&:hover': {
          color: theme.vars.palette.secondary.light,
          background: theme.vars.palette.secondary.dark
        }
      }}
      {...others}
    >
      {children}
    </Avatar>
  );
});

HeaderAvatar.displayName = 'HeaderAvatar';

// ==============================|| SEARCH INPUT - MOBILE||============================== //

function MobileSearch({ value, setValue, popupState }) {
  const theme = useTheme();

  return (
    <OutlinedInput
      id="input-search-header"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Search"
      startAdornment={
        <InputAdornment position="start">
          <Box className="ri-search-line" sx={{ fontSize: '16px' }} />
        </InputAdornment>
      }
      endAdornment={
        <InputAdornment position="end">
          <HeaderAvatar>
            <Box className="ri-equalizer-line" sx={{ fontSize: '20px' }} />
          </HeaderAvatar>
          <Box sx={{ ml: 2 }}>
            <Avatar
              variant="rounded"
              sx={{
                ...theme.typography.commonAvatar,
                ...theme.typography.mediumAvatar,
                bgcolor: 'orange.light',
                color: 'orange.dark',
                '&:hover': { bgcolor: 'orange.dark', color: 'orange.light' }
              }}
              {...bindToggle(popupState)}
            >
              <Box className="ri-close-line" sx={{ fontSize: '20px' }} />
            </Avatar>
          </Box>
        </InputAdornment>
      }
      aria-describedby="search-helper-text"
      slotProps={{ input: { 'aria-label': 'weight', sx: { bgcolor: 'transparent', pl: 0.5 } } }}
      sx={{ width: '100%', ml: 0.5, px: 2, bgcolor: 'background.paper' }}
    />
  );
}

// ==============================|| SEARCH INPUT ||============================== //

export default function SearchSection() {
  const [value, setValue] = useState('');

  return (
    <>
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <PopupState variant="popper" popupId="demo-popup-popper">
          {(popupState) => (
            <>
              <Box sx={{ ml: 2 }}>
                <HeaderAvatar {...bindToggle(popupState)}>
                  <Box className="ri-search-line" sx={{ fontSize: '19.2px' }} />
                </HeaderAvatar>
              </Box>
              <Popper
                {...bindPopper(popupState)}
                transition
                sx={{ zIndex: 1100, width: '99%', top: '-55px !important', px: { xs: 1.25, sm: 1.5 } }}
              >
                {({ TransitionProps }) => (
                  <>
                    <Transitions type="zoom" {...TransitionProps} sx={{ transformOrigin: 'center left' }}>
                      <Card sx={{ bgcolor: 'background.default', border: 0, boxShadow: 'none' }}>
                        <Box sx={{ p: 2 }}>
                          <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                            <Grid size="grow">
                              <MobileSearch value={value} setValue={setValue} popupState={popupState} />
                            </Grid>
                          </Grid>
                        </Box>
                      </Card>
                    </Transitions>
                  </>
                )}
              </Popper>
            </>
          )}
        </PopupState>
      </Box>
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <OutlinedInput
          id="input-search-header"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search"
          startAdornment={
            <InputAdornment position="start">
              <Box className="ri-search-line" sx={{ fontSize: '16px' }} />
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment position="end">
              <HeaderAvatar>
                <Box className="ri-equalizer-line" sx={{ fontSize: '20px' }} />
              </HeaderAvatar>
            </InputAdornment>
          }
          aria-describedby="search-helper-text"
          slotProps={{ input: { 'aria-label': 'weight', sx: { bgcolor: 'transparent', pl: 0.5 } } }}
          sx={{ width: { md: 250, lg: 434 }, ml: 2, px: 2 }}
        />
      </Box>
    </>
  );
}

HeaderAvatar.propTypes = { children: PropTypes.node, others: PropTypes.any };

MobileSearch.propTypes = { value: PropTypes.string, setValue: PropTypes.func, popupState: PropTypes.any };
