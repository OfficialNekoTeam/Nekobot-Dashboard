/**
 * 系统提示词管理页面
 * 管理系统级提示词
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
} from '@mui/material';

// project imports
import {
  getSystemPrompts,
  createSystemPrompt,
  updateSystemPrompt,
  deleteSystemPrompt,
} from 'api/system-prompt';
import type { SystemPrompt } from 'api/system-prompt';

// project imports
import RemixIcon from 'ui-component/RemixIcon';

// ==============================|| SYSTEM PROMPTS PAGE ||============================== //

export default function SystemPromptsPage() {
  const [prompts, setPrompts] = useState<SystemPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SystemPrompt | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    prompt: '',
  });

  // 加载数据
  const loadData = async () => {
    try {
      setLoading(true);
      const response = await getSystemPrompts();
      if (response.success && response.data) {
        setPrompts(response.data.system_prompts || []);
      }
    } catch (err) {
      console.error('Failed to load system prompts:', err);
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
    });
    setDialogOpen(true);
  };

  // 打开编辑对话框
  const handleEdit = (item: SystemPrompt) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      prompt: item.prompt,
    });
    setDialogOpen(true);
  };

  // 保存
  const handleSave = async () => {
    try {
      if (editingItem) {
        await updateSystemPrompt({
          name: editingItem.name,
          prompt: formData.prompt,
          description: formData.description,
        });
      } else {
        await createSystemPrompt(formData);
      }
      setDialogOpen(false);
      loadData();
    } catch (err) {
      console.error('Failed to save system prompt:', err);
    }
  };

  // 删除
  const handleDelete = async (item: SystemPrompt) => {
    if (item.name === 'default') {
      alert('不能删除默认系统提示词');
      return;
    }
    if (!confirm(`确定要删除系统提示词 "${item.name}" 吗？`)) {
      return;
    }
    try {
      await deleteSystemPrompt({ name: item.name });
      loadData();
    } catch (err) {
      console.error('Failed to delete system prompt:', err);
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
            系统提示词
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" startIcon={<RemixIcon icon="ri-add-line" size="small" />} onClick={handleAdd}>
              创建提示词
            </Button>
            <Button variant="outlined" startIcon={<RemixIcon icon="ri-refresh-line" size="small" />} onClick={loadData}>
              刷新
            </Button>
          </Stack>
        </Stack>

        {/* 提示词列表 */}
        <Card>
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>名称</TableCell>
                    <TableCell>描述</TableCell>
                    <TableCell>提示词内容</TableCell>
                    <TableCell align="right">操作</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {prompts.map((item) => (
                    <TableRow key={item.name} hover>
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {item.name}
                          {item.name === 'default' && (
                            <Typography component="span" variant="caption" sx={{ ml: 1, color: 'primary.main' }}>
                              (默认)
                            </Typography>
                          )}
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
                          variant="body2"
                          sx={{
                            maxWidth: 500,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontFamily: 'monospace',
                            fontSize: '0.875rem',
                          }}
                        >
                          {item.prompt}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <IconButton size="small" onClick={() => handleEdit(item)}>
                            <RemixIcon icon="ri-edit-line" size="small" />
                          </IconButton>
                          {item.name !== 'default' && (
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(item)}
                              color="error"
                            >
                              <RemixIcon icon="ri-delete-bin-line" size="small" />
                            </IconButton>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {prompts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          暂无系统提示词，点击上方按钮创建
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
        <DialogTitle>{editingItem ? '编辑系统提示词' : '创建系统提示词'}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="名称"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="输入提示词名称"
              disabled={!!editingItem}
            />
            <TextField
              fullWidth
              label="描述"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="输入提示词描述"
            />
            <TextField
              fullWidth
              label="提示词内容"
              value={formData.prompt}
              onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
              placeholder="输入系统提示词内容"
              multiline
              rows={10}
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
