/**
 * LLM 服务商管理页面
 * 管理 AI 服务提供商
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
  Grid,
  IconButton,
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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project imports
import {
  getProviders,
  getProviderTypes,
  addProvider,
  updateProvider,
  deleteProvider,
} from 'api';
import type { LLMProvider, ProviderType } from 'types/llm';

// assets
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

// ==============================|| LLM PROVIDERS PAGE ||============================== //

export default function LLMProvidersPage() {
  const theme = useTheme();
  const [providers, setProviders] = useState<LLMProvider[]>([]);
  const [providerTypes, setProviderTypes] = useState<ProviderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<LLMProvider | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    api_key: '',
    base_url: '',
    model: '',
    enabled: true,
  });

  // 加载数据
  const loadData = async () => {
    try {
      setLoading(true);
      const [providersRes, typesRes] = await Promise.all([
        getProviders(),
        getProviderTypes(),
      ]);

      if (providersRes.success && providersRes.data) {
        setProviders(providersRes.data.providers);
      }
      if (typesRes.success && typesRes.data) {
        setProviderTypes(typesRes.data.provider_types);
      }
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 打开新增对话框
  const handleAdd = () => {
    setEditingProvider(null);
    setFormData({
      name: '',
      type: providerTypes[0]?.type || '',
      api_key: '',
      base_url: '',
      model: '',
      enabled: true,
    });
    setDialogOpen(true);
  };

  // 打开编辑对话框
  const handleEdit = (provider: LLMProvider) => {
    setEditingProvider(provider);
    setFormData({
      name: provider.name,
      type: provider.type,
      api_key: '', // 不显示已保存的密钥
      base_url: provider.base_url,
      model: provider.model,
      enabled: provider.enabled,
    });
    setDialogOpen(true);
  };

  // 保存服务商
  const handleSave = async () => {
    try {
      if (editingProvider) {
        // 编辑时只提交非空字段
        const updates: any = {};
        if (formData.name) updates.name = formData.name;
        if (formData.api_key) updates.api_key = formData.api_key;
        if (formData.base_url) updates.base_url = formData.base_url;
        if (formData.model) updates.model = formData.model;
        updates.enabled = formData.enabled;

        await updateProvider({
          id: editingProvider.id,
          ...updates,
        });
      } else {
        await addProvider({
          name: formData.name,
          type: formData.type,
          api_key: formData.api_key,
          base_url: formData.base_url || undefined,
          model: formData.model || undefined,
          enabled: formData.enabled,
        });
      }
      setDialogOpen(false);
      loadData();
    } catch (err) {
      console.error('Failed to save provider:', err);
    }
  };

  // 删除服务商
  const handleDelete = async (provider: LLMProvider) => {
    if (!confirm(`确定要删除服务商 "${provider.name}" 吗？`)) {
      return;
    }
    try {
      await deleteProvider(provider.id);
      loadData();
    } catch (err) {
      console.error('Failed to delete provider:', err);
    }
  };

  // 切换启用状态
  const handleToggle = async (provider: LLMProvider) => {
    try {
      await updateProvider({
        id: provider.id,
        enabled: !provider.enabled,
      });
      loadData();
    } catch (err) {
      console.error('Failed to toggle provider:', err);
    }
  };

  // 复制 API Key
  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
  };

  if (loading) {
    return <Box sx={{ p: 3 }}><Typography>加载中...</Typography></Box>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h3" sx={{ fontWeight: 600 }}>
            LLM 服务商
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
              添加服务商
            </Button>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadData}>
              刷新
            </Button>
          </Stack>
        </Stack>

        {/* 统计卡片 */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  服务商总数
                </Typography>
                <Typography variant="h4">{providers.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  已启用
                </Typography>
                <Typography variant="h4" sx={{ color: 'success.main' }}>
                  {providers.filter((p) => p.enabled).length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  支持的类型
                </Typography>
                <Typography variant="h4">{providerTypes.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* 服务商列表 */}
        <Card>
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>名称</TableCell>
                    <TableCell>类型</TableCell>
                    <TableCell>模型</TableCell>
                    <TableCell>API 地址</TableCell>
                    <TableCell>状态</TableCell>
                    <TableCell align="right">操作</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {providers.map((provider) => (
                    <TableRow key={provider.id} hover>
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {provider.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={provider.type} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: 'monospace',
                            maxWidth: 200,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {provider.model || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: 'monospace',
                            fontSize: '0.75rem',
                            maxWidth: 250,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {provider.base_url || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={provider.enabled ? '已启用' : '已禁用'}
                          color={provider.enabled ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Switch
                            checked={provider.enabled}
                            onChange={() => handleToggle(provider)}
                            size="small"
                          />
                          <IconButton size="small" onClick={() => handleEdit(provider)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(provider)}
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {providers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          暂无服务商，请添加
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Stack>

      {/* 新增/编辑对话框 */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingProvider ? '编辑服务商' : '添加服务商'}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="名称"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="如: OpenAI, Claude 等"
            />
            <FormControl fullWidth>
              <InputLabel>服务商类型</InputLabel>
              <Select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                disabled={!!editingProvider}
                label="服务商类型"
              >
                {providerTypes.map((type) => (
                  <MenuItem key={type.type} value={type.type}>
                    {type.display_name} - {type.description}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="API Key"
              value={formData.api_key}
              onChange={(e) => setFormData({ ...formData, api_key: e.target.value })}
              type="password"
              placeholder={editingProvider ? '留空保持不变' : '请输入 API Key'}
            />
            <TextField
              fullWidth
              label="API 地址 (可选)"
              value={formData.base_url}
              onChange={(e) => setFormData({ ...formData, base_url: e.target.value })}
              placeholder="如: https://api.openai.com/v1"
            />
            <TextField
              fullWidth
              label="默认模型 (可选)"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              placeholder="如: gpt-4, claude-3 等"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>取消</Button>
          <Button variant="contained" onClick={handleSave}>保存</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
