/**
 * 登录页面
 */

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { flushSync } from 'react-dom';

// material-ui
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project imports
import { useAuth } from '../../contexts/AuthContext';
import AnimateButton from '../../ui-component/extended/AnimateButton';

// assets
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

// ==============================|| LOGIN PAGE ||============================== //

export default function LoginPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  // 如果已登录，重定向到首页
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, location, navigate]);

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
    submit?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // 清除对应字段的错误
    setErrors((prev) => ({ ...prev, [name]: undefined, submit: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    // 验证
    const newErrors: typeof errors = {};
    if (!formData.username) {
      newErrors.username = '请输入用户名';
    }
    if (!formData.password) {
      newErrors.password = '请输入密码';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      await login(formData);
      // 登录成功后立即导航
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error: any) {
      setErrors({ submit: error.message || '登录失败，请检查用户名和密码' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: theme.palette.background.default,
        p: 2,
      }}
    >
      <Grid container sx={{ justifyContent: 'center' }}>
        <Grid size={{ xs: 12, sm: 10, md: 8, lg: 6, xl: 4 }}>
          <Card>
            <Box
              sx={{
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography variant="h3" sx={{ mb: 1, fontWeight: 600 }}>
                NekoBot Dashboard
              </Typography>
              <Typography variant="body2" sx={{ mb: 4, color: 'text.secondary' }}>
                登录以访问管理面板
              </Typography>

              <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                <FormControl fullWidth error={!!errors.username} sx={{ mb: 3 }}>
                  <InputLabel htmlFor="username">用户名</InputLabel>
                  <OutlinedInput
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    label="用户名"
                    placeholder="请输入用户名"
                    autoComplete="username"
                    autoFocus
                  />
                  {errors.username && <FormHelperText>{errors.username}</FormHelperText>}
                </FormControl>

                <FormControl fullWidth error={!!errors.password} sx={{ mb: 3 }}>
                  <InputLabel htmlFor="password">密码</InputLabel>
                  <OutlinedInput
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          size="large"
                        >
                          {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="密码"
                    placeholder="请输入密码"
                    autoComplete="current-password"
                  />
                  {errors.password && <FormHelperText>{errors.password}</FormHelperText>}
                </FormControl>

                <Stack direction="row" sx={{ mb: 3, alignItems: 'center', justifyContent: 'space-between' }}>
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="记住我"
                  />
                </Stack>

                {errors.submit && (
                  <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                    {errors.submit}
                  </Typography>
                )}

                <Box sx={{ mt: 2 }}>
                  <AnimateButton>
                    <Button
                      disableElevation
                      disabled={isSubmitting}
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                      color="primary"
                    >
                      {isSubmitting ? '登录中...' : '登录'}
                    </Button>
                  </AnimateButton>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                NekoBot Team © 2024
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
