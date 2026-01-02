/**
 * 知识库管理页面
 * 管理向量知识库
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
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

// project imports
import {
  getKnowledgeBases,
  createKnowledgeBase,
  updateKnowledgeBase,
  deleteKnowledgeBase,
  addDocument,
  deleteDocument,
  getKnowledgeBaseStats,
} from 'api';
import type { KnowledgeBase, KnowledgeBaseStats, KnowledgeBaseDocument } from 'types/knowledge-base';

// project imports
import RemixIcon from 'ui-component/RemixIcon';

// ==============================|| KNOWLEDGE BASES PAGE ||============================== //

export default function KnowledgeBasesPage() {
  const [kbs, setKbs] = useState<KnowledgeBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKb, setSelectedKb] = useState<KnowledgeBase | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [kbStats, setKbStats] = useState<Record<string, KnowledgeBaseStats>>({});
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    embedding_model: 'openai',
  });

  // 加载知识库列表
  const loadKnowledgeBases = async () => {
    try {
      setLoading(true);
      const response = await getKnowledgeBases();
      if (response.success && response.data) {
        setKbs(response.data);
        // 加载每个知识库的统计
        for (const kb of response.data) {
          try {
            const statsRes = await getKnowledgeBaseStats(kb.id);
            if (statsRes.success && statsRes.data) {
              setKbStats((prev) => ({ ...prev, [kb.id]: statsRes.data }));
            }
          } catch (err) {
            console.error(`Failed to load stats for ${kb.id}:`, err);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load knowledge bases:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKnowledgeBases();
  }, []);

  // 打开新增对话框
  const handleAdd = () => {
    setFormData({
      id: '',
      name: '',
      description: '',
      embedding_model: 'openai',
    });
    setDialogOpen(true);
  };

  // 保存知识库
  const handleSave = async () => {
    try {
      await createKnowledgeBase(formData as any);
      setDialogOpen(false);
      loadKnowledgeBases();
    } catch (err) {
      console.error('Failed to create knowledge base:', err);
    }
  };

  // 删除知识库
  const handleDelete = async (kb: KnowledgeBase) => {
    if (!confirm(`确定要删除知识库 "${kb.name}" 吗？`)) {
      return;
    }
    try {
      await deleteKnowledgeBase(kb.id);
      if (selectedKb?.id === kb.id) {
        setSelectedKb(null);
      }
      loadKnowledgeBases();
    } catch (err) {
      console.error('Failed to delete knowledge base:', err);
    }
  };

  // 选择知识库查看详情
  const handleSelectKb = async (kb: KnowledgeBase) => {
    setSelectedKb(kb);
    setTabValue(1);
  };

  if (loading) {
    return <Box sx={{ p: 3 }}><Typography>加载中...</Typography></Box>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h3" sx={{ fontWeight: 600 }}>
            知识库管理
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" startIcon={<RemixIcon icon="ri-add-line" size="small" />} onClick={handleAdd}>
              创建知识库
            </Button>
            <Button variant="outlined" startIcon={<RemixIcon icon="ri-refresh-line" size="small" />} onClick={loadKnowledgeBases}>
              刷新
            </Button>
          </Stack>
        </Stack>

        {/* 知识库列表 */}
        <Grid container spacing={2}>
          {kbs.map((kb) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={kb.id}>
              <Card
                sx={{
                  cursor: 'pointer',
                  border: selectedKb?.id === kb.id ? 2 : 1,
                  borderColor: selectedKb?.id === kb.id ? 'primary.main' : 'divider',
                }}
                onClick={() => handleSelectKb(kb)}
              >
                <CardContent>
                  <Stack spacing={2}>
                    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {kb.name}
                      </Typography>
                      <Stack direction="row">
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDelete(kb); }}>
                          <RemixIcon icon="ri-delete-bin-line" size="small" />
                        </IconButton>
                      </Stack>
                    </Stack>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {kb.description || '暂无描述'}
                    </Typography>
                    <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        文档数: {kbStats[kb.id]?.total_documents || 0}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        模型: {kb.embedding_model}
                      </Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
          {kbs.length === 0 && (
            <Grid size={12}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    暂无知识库，点击上方按钮创建
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Stack>

      {/* 新增知识库对话框 */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>创建知识库</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="知识库 ID"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              placeholder="唯一标识符，仅限字母、数字、下划线和连字符"
            />
            <TextField
              fullWidth
              label="名称"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="知识库显示名称"
            />
            <TextField
              fullWidth
              label="描述"
              multiline
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="知识库用途说明"
            />
            <TextField
              fullWidth
              label="嵌入模型"
              value={formData.embedding_model}
              onChange={(e) => setFormData({ ...formData, embedding_model: e.target.value })}
              select
            >
              <MenuItem value="openai">OpenAI</MenuItem>
              <MenuItem value="ollama">Ollama</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>取消</Button>
          <Button variant="contained" onClick={handleSave}>创建</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
