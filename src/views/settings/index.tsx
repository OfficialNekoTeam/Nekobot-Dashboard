/**
 * 系统设置页面
 * 管理系统配置和设置
 */

import { useEffect, useState } from 'react';

// material-ui
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';

// project imports
import { getSettings, updateSettings, getBotConfig, updateBotConfig, checkUpdate, restartService, getVersionInfo, getBotVersion } from 'api';
import type { SystemSettings, BotConfig } from 'types/settings';
import type { VersionInfo } from 'types/stat';
import type { BotVersion } from 'types/system';

// assets
import RemixIcon from 'ui-component/RemixIcon';

// ==============================|| SETTINGS PAGE ||============================== //

export default function SettingsPage() {
  const theme = useTheme();
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [botConfig, setBotConfig] = useState<BotConfig | null>(null);
  const [versionInfo, setVersionInfo] = useState<VersionInfo | null>(null);
  const [botVersion, setBotVersion] = useState<BotVersion | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updateChecking, setUpdateChecking] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 加载设置数据
  const loadData = async () => {
    try {
      setLoading(true);
      const [settingsRes, configRes, versionRes, botVerRes] = await Promise.all([
        getSettings(),
        getBotConfig(),
        getVersionInfo(),
        getBotVersion(),
      ]);

      if (settingsRes.success && settingsRes.data) {
        setSettings(settingsRes.data.settings as SystemSettings);
      }
      if (configRes.success && configRes.data) {
        setBotConfig(configRes.data as BotConfig);
      }
      if (versionRes.success && versionRes.data) {
        setVersionInfo(versionRes.data);
      }
      if (botVerRes.success && botVerRes.data) {
        setBotVersion(botVerRes.data);
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 保存系统设置
  const handleSaveSettings = async () => {
    if (!settings) return;
    try {
      setSaving(true);
      await updateSettings(settings);
      showMessage('success', '设置已保存');
    } catch (err) {
      showMessage('error', '保存失败');
    } finally {
      setSaving(false);
    }
  };

  // 保存 Bot 配置
  const handleSaveBotConfig = async () => {
    if (!botConfig) return;
    try {
      setSaving(true);
      await updateBotConfig(botConfig);
      showMessage('success', '配置已保存');
    } catch (err) {
      showMessage('error', '保存失败');
    } finally {
      setSaving(false);
    }
  };

  // 检查更新
  const handleCheckUpdate = async () => {
    try {
      setUpdateChecking(true);
      const response = await checkUpdate();
      if (response.success && response.data) {
        setUpdateAvailable(response.data.has_update);
        if (!response.data.has_update) {
          showMessage('success', '已是最新版本');
        }
      }
    } catch (err) {
      console.error('Failed to check update:', err);
    } finally {
      setUpdateChecking(false);
    }
  };

  // 重启服务
  const handleRestart = async () => {
    if (!confirm('确定要重启服务吗？重启可能需要几秒钟时间。')) {
      return;
    }
    try {
      await restartService();
      showMessage('success', '服务正在重启...');
    } catch (err) {
      showMessage('error', '重启失败');
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  if (loading) {
    return <Box sx={{ p: 3 }}><Typography>加载中...</Typography></Box>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        {message && (
          <Alert
            severity={message.type}
            onClose={() => setMessage(null)}
            icon={message.type === 'success' ? <RemixIcon icon="ri-checkbox-circle-fill" size={20} /> : <RemixIcon icon="ri-error-warning-fill" size={20} />}
          >
            {message.text}
          </Alert>
        )}

        <Typography variant="h3" sx={{ fontWeight: 600 }}>
          系统设置
        </Typography>

        {/* 版本信息 */}
        {(versionInfo || botVersion) && (
          <Card>
            <CardContent>
              <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Stack spacing={2}>
                  <Stack>
                    <Typography variant="h6">版本信息</Typography>
                    {botVersion && (
                      <>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          版本: {botVersion.version}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          构建时间: {botVersion.build_time}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Git 提交: {botVersion.git_commit?.slice(0, 8)}
                        </Typography>
                      </>
                    )}
                    {versionInfo && !botVersion && (
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        版本: {versionInfo.version}
                      </Typography>
                    )}
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="outlined"
                      onClick={handleCheckUpdate}
                      startIcon={updateChecking ? <CircularProgress size={16} /> : <RemixIcon icon="ri-refresh-line" size={18} />}
                      disabled={updateChecking}
                    >
                      检查更新
                    </Button>
                    {updateAvailable && (
                      <Button variant="contained" color="primary">
                        有新版本
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* 基本设置 */}
        {settings && (
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                基本设置
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack spacing={2}>
                    <Typography variant="body2">主题</Typography>
                    <TextField
                      fullWidth
                      select
                      value={settings.theme || 'light'}
                      onChange={(e) =>
                        setSettings({ ...settings, theme: e.target.value })
                      }
                    >
                      <MenuItem value="light">浅色</MenuItem>
                      <MenuItem value="dark">深色</MenuItem>
                    </TextField>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack spacing={2}>
                    <Typography variant="body2">语言</Typography>
                    <TextField
                      fullWidth
                      select
                      value={settings.language || 'zh-CN'}
                      onChange={(e) =>
                        setSettings({ ...settings, language: e.target.value })
                      }
                    >
                      <MenuItem value="zh-CN">简体中文</MenuItem>
                      <MenuItem value="en-US">English</MenuItem>
                    </TextField>
                  </Stack>
                </Grid>
                <Grid size={12}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Switch
                      checked={settings.notifications?.enabled || false}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          notifications: {
                            ...settings.notifications,
                            enabled: e.target.checked,
                          },
                        })
                      }
                    />
                    <Typography variant="body2">启用通知</Typography>
                  </Stack>
                </Grid>
                <Grid size={12}>
                  <Button
                    variant="contained"
                    onClick={handleSaveSettings}
                    disabled={saving}
                    sx={{ mt: 1 }}
                  >
                    {saving ? '保存中...' : '保存设置'}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Bot 配置 */}
        {botConfig && (
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Bot 配置
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="命令前缀"
                    value={botConfig.command_prefix}
                    onChange={(e) =>
                      setBotConfig({ ...botConfig, command_prefix: e.target.value })
                    }
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Switch
                      checked={botConfig.webui_enabled}
                      onChange={(e) =>
                        setBotConfig({ ...botConfig, webui_enabled: e.target.checked })
                      }
                    />
                    <Typography variant="body2">启用 WebUI</Typography>
                  </Stack>
                </Grid>
                <Grid size={12}>
                  <Button
                    variant="contained"
                    onClick={handleSaveBotConfig}
                    disabled={saving}
                    sx={{ mt: 1 }}
                  >
                    {saving ? '保存中...' : '保存配置'}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* 服务管理 */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>
              服务管理
            </Typography>
            <Stack spacing={2}>
              <Alert severity="warning" icon={<RemixIcon icon="ri-checkbox-circle-fill" size={20} />}>
                重启服务将断开所有连接，请谨慎操作
              </Alert>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  color="warning"
                  onClick={handleRestart}
                >
                  重启服务
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
