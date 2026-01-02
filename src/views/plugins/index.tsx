/**
 * 插件管理页面
 * 管理插件的启用、禁用、配置等
 */

import { useEffect, useState, useCallback } from 'react';

// material-ui
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Select,
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
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project imports
import {
  getPlugins,
  enablePlugin,
  disablePlugin,
  reloadPlugin,
  deletePlugin,
  uploadPlugin,
  installPlugin,
} from 'api';
import type { Plugin } from 'types/plugin';
import RemixIcon from 'ui-component/RemixIcon';

// ==============================|| CONSTANTS ||============================== //

const GITHUB_PROXIES = [
  { value: 'https://ghproxy.com', label: 'ghproxy.com' },
  { value: 'https://edgeone.gh-proxy.com', label: 'edgeone.gh-proxy.com' },
  { value: 'https://hk.gh-proxy.com', label: 'hk.gh-proxy.com' },
  { value: 'https://gh.llkk.cc', label: 'gh.llkk.cc' },
];

const PIP_MIRRORS = [
  { value: 'https://pypi.tuna.tsinghua.edu.cn/simple', label: '清华源' },
  { value: 'https://pypi.mirrors.ustc.edu.cn/simple', label: '中科大源' },
  { value: 'https://pypi.mirrors.aliyun.com/simple', label: '阿里云源' },
  { value: 'https://pypi.org/simple', label: '官方源' },
];

// ==============================|| PLUGINS PAGE ||============================== //

type ViewMode = 'grid' | 'list';

