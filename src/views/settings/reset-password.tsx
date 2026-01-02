/**
 * 重置密码页面
 */

import { useState } from 'react';

// material-ui
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

// project imports
import { useAuth } from 'contexts/AuthContext';
import { useNavigate } from 'react-router';
import { changePassword } from 'api';
import RemixIcon from 'ui-component/RemixIcon';

// ==============================|| RESET PASSWORD PAGE ||============================== //

export default function ResetPasswordPage() {
  const theme = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 验证输入
    if (!oldPassword || !newPassword || !confirmPassword) {
      showMessage('error', '请填写所有字段');
      return;
    }

    if (newPassword !== confirmPassword) {
      showMessage('error', '两次输入的新密码不一致');
      return;
    }

    if (newPassword.length < 6) {
      showMessage('error', '新密码长度至少为6位');
      return;
    }

    try {
      setLoading(true);
      const response = await changePassword({
        old_password: oldPassword,
        new_password: newPassword,
      });

      if (response.success) {
        showMessage('success', '密码修改成功');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        showMessage('error', response.message || '密码修改失败');
      }
    } catch (err: any) {
      showMessage('error', err.response?.data?.message || '密码修改失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 2,
        }}
      >
        <Stack spacing={3}>
          {/* 标题 */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              重置密码
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              修改账户密码
            </Typography>
          </Box>

          {/* 提示信息 */}
          <Alert severity="info" icon={<RemixIcon icon="ri-checkbox-circle-fill" size={20} />}>
            为了账户安全，请定期更换密码并使用强密码
          </Alert>

          {/* 表单 */}
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {/* 旧密码 */}
              <TextField
                fullWidth
                label="当前密码"
                type={showOldPassword ? 'text' : 'password'}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowOldPassword(!showOldPassword)}
                          edge="end"
                          aria-label="toggle password visibility"
                        >
                          <Box
                            className={showOldPassword ? 'ri-eye-off-line' : 'ri-eye-line'}
                            sx={{ fontSize: '20px' }}
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                disabled={loading}
                autoComplete="current-password"
              />

              {/* 新密码 */}
              <TextField
                fullWidth
                label="新密码"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          edge="end"
                          aria-label="toggle password visibility"
                        >
                          <Box
                            className={showNewPassword ? 'ri-eye-off-line' : 'ri-eye-line'}
                            sx={{ fontSize: '20px' }}
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                disabled={loading}
                autoComplete="new-password"
                helperText="密码长度至少为6位"
              />

              {/* 确认新密码 */}
              <TextField
                fullWidth
                label="确认新密码"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                          aria-label="toggle password visibility"
                        >
                          <Box
                            className={showConfirmPassword ? 'ri-eye-off-line' : 'ri-eye-line'}
                            sx={{ fontSize: '20px' }}
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                disabled={loading}
                autoComplete="new-password"
                error={confirmPassword !== '' && newPassword !== confirmPassword}
                helperText={
                  confirmPassword !== '' && newPassword !== confirmPassword
                    ? '两次输入的密码不一致'
                    : ''
                }
              />

              {/* 消息提示 */}
              {message && (
                <Alert
                  severity={message.type}
                  onClose={() => setMessage(null)}
                  icon={message.type === 'success' ? <RemixIcon icon="ri-checkbox-circle-fill" size={20} /> : <RemixIcon icon="ri-error-warning-fill" size={20} />}
                >
                  {message.text}
                </Alert>
              )}

              {/* 按钮 */}
              <Stack direction="row" spacing={2}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={16} /> : null}
                >
                  {loading ? '提交中...' : '确认修改'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate(-1)}
                  disabled={loading}
                >
                  取消
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}
