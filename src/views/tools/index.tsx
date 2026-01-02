/**
 * 工具管理页面
 * 管理和监控系统工具
 */

import { useState, useEffect } from 'react';

// material-ui
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Tabs,
  Tab,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
} from '@mui/material';

// project imports
import RemixIcon from 'ui-component/RemixIcon';
import {
  getTools,
  getToolStats,
  getToolCategories,
  registerTool,
  unregisterTool,
  testTool,
  getToolPermissions,
  updateToolPermissions,
  type Tool,
  type ToolStats,
  type ToolCategory,
} from 'api/tool';

// ==============================|| TOOLS PAGE ||============================== //

function TabPanel({ children, value, index }: { children: React.ReactNode; value: number; index: number }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

const CATEGORY_LABELS: Record<ToolCategory, string> = {
  llm: 'LLM',
  knowledge: '知识库',
  web_search: '网络搜索',
  web_scraper: '网页抓取',
  file: '文件',
  database: '数据库',
  notification: '通知',
  utility: '工具',
  custom: '自定义',
};

export default function ToolsPage() {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tools, setTools] = useState<Tool[]>([]);
  const [stats, setStats] = useState<ToolStats | null>(null);
  const [categories, setCategories] = useState<Array<{ value: string; name: string }>>([]);

  // Dialog states
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [testDialogOpen, setTestDialogOpen] = useState(false);
  const [permissionsDialogOpen, setPermissionsDialogOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'utility' as ToolCategory,
    parameters: '{}',
    handler_module_path: '',
  });

  const [testArgs, setTestArgs] = useState('{}');
  const [testResult, setTestResult] = useState<any>(null);
  const [testing, setTesting] = useState(false);
  const [permissions, setPermissions] = useState({
    allowed_users: '',
    allowed_roles: '',
    denied_users: '',
  });

  // Load data
  const loadTools = async () => {
    setLoading(true);
    try {
      const response = await getTools();
      if (response.success && response.data) {
        setTools(response.data.tools);
      }
    } catch (err) {
      console.error('Failed to load tools:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await getToolStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await getToolCategories();
      if (response.success && response.data) {
        setCategories(response.data.categories);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  useEffect(() => {
    loadTools();
    loadStats();
    loadCategories();
  }, []);

  // Register tool
  const handleRegister = async () => {
    try {
      let parameters = {};
      try {
        parameters = JSON.parse(formData.parameters || '{}');
      } catch {
        alert('参数格式错误，请输入有效的 JSON');
        return;
      }

      const response = await registerTool({
        name: formData.name,
        description: formData.description,
        category: formData.category,
        parameters,
        handler_module_path: formData.handler_module_path || undefined,
      });

      if (response.success) {
        setRegisterDialogOpen(false);
        setFormData({
          name: '',
          description: '',
          category: 'utility',
          parameters: '{}',
          handler_module_path: '',
        });
        await loadTools();
        await loadStats();
      }
    } catch (err) {
      console.error('Failed to register tool:', err);
      alert(err instanceof Error ? err.message : '注册工具失败');
    }
  };

  // Delete tool
  const handleDelete = async () => {
    if (!selectedTool) return;
    try {
      await unregisterTool(selectedTool.name);
      setDeleteDialogOpen(false);
      setSelectedTool(null);
      await loadTools();
      await loadStats();
    } catch (err) {
      console.error('Failed to unregister tool:', err);
    }
  };

  // Test tool
  const handleTest = async () => {
    if (!selectedTool) return;
    setTesting(true);
    setTestResult(null);
    try {
      let args = {};
      try {
        args = JSON.parse(testArgs || '{}');
      } catch {
        alert('参数格式错误，请输入有效的 JSON');
        setTesting(false);
        return;
      }

      const response = await testTool({
        tool_name: selectedTool.name,
        arguments: args,
      });

      if (response.success && response.data) {
        setTestResult(response.data);
      }
    } catch (err) {
      console.error('Failed to test tool:', err);
      setTestResult({ error: err instanceof Error ? err.message : '测试失败' });
    } finally {
      setTesting(false);
    }
  };

  // Update permissions
  const handleUpdatePermissions = async () => {
    if (!selectedTool) return;
    try {
      await updateToolPermissions({
        tool_name: selectedTool.name,
        allowed_users: permissions.allowed_users.split('\n').filter(Boolean),
        allowed_roles: permissions.allowed_roles.split('\n').filter(Boolean),
        denied_users: permissions.denied_users.split('\n').filter(Boolean),
      });
      setPermissionsDialogOpen(false);
      setSelectedTool(null);
      setPermissions({ allowed_users: '', allowed_roles: '', denied_users: '' });
      alert('权限更新成功');
    } catch (err) {
      console.error('Failed to update permissions:', err);
      alert(err instanceof Error ? err.message : '更新权限失败');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        {/* 标题栏 */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h3" sx={{ fontWeight: 600 }}>
            工具管理
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<RemixIcon icon="ri-refresh-line" size={18} />}
              onClick={loadTools}
              disabled={loading}
            >
              刷新
            </Button>
            <Button
              variant="contained"
              startIcon={<RemixIcon icon="ri-add-line" size={18} />}
              onClick={() => setRegisterDialogOpen(true)}
            >
              注册工具
            </Button>
          </Stack>
        </Stack>

        {/* 统计卡片 */}
        {stats && (
          <Stack direction="row" spacing={2}>
            <Card sx={{ flex: 1 }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      工具总数
                    </Typography>
                    <Typography variant="h4">{stats.total}</Typography>
                  </Box>
                  <RemixIcon icon="ri-tools-line" size={32} sx={{ color: 'primary.main' }} />
                </Stack>
              </CardContent>
            </Card>
            <Card sx={{ flex: 1 }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      已启用
                    </Typography>
                    <Typography variant="h4" sx={{ color: 'success.main' }}>{stats.active}</Typography>
                  </Box>
                  <RemixIcon icon="ri-checkbox-circle-line" size={32} sx={{ color: 'success.main' }} />
                </Stack>
              </CardContent>
            </Card>
            <Card sx={{ flex: 1 }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      有处理函数
                    </Typography>
                    <Typography variant="h4" sx={{ color: 'info.main' }}>{stats.with_handler}</Typography>
                  </Box>
                  <RemixIcon icon="ri-code-s-slash-line" size={32} sx={{ color: 'info.main' }} />
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        )}

        {/* 主选项卡 */}
        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
              <Tab label="工具列表" />
              <Tab label="分类统计" />
            </Tabs>
          </Box>

          <CardContent>
            <TabPanel value={tabValue} index={0}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : tools.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <RemixIcon icon="ri-tools-line" size={48} sx={{ color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    暂无工具
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>名称</TableCell>
                        <TableCell>描述</TableCell>
                        <TableCell>类别</TableCell>
                        <TableCell>状态</TableCell>
                        <TableCell>处理函数</TableCell>
                        <TableCell>操作</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tools.map((tool) => (
                        <TableRow key={tool.name} hover>
                          <TableCell>
                            <Typography variant="body1" sx={{ fontWeight: 500, fontFamily: 'monospace' }}>
                              {tool.name}
                            </Typography>
                          </TableCell>
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
                              {tool.description || '-'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={CATEGORY_LABELS[tool.category] || tool.category}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={tool.active ? '已启用' : '已禁用'}
                              color={tool.active ? 'success' : 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={tool.has_handler ? '有' : '无'}
                              color={tool.has_handler ? 'info' : 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <Button
                                size="small"
                                onClick={() => {
                                  setSelectedTool(tool);
                                  setTestArgs(JSON.stringify(tool.parameters || {}, null, 2));
                                  setTestResult(null);
                                  setTestDialogOpen(true);
                                }}
                              >
                                测试
                              </Button>
                              <Button
                                size="small"
                                onClick={() => {
                                  setSelectedTool(tool);
                                  setPermissions({
                                    allowed_users: '',
                                    allowed_roles: '',
                                    denied_users: '',
                                  });
                                  setPermissionsDialogOpen(true);
                                }}
                              >
                                权限
                              </Button>
                              <Button
                                size="small"
                                color="error"
                                onClick={() => {
                                  setSelectedTool(tool);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                注销
                              </Button>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              {stats && (
                <Grid container spacing={2}>
                  {Object.entries(stats.by_category).map(([cat, count]) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={cat}>
                      <Card>
                        <CardContent>
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {CATEGORY_LABELS[cat as ToolCategory] || cat}
                              </Typography>
                              <Typography variant="h4">{count as number}</Typography>
                            </Box>
                            <RemixIcon icon="ri-folder-line" size={32} sx={{ color: 'primary.main' }} />
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </TabPanel>
          </CardContent>
        </Card>
      </Stack>

      {/* 注册工具对话框 */}
      <Dialog open={registerDialogOpen} onClose={() => setRegisterDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>注册新工具</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="工具名称"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="如: web_search"
              required
            />
            <TextField
              fullWidth
              label="描述"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="工具功能描述"
            />
            <FormControl fullWidth>
              <InputLabel>类别</InputLabel>
              <Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as ToolCategory })}
                label="类别"
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.value} value={cat.value}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="参数定义 (JSON)"
              value={formData.parameters}
              onChange={(e) => setFormData({ ...formData, parameters: e.target.value })}
              multiline
              rows={3}
              placeholder='{"type": "object", "properties": {}}'
            />
            <TextField
              fullWidth
              label="处理函数模块路径（可选）"
              value={formData.handler_module_path}
              onChange={(e) => setFormData({ ...formData, handler_module_path: e.target.value })}
              placeholder="如: nekobot.tools.web_search"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRegisterDialogOpen(false)}>取消</Button>
          <Button onClick={handleRegister} variant="contained" disabled={!formData.name}>
            注册
          </Button>
        </DialogActions>
      </Dialog>

      {/* 删除确认对话框 */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>确认注销</DialogTitle>
        <DialogContent>
          <Typography>
            确定要注销工具 "{selectedTool?.name}" 吗？此操作不可撤销。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>取消</Button>
          <Button color="error" onClick={handleDelete}>
            注销
          </Button>
        </DialogActions>
      </Dialog>

      {/* 测试工具对话框 */}
      <Dialog open={testDialogOpen} onClose={() => setTestDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>测试工具 - {selectedTool?.name}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Alert severity="info">
              <Typography variant="body2">{selectedTool?.description}</Typography>
            </Alert>
            <TextField
              fullWidth
              label="测试参数 (JSON)"
              value={testArgs}
              onChange={(e) => setTestArgs(e.target.value)}
              multiline
              rows={4}
              placeholder='{"query": "测试"}'
            />
            {testResult && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    测试结果
                  </Typography>
                  <pre style={{
                    background: '#f5f5f5',
                    padding: '12px',
                    borderRadius: '4px',
                    overflow: 'auto',
                    maxHeight: '200px',
                  }}>
                    {JSON.stringify(testResult, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTestDialogOpen(false)}>关闭</Button>
          <Button onClick={handleTest} variant="contained" disabled={testing}>
            {testing ? '测试中...' : '测试'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 权限管理对话框 */}
      <Dialog open={permissionsDialogOpen} onClose={() => setPermissionsDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>权限管理 - {selectedTool?.name}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="允许的用户（每行一个）"
              value={permissions.allowed_users}
              onChange={(e) => setPermissions({ ...permissions, allowed_users: e.target.value })}
              multiline
              rows={3}
              placeholder="user1&#10;user2"
            />
            <TextField
              fullWidth
              label="允许的角色（每行一个）"
              value={permissions.allowed_roles}
              onChange={(e) => setPermissions({ ...permissions, allowed_roles: e.target.value })}
              multiline
              rows={3}
              placeholder="admin&#10;moderator"
            />
            <TextField
              fullWidth
              label="拒绝的用户（每行一个）"
              value={permissions.denied_users}
              onChange={(e) => setPermissions({ ...permissions, denied_users: e.target.value })}
              multiline
              rows={3}
              placeholder="banned_user"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPermissionsDialogOpen(false)}>取消</Button>
          <Button onClick={handleUpdatePermissions} variant="contained">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
