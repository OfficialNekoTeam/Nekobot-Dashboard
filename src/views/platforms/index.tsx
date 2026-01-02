/**
 * 平台管理页面
 * 管理聊天平台适配器
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
} from '@mui/material';

// project imports
import { getPlatforms, addPlatform, updatePlatform, deletePlatform } from 'api';
import type { Platform } from 'types/platform';

// project imports
import RemixIcon from 'ui-component/RemixIcon';

// ==============================|| PLATFORMS PAGE ||============================== //

export default function PlatformsPage() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState<Platform | null>(null);
  const [formData, setFormData] = useState({
    type: '',
    id: '',
    name: '',
  });

  // 加载平台列表
  const loadPlatforms = async () => {
    try {
      setLoading(true);
      const response = await getPlatforms();
      if (response.success && response.data) {
        setPlatforms(response.data.platforms);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlatforms();
  }, []);

  // 打开新增对话框
  const handleAdd = () => {
    setEditingPlatform(null);
    setFormData({ type: '', id: '', name: '' });
    setDialogOpen(true);
  };

  // 打开编辑对话框
  const handleEdit = (platform: Platform) => {
    setEditingPlatform(platform);
    setFormData({ type: platform.type, id: platform.id, name: platform.name });
    setDialogOpen(true);
  };

  // 保存平台
  const handleSave = async () => {
    try {
      if (editingPlatform) {
        await updatePlatform({
          type: formData.type,
          id: editingPlatform.id,
          updates: {
            enable: undefined,
            id: formData.id,
            name: formData.name,
          },
        });
      } else {
        await addPlatform({
          type: formData.type,
          id: formData.id,
          name: formData.name,
        });
      }
      setDialogOpen(false);
      loadPlatforms();
    } catch (err) {
      console.error('Failed to save platform:', err);
    }
  };

  // 删除平台
  const handleDelete = async (platform: Platform) => {
    if (!confirm(`确定要删除平台 "${platform.name}" 吗？`)) {
      return;
    }
    try {
      await deletePlatform(platform.type, platform.id);
      loadPlatforms();
    } catch (err) {
      console.error('Failed to delete platform:', err);
    }
  };

  // 切换平台启用状态
  const handleToggle = async (platform: Platform) => {
    try {
      await updatePlatform({
        type: platform.type,
        id: platform.id,
        updates: { enable: !platform.enabled },
      });
      loadPlatforms();
    } catch (err) {
      console.error('Failed to toggle platform:', err);
    }
  };

  if (loading) {
    return <Box sx={{ p: 3 }}><Typography>加载中...</Typography></Box>;
  }

  if (error) {
    return <Box sx={{ p: 3 }}><Typography color="error">{error}</Typography></Box>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h3" sx={{ fontWeight: 600 }}>平台管理</Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" startIcon={<RemixIcon icon="ri-add-line" size="small" />} onClick={handleAdd}>
              添加平台
            </Button>
            <Button variant="outlined" startIcon={<RemixIcon icon="ri-refresh-line" size="small" />} onClick={loadPlatforms}>
              刷新
            </Button>
          </Stack>
        </Stack>

        <Card>
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>名称</TableCell>
                    <TableCell>类型</TableCell>
                    <TableCell>ID</TableCell>
                    <TableCell>状态</TableCell>
                    <TableCell align="right">操作</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {platforms.map((platform) => (
                    <TableRow key={`${platform.type}-${platform.id}`} hover>
                      <TableCell>{platform.name}</TableCell>
                      <TableCell>
                        <Chip label={platform.type} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
                        >
                          {platform.id}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Chip
                            label={platform.enabled ? '已启用' : '已禁用'}
                            color={platform.enabled ? 'success' : 'default'}
                            size="small"
                          />
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {platform.connected}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Switch
                            checked={platform.enabled}
                            onChange={() => handleToggle(platform)}
                            size="small"
                          />
                          <IconButton size="small" onClick={() => handleEdit(platform)}>
                            <RemixIcon icon="ri-edit-line" size="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(platform)}
                            color="error"
                          >
                            <RemixIcon icon="ri-delete-bin-line" size="small" />
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

      {/* 新增/编辑对话框 */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingPlatform ? '编辑平台' : '添加平台'}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="平台类型"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              disabled={!!editingPlatform}
              helperText="如: onebot, qq, telegram 等"
            />
            <TextField
              fullWidth
              label="平台 ID"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              helperText="平台的唯一标识符"
            />
            <TextField
              fullWidth
              label="显示名称"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              helperText="在界面中显示的名称"
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
