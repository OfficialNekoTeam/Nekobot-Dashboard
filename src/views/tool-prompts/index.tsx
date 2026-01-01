/**
 * 工具提示词管理页面
 * 管理工具级提示词
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
  getToolPrompts,
  createToolPrompt,
  updateToolPrompt,
  deleteToolPrompt,
} from 'api/tool-prompt';
import type { ToolPrompt } from 'api/tool-prompt';

// assets
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

// ==============================|| TOOL PROMPTS PAGE ||============================== //

export default function ToolPromptsPage() {
  const [prompts, setPrompts] = useState<ToolPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ToolPrompt | null>(null);
  const [formData, setFormData] = useState({
    tool_name: '',
    description: '',
    prompt: '',
  });

  // 加载数据
  const loadData = async () => {
    try {
      setLoading(true);
      const response = await getToolPrompts();
      if (response.success && response.data) {
        setPrompts(response.data.tool_prompts || []);
      }
    } catch (err) {
      console.error('Failed to load tool prompts:', err);
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
      tool_name: '',
      description: '',
      prompt: '',
    });
    setDialogOpen(true);
  };

  // 打开编辑对话框
  const handleEdit = (item: ToolPrompt) => {
    setEditingItem(item);
    setFormData({
      tool_name: item.tool_name,
      description: item.description,
      prompt: item.prompt,
    });
    setDialogOpen(true);
  };

  // 保存
  const handleSave = async () => {
    try {
      if (editingItem) {
        await updateToolPrompt({
          tool_name: editingItem.tool_name,
          prompt: formData.prompt,
          description: formData.description,
        });
      } else {
        await createToolPrompt(formData);
      }
      setDialogOpen(false);
      loadData();
    } catch (err) {
      console.error('Failed to save tool prompt:', err);
    }
  };

  // 删除
  const handleDelete = async (item: ToolPrompt) => {
    if (!confirm(`确定要删除工具提示词 "${item.tool_name}" 吗？`)) {
      return;
    }
    try {
      await deleteToolPrompt({ tool_name: item.tool_name });
      loadData();
    } catch (err) {
      console.error('Failed to delete tool prompt:', err);
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
            工具提示词
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
              创建提示词
            </Button>
            <Button variant="outlined" startIcon={<RefreshIcon />} onClick={loadData}>
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
                    <TableCell>工具名称</TableCell>
                    <TableCell>描述</TableCell>
                    <TableCell>提示词内容</TableCell>
                    <TableCell align="right">操作</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {prompts.map((item) => (
                    <TableRow key={item.tool_name} hover>
                      <TableCell>
                        <Typography variant="body1" sx={{ fontWeight: 500, fontFamily: 'monospace' }}>
                          {item.tool_name}
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
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(item)}
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {prompts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          暂无工具提示词，点击上方按钮创建
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
        <DialogTitle>{editingItem ? '编辑工具提示词' : '创建工具提示词'}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="工具名称"
              value={formData.tool_name}
              onChange={(e) => setFormData({ ...formData, tool_name: e.target.value })}
              placeholder="输入工具名称（如：web_search）"
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
              placeholder="输入工具提示词内容"
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
