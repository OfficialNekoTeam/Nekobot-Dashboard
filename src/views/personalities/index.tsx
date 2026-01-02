/**
 * 人格管理页面
 * 管理 AI 人设
 */

import { useEffect, useState } from 'react';

// material-ui
import {
  Box,
  Button,
  Card,
  CardContent,
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
import {
  getPersonalities,
  createPersonality,
  updatePersonality,
  deletePersonality,
} from 'api/personality';
import type { Personality } from 'api/personality';

// project imports
import RemixIcon from 'ui-component/RemixIcon';

// ==============================|| PERSONALITIES PAGE ||============================== //

export default function PersonalitiesPage() {
  const [personalities, setPersonalities] = useState<Personality[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Personality | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    prompt: '',
    enabled: true,
  });

  // 加载数据
  const loadData = async () => {
    try {
      setLoading(true);
      const response = await getPersonalities();
      if (response.success && response.data) {
        setPersonalities(response.data.personalities || []);
      }
    } catch (err) {
      console.error('Failed to load personalities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 打开新增对话框
  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      prompt: '',
      enabled: true,
    });
    setDialogOpen(true);
  };

  // 打开编辑对话框
  const handleEdit = (item: Personality) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      prompt: item.prompt,
      enabled: item.enabled,
    });
    setDialogOpen(true);
  };

  // 保存
  const handleSave = async () => {
    try {
      if (editingItem) {
        await updatePersonality({
          id: editingItem.name,
          ...formData,
        });
      } else {
        await createPersonality(formData);
      }
      setDialogOpen(false);
      loadData();
    } catch (err) {
      console.error('Failed to save personality:', err);
    }
  };

  // 切换启用状态
  const handleToggle = async (item: Personality) => {
    try {
      await updatePersonality({
        id: item.name,
        enabled: !item.enabled,
      });
      loadData();
    } catch (err) {
      console.error('Failed to toggle personality:', err);
    }
  };

  // 删除
  const handleDelete = async (item: Personality) => {
    if (!confirm(`确定要删除人格 "${item.name}" 吗？`)) {
      return;
    }
    try {
      await deletePersonality({ name: item.name });
      loadData();
    } catch (err) {
      console.error('Failed to delete personality:', err);
    }
  };

  if (loading) {
    return <Box sx={{ p: 3 }}><Typography>加载中...</Typography></Box>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h3" sx={{ fontWeight: 600 }}>
            人格管理
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" startIcon={<RemixIcon icon="ri-add-line" size="small" />} onClick={handleAdd}>
              创建人格
            </Button>
            <Button variant="outlined" startIcon={<RemixIcon icon="ri-refresh-line" size="small" />} onClick={loadData}>
              刷新
            </Button>
          </Stack>
        </Stack>

        {/* 人格列表 */}
        <Card>
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>名称</TableCell>
                    <TableCell>描述</TableCell>
                    <TableCell>提示词预览</TableCell>
                    <TableCell>状态</TableCell>
                    <TableCell align="right">操作</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {personalities.map((item) => (
                    <TableRow key={item.name} hover>
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {item.name}
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
                          {item.description || '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="caption"
                          sx={{
                            maxWidth: 400,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontFamily: 'monospace',
                          }}
                        >
                          {item.prompt}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={item.enabled}
                          onChange={() => handleToggle(item)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <IconButton size="small" onClick={() => handleEdit(item)}>
                            <RemixIcon icon="ri-edit-line" size="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(item)}
                            color="error"
                          >
                            <RemixIcon icon="ri-delete-bin-line" size="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {personalities.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          暂无人格，点击上方按钮创建
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
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingItem ? '编辑人格' : '创建人格'}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="名称"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="输入人格名称"
              disabled={!!editingItem}
            />
            <TextField
              fullWidth
              label="描述"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="输入人格描述"
            />
            <TextField
              fullWidth
              label="提示词"
              value={formData.prompt}
              onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
              placeholder="输入系统提示词"
              multiline
              rows={8}
            />
            <Stack direction="row" spacing={2} alignItems="center">
              <Switch
                checked={formData.enabled}
                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
              />
              <Typography variant="body2">启用</Typography>
            </Stack>
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