export default function PluginsPage() {
  const theme = useTheme();
  const [plugins, setPlugins] = useState<Plugin[]>([]);
  const [filteredPlugins, setFilteredPlugins] = useState<Plugin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Install from URL dialog state
  const [installUrlDialogOpen, setInstallUrlDialogOpen] = useState(false);
  const [installUrl, setInstallUrl] = useState('');
  const [useGitHubProxy, setUseGitHubProxy] = useState(false);
  const [selectedGitHubProxy, setSelectedGitHubProxy] = useState(GITHUB_PROXIES[0].value);
  const [customProxy, setCustomProxy] = useState('');
  const [selectedPipMirror, setSelectedPipMirror] = useState(PIP_MIRRORS[0].value);
  const [installing, setInstalling] = useState(false);

  // 加载插件列表
  const loadPlugins = useCallback(async () => {
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
        setFilteredPlugins(pluginsArray);
        setError(null);
      } else {
        setError('获取插件列表失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取插件列表失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlugins();
  }, [loadPlugins]);

  // 搜索过滤
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPlugins(plugins);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = plugins.filter(
        (plugin) =>
          plugin.name.toLowerCase().includes(query) ||
          plugin.description?.toLowerCase().includes(query) ||
          plugin.version?.toLowerCase().includes(query)
      );
      setFilteredPlugins(filtered);
    }
  }, [searchQuery, plugins]);

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
    try {
      await deletePlugin(pluginName);
      await loadPlugins();
    } catch (err) {
      console.error('Failed to delete plugin:', err);
    }
  };

  // 上传插件
  const handleUploadPlugin = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      const response = await uploadPlugin(selectedFile);
      if (response.success) {
        setUploadDialogOpen(false);
        setSelectedFile(null);
        await loadPlugins();
      } else {
        setError(response.message || '上传插件失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '上传插件失败');
    } finally {
      setUploading(false);
    }
  };

  // 从 URL 安装插件
  const handleInstallFromUrl = async () => {
    if (!installUrl.trim()) {
      setError('请输入插件 URL');
      return;
    }

    try {
      setInstalling(true);
      const options: {
        proxy?: string;
        useGitHubProxy?: boolean;
        pipMirror?: string;
      } = {
        pipMirror: selectedPipMirror,
      };

      if (useGitHubProxy) {
        options.useGitHubProxy = true;
      } else if (customProxy.trim()) {
        options.proxy = customProxy.trim();
      }

      const response = await installPlugin(installUrl.trim(), options);

      if (response.success) {
        setInstallUrlDialogOpen(false);
        setInstallUrl('');
        setUseGitHubProxy(false);
        setCustomProxy('');
        setSelectedPipMirror(PIP_MIRRORS[0].value);
        await loadPlugins();
      } else {
        setError(response.message || '从 URL 安装插件失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '从 URL 安装插件失败');
    } finally {
      setInstalling(false);
    }
  };

  // 插件卡片组件（网格视图）
  const PluginCard = ({ plugin }: { plugin: Plugin }) => (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack spacing={2}>
          {/* 标题和徽章 */}
          <Box>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {plugin.name}
              </Typography>
              {plugin.is_official && (
                <Chip label="官方" color="primary" size="small" />
              )}
            </Stack>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              v{plugin.version}
            </Typography>
          </Box>

          {/* 描述 */}
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              minHeight: 60,
            }}
          >
            {plugin.description || '暂无描述'}
          </Typography>

          {/* 命令 */}
          {plugin.commands.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', mb: 0.5, display: 'block' }}>
                命令:
              </Typography>
              <Stack direction="row" spacing={0.5} flexWrap="wrap">
                {plugin.commands.slice(0, 3).map((cmd) => (
                  <Chip
                    key={cmd}
                    label={cmd}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem', height: 20 }}
                  />
                ))}
                {plugin.commands.length > 3 && (
                  <Chip
                    label={`+${plugin.commands.length - 3}`}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem', height: 20 }}
                  />
                )}
              </Stack>
            </Box>
          )}
        </Stack>
      </CardContent>

      <Divider />

      <CardActions sx={{ justifyContent: 'space-between', px: 2, py: 1 }}>
        <Switch
          checked={plugin.enabled}
          onChange={() => handleTogglePlugin(plugin)}
          size="small"
        />
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="重载">
            <IconButton
              size="small"
              onClick={() => handleReloadPlugin(plugin.name)}
              color="info"
            >
              <RemixIcon icon="ri-refresh-line" size={16} />
            </IconButton>
          </Tooltip>
          <Tooltip title="删除">
            <IconButton
              size="small"
              onClick={() => handleDeletePlugin(plugin.name)}
              color="error"
            >
              <RemixIcon icon="ri-delete-bin-line" size={16} />
            </IconButton>
          </Tooltip>
        </Stack>
      </CardActions>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Stack spacing={2} alignItems="center">
          <CircularProgress />
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            加载插件列表...
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        {/* 标题栏 */}
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 600 }}>
            插件管理
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<RemixIcon icon="ri-link" size={18} />}
              onClick={() => setInstallUrlDialogOpen(true)}
            >
              从 URL 安装
            </Button>
            <Button
              variant="outlined"
              startIcon={<RemixIcon icon="ri-upload-line" size={18} />}
              onClick={() => setUploadDialogOpen(true)}
            >
              上传插件
            </Button>
            <Button
              variant="outlined"
              startIcon={<RemixIcon icon="ri-refresh-line" size={18} />}
              onClick={loadPlugins}
            >
              刷新
            </Button>
          </Stack>
        </Stack>

        {/* 搜索和视图切换 */}
        <Paper sx={{ p: 2 }}>
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <TextField
              placeholder="搜索插件..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <RemixIcon icon="ri-search-line" size={18} />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 250, flexGrow: 1, maxWidth: 500 }}
            />
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_, mode) => mode && setViewMode(mode)}
              size="small"
            >
              <ToggleButton value="list" aria-label="列表视图">
                <RemixIcon icon="ri-list-check" size={18} />
              </ToggleButton>
              <ToggleButton value="grid" aria-label="网格视图">
                <RemixIcon icon="ri-grid-fill" size={18} />
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Paper>

        {/* 统计卡片 */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, md: 3 }}>
            <Card
              sx={{
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              <CardContent>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  总插件数
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {plugins.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Card
              sx={{
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              <CardContent>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  已启用
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                  {plugins.filter((p) => p.enabled).length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Card
              sx={{
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              <CardContent>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  已禁用
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'error.main' }}>
                  {plugins.filter((p) => !p.enabled).length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 6, md: 3 }}>
            <Card
              sx={{
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              <CardContent>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  官方插件
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {plugins.filter((p) => p.is_official).length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* 错误提示 */}
        {error && (
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* 插件列表/网格 */}
        {filteredPlugins.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
              {searchQuery ? '未找到匹配的插件' : '暂无插件'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {searchQuery ? '尝试使用其他关键词搜索' : '点击"上传插件"按钮添加插件'}
            </Typography>
          </Paper>
        ) : viewMode === 'list' ? (
          <Card>
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
                  {filteredPlugins.map((plugin) => (
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
                            <Chip label="官方" color="primary" size="small" />
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
                          <Tooltip title="重载">
                            <IconButton
                              size="small"
                              onClick={() => handleReloadPlugin(plugin.name)}
                            >
                              <RemixIcon icon="ri-refresh-line" size={16} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="删除">
                            <IconButton
                              size="small"
                              onClick={() => handleDeletePlugin(plugin.name)}
                              color="error"
                            >
                              <RemixIcon icon="ri-delete-bin-line" size={16} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        ) : (
          <Grid container spacing={2}>
            {filteredPlugins.map((plugin) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={plugin.name}>
                <PluginCard plugin={plugin} />
              </Grid>
            ))}
          </Grid>
        )}
      </Stack>

      {/* 上传插件对话框 */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => {
          if (!uploading) {
            setUploadDialogOpen(false);
            setSelectedFile(null);
          }
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>上传插件</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            请选择一个 ZIP 格式的插件文件上传安装。
          </DialogContentText>
          <Stack spacing={2}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              disabled={uploading}
              startIcon={<RemixIcon icon="ri-upload-line" size={18} />}
            >
              选择文件
              <input
                type="file"
                accept=".zip"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setSelectedFile(file);
                }}
              />
            </Button>
            {selectedFile && (
              <Alert severity="info">
                已选择: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
              </Alert>
            )}
            {uploading && (
              <Stack spacing={1} alignItems="center">
                <CircularProgress size={24} />
                <Typography variant="body2">上传中...</Typography>
              </Stack>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setUploadDialogOpen(false);
              setSelectedFile(null);
            }}
            disabled={uploading}
          >
            取消
          </Button>
          <Button
            variant="contained"
            onClick={handleUploadPlugin}
            disabled={!selectedFile || uploading}
            startIcon={uploading ? <CircularProgress size={16} /> : <RemixIcon icon="ri-upload-line" size={18} />}
          >
            上传
          </Button>
        </DialogActions>
      </Dialog>

      {/* 从 URL 安装插件对话框 */}
      <Dialog
        open={installUrlDialogOpen}
        onClose={() => {
          if (!installing) {
            setInstallUrlDialogOpen(false);
            setInstallUrl('');
            setUseGitHubProxy(false);
            setCustomProxy('');
          }
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>从 URL 安装插件</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            输入插件仓库 URL（支持 GitHub/GitLab 等平台），可选择使用代理加速下载。
          </DialogContentText>
          <Stack spacing={2.5}>
            {/* URL 输入 */}
            <TextField
              label="插件 URL"
              placeholder="https://github.com/user/repo"
              value={installUrl}
              onChange={(e) => setInstallUrl(e.target.value)}
              disabled={installing}
              fullWidth
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <RemixIcon icon="ri-link" size={18} />
                  </InputAdornment>
                ),
              }}
            />

            {/* Pip 镜像源选择 */}
            <FormControl fullWidth size="small">
              <InputLabel>Pip 镜像源</InputLabel>
              <Select
                value={selectedPipMirror}
                onChange={(e) => setSelectedPipMirror(e.target.value)}
                label="Pip 镜像源"
                disabled={installing}
              >
                {PIP_MIRRORS.map((mirror) => (
                  <MenuItem key={mirror.value} value={mirror.value}>
                    {mirror.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Divider sx={{ my: 1 }} />

            {/* GitHub 代理选项 */}
            <Stack spacing={1.5}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  使用 GitHub 代理
                </Typography>
                <Switch
                  checked={useGitHubProxy}
                  onChange={(e) => setUseGitHubProxy(e.target.checked)}
                  disabled={installing}
                  size="small"
                />
              </Stack>

              {useGitHubProxy && (
                <FormControl fullWidth size="small">
                  <InputLabel>选择代理服务器</InputLabel>
                  <Select
                    value={selectedGitHubProxy}
                    onChange={(e) => setSelectedGitHubProxy(e.target.value)}
                    label="选择代理服务器"
                    disabled={installing}
                  >
                    {GITHUB_PROXIES.map((proxy) => (
                      <MenuItem key={proxy.value} value={proxy.value}>
                        {proxy.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Stack>

            {/* 自定义代理输入 */}
            {!useGitHubProxy && (
              <TextField
                label="自定义代理（可选）"
                placeholder="http://proxy.example.com:8080"
                value={customProxy}
                onChange={(e) => setCustomProxy(e.target.value)}
                disabled={installing}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <RemixIcon icon="ri-global-line" size={18} />
                    </InputAdornment>
                  ),
                }}
              />
            )}

            {/* 安装进度 */}
            {installing && (
              <Stack spacing={1} alignItems="center" sx={{ py: 1 }}>
                <CircularProgress size={24} />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  正在安装插件，请稍候...
                </Typography>
              </Stack>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setInstallUrlDialogOpen(false);
              setInstallUrl('');
              setUseGitHubProxy(false);
              setCustomProxy('');
            }}
            disabled={installing}
          >
            取消
          </Button>
          <Button
            variant="contained"
            onClick={handleInstallFromUrl}
            disabled={!installUrl.trim() || installing}
            startIcon={installing ? <CircularProgress size={16} /> : <RemixIcon icon="ri-download-line" size={18} />}
          >
            安装
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
