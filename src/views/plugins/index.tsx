/**
 * 插件管理页面
 * 管理插件的启用、禁用、配置等
 */

import { useEffect, useState } from 'react';

// material-ui
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project imports
import {
  getPlugins,
  enablePlugin,
  disablePlugin,
  reloadPlugin,
  deletePlugin,
} from 'api';
import type { Plugin } from 'types/plugin';

// assets
import SettingsIcon from '@mui/icons-material/Settings';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadIcon from '@mui/icons-material/Upload';

// ==============================|| PLUGINS PAGE ||============================== //

export default function PluginsPage() {
  const theme = useTheme();
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  // 加载插件列表
  const loadPlugins = async () => {
    try {
      setLoading(true);
      const response = await getPlugins();
      if (response.success && response.data) {
        // 后端返回的是对象格式，需要转换为数组
        const pluginsArray = Object.values(response.data).map((item: any) => ({
          name: item.name,
          version: item.version,
          description: item.description,
          enabled: item.enabled,
          commands: item.commands || [],
          is_official: item.is_official || false,
        }));
        setPlugins(pluginsArray);
      } else {
        setError('获取插件列表失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取插件列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlugins();
  }, []);

  // 切换插件启用状态
  const handleTogglePlugin = async (plugin: Plugin) => {
    try {
      if (plugin.enabled) {
        await disablePlugin(plugin.name);
      } else {
        await enablePlugin(plugin.name);
      }
      await loadPlugins();
    } catch (err) {
      console.error('Failed to toggle plugin:', err);
    }
  };

  // 重载插件
  const handleReloadPlugin = async (pluginName: string) => {
    try {
      await reloadPlugin(pluginName);
      await loadPlugins();
    } catch (err) {
      console.error('Failed to reload plugin:', err);
    }
  };

  // 删除插件
  const handleDeletePlugin = async (pluginName: string) => {
    if (!confirm(`确定要删除插件 "${pluginName}" 吗？`)) {
      return;
    }
    try {
      await deletePlugin(pluginName);
      await loadPlugins();
    } catch (err) {
      console.error('Failed to delete plugin:', err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>加载中...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
        <Button onClick={loadPlugins} sx={{ mt: 2 }}>
          重试
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        {/* 标题栏 */}
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h3" sx={{ fontWeight: 600 }}>
            插件管理
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<UploadIcon />}
              onClick={() => setUploadDialogOpen(true)}
            >
              上传插件
            </Button>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={loadPlugins}
            >
              刷新
            </Button>
          </Stack>
        </Stack>

        {/* 统计卡片 */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  总插件数
                </Typography>
                <Typography variant="h4">{plugins.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  已启用
                </Typography>
                <Typography variant="h4" sx={{ color: 'success.main' }}>
                  {plugins.filter((p) => p.enabled).length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  已禁用
                </Typography>
                <Typography variant="h4" sx={{ color: 'error.main' }}>
                  {plugins.filter((p) => !p.enabled).length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  官方插件
                </Typography>
                <Typography variant="h4">
                  {plugins.filter((p) => p.is_official).length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* 插件列表 */}
        <Card>
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>名称</TableCell>
                    <TableCell>版本</TableCell>
                    <TableCell>描述</TableCell>
                    <TableCell>状态</TableCell>
                    <TableCell align="right">操作</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {plugins.map((plugin) => (
                    <TableRow key={plugin.name} hover>
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {plugin.name}
                        </Typography>
                      </TableCell>
                      <TableCell>{plugin.version}</TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 300,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {plugin.description || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Chip
                            label={plugin.enabled ? '已启用' : '已禁用'}
                            color={plugin.enabled ? 'success' : 'default'}
                            size="small"
                          />
                          {plugin.is_official && (
                            <Chip
                              label="官方"
                              color="primary"
                              size="small"
                            />
                          )}
                          {plugin.commands.length > 0 && (
                            <Chip
                              label={`${plugin.commands.length} 命令`}
                              variant="outlined"
                              size="small"
                            />
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Switch
                            checked={plugin.enabled}
                            onChange={() => handleTogglePlugin(plugin)}
                            size="small"
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleReloadPlugin(plugin.name)}
                            title="重载"
                          >
                            <RefreshIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeletePlugin(plugin.name)}
                            title="删除"
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Stack>

      {/* 上传插件对话框 */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>上传插件</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            请选择一个 ZIP 格式的插件文件
          </Typography>
          <TextField
            fullWidth
            type="file"
            inputProps={{ accept: '.zip' }}
            // TODO: 实现文件上传逻辑
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>取消</Button>
          <Button variant="contained">上传</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
