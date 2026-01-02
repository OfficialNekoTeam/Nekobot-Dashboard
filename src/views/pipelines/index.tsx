/**
 * Pipeline 管理页面
 * 管理和监控 Pipeline 流程
 */

import { useState, useEffect } from 'react';

// material-ui
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  Chip,
  Switch,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';

// project imports
import RemixIcon from 'ui-component/RemixIcon';
import {
  getPipelines,
  getPipelineInfo,
  createPipeline,
  deletePipeline,
  executePipeline,
  getPipelineStatus,
  getPipelineStages,
  addPipelineStage,
  removePipelineStage,
  getPipelineConfig,
  updatePipelineConfig,
  type Pipeline,
  type PipelineStage,
  type PipelineConfig,
} from 'api/pipeline';

// ==============================|| PIPELINES PAGE ||============================== //

function TabPanel({ children, value, index }: { children: React.ReactNode; value: number; index: number }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

export default function PipelinesPage() {
  const [loading, setLoading] = useState(false);
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [selectedPipeline, setSelectedPipeline] = useState<Pipeline | null>(null);
  const [executing, setExecuting] = useState<string | null>(null);

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [stagesDialogOpen, setStagesDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Data states
  const [pipelineConfig, setPipelineConfig] = useState<PipelineConfig | null>(null);
  const [pipelineStages, setPipelineStages] = useState<PipelineStage[]>([]);
  const [pipelineStatus, setPipelineStatus] = useState<any>(null);

  // Form states
  const [createForm, setCreateForm] = useState({
    name: '',
    priority: 'normal' as 'low' | 'normal' | 'high',
  });
  const [configForm, setConfigForm] = useState({
    enabled: false,
    priority: 'normal' as 'low' | 'normal' | 'high',
  });
  const [addStageForm, setAddStageForm] = useState({
    stage_name: '',
    priority: 'normal' as 'low' | 'normal' | 'high',
  });

  const loadPipelines = async () => {
    setLoading(true);
    try {
      const response = await getPipelines();
      if (response.success && response.data) {
        setPipelines(response.data.pipelines || []);
      }
    } catch (err) {
      console.error('Failed to load pipelines:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadPipelineConfig = async (pipelineId: string) => {
    try {
      const response = await getPipelineConfig(pipelineId);
      if (response.success && response.data) {
        setPipelineConfig(response.data);
        setConfigForm({
          enabled: response.data.enabled,
          priority: response.data.priority as 'low' | 'normal' | 'high',
        });
      }
    } catch (err) {
      console.error('Failed to load pipeline config:', err);
    }
  };

  const loadPipelineStages = async (pipelineId: string) => {
    try {
      const response = await getPipelineStages(pipelineId);
      if (response.success && response.data) {
        setPipelineStages(response.data.stages || []);
      }
    } catch (err) {
      console.error('Failed to load pipeline stages:', err);
    }
  };

  const loadPipelineStatus = async (pipelineId: string) => {
    try {
      const response = await getPipelineStatus(pipelineId);
      if (response.success && response.data) {
        setPipelineStatus(response.data);
      }
    } catch (err) {
      console.error('Failed to load pipeline status:', err);
    }
  };

  useEffect(() => {
    loadPipelines();
  }, []);

  // Create pipeline
  const handleCreate = async () => {
    if (!createForm.name.trim()) return;
    try {
      const response = await createPipeline(createForm);
      if (response.success) {
        setCreateDialogOpen(false);
        setCreateForm({ name: '', priority: 'normal' });
        await loadPipelines();
      }
    } catch (err) {
      console.error('Failed to create pipeline:', err);
      alert(err instanceof Error ? err.message : '创建 Pipeline 失败');
    }
  };

  // Update config
  const handleUpdateConfig = async () => {
    if (!selectedPipeline) return;
    try {
      await updatePipelineConfig({
        pipeline_id: selectedPipeline.id,
        config: configForm,
      });
      setConfigDialogOpen(false);
      setSelectedPipeline(null);
      await loadPipelines();
      alert('配置更新成功');
    } catch (err) {
      console.error('Failed to update config:', err);
      alert(err instanceof Error ? err.message : '更新配置失败');
    }
  };

  // Add stage
  const handleAddStage = async () => {
    if (!selectedPipeline || !addStageForm.stage_name.trim()) return;
    try {
      await addPipelineStage({
        pipeline_id: selectedPipeline.id,
        stage_name: addStageForm.stage_name,
        priority: addStageForm.priority,
      });
      setAddStageForm({ stage_name: '', priority: 'normal' });
      await loadPipelineStages(selectedPipeline.id);
    } catch (err) {
      console.error('Failed to add stage:', err);
      alert(err instanceof Error ? err.message : '添加阶段失败');
    }
  };

  // Remove stage
  const handleRemoveStage = async (stageIndex: number) => {
    if (!selectedPipeline) return;
    try {
      await removePipelineStage({
        pipeline_id: selectedPipeline.id,
        stage_index: stageIndex,
      });
      await loadPipelineStages(selectedPipeline.id);
    } catch (err) {
      console.error('Failed to remove stage:', err);
      alert(err instanceof Error ? err.message : '移除阶段失败');
    }
  };

  // Delete pipeline
  const handleDelete = async () => {
    if (!selectedPipeline) return;
    try {
      await deletePipeline(selectedPipeline.id);
      setDeleteDialogOpen(false);
      setSelectedPipeline(null);
      await loadPipelines();
    } catch (err) {
      console.error('Failed to delete pipeline:', err);
    }
  };

  // Execute pipeline
  const handleExecute = async (pipelineId: string) => {
    setExecuting(pipelineId);
    try {
      const response = await executePipeline({ pipeline_id: pipelineId });
      if (response.success) {
        console.log('Pipeline executed:', response.data);
      }
    } catch (err) {
      console.error('Failed to execute pipeline:', err);
    } finally {
      setExecuting(null);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'normal':
        return 'info';
      case 'low':
        return 'default';
      default:
        return 'default';
    }
  };

  const getPriorityLabel = (priority: string) => {
    const labels: Record<string, string> = {
      high: '高',
      normal: '普通',
      low: '低',
    };
    return labels[priority] || priority;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        {/* 标题栏 */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h3" sx={{ fontWeight: 600 }}>
            Pipeline 管理
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<RemixIcon icon="ri-refresh-line" size={18} />}
              onClick={loadPipelines}
              disabled={loading}
            >
              刷新
            </Button>
            <Button
              variant="contained"
              startIcon={<RemixIcon icon="ri-add-line" size={18} />}
              onClick={() => setCreateDialogOpen(true)}
            >
              新建 Pipeline
            </Button>
          </Stack>
        </Stack>

        {/* Pipeline 列表 */}
        <Card>
          <CardContent>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : pipelines.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <RemixIcon icon="ri-git-merge-line" size={48} sx={{ color: 'text.secondary', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  暂无 Pipeline
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>名称</TableCell>
                      <TableCell>优先级</TableCell>
                      <TableCell>状态</TableCell>
                      <TableCell>阶段数</TableCell>
                      <TableCell>操作</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pipelines.map((pipeline) => (
                      <TableRow key={pipeline.id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                            {pipeline.id.slice(0, 12)}...
                          </Typography>
                        </TableCell>
                        <TableCell>{pipeline.name || '-'}</TableCell>
                        <TableCell>
                          <Chip
                            label={getPriorityLabel(pipeline.priority)}
                            color={getPriorityColor(pipeline.priority) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={pipeline.enabled ? '启用' : '禁用'}
                            color={pipeline.enabled ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{pipeline.stages_count}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Button
                              size="small"
                              onClick={() => handleExecute(pipeline.id)}
                              disabled={executing === pipeline.id}
                            >
                              {executing === pipeline.id ? '执行中...' : '执行'}
                            </Button>
                            <Button
                              size="small"
                              onClick={() => {
                                setSelectedPipeline(pipeline);
                                loadPipelineConfig(pipeline.id);
                                setConfigDialogOpen(true);
                              }}
                            >
                              配置
                            </Button>
                            <Button
                              size="small"
                              onClick={() => {
                                setSelectedPipeline(pipeline);
                                loadPipelineStages(pipeline.id);
                                setStagesDialogOpen(true);
                              }}
                            >
                              阶段
                            </Button>
                            <Button
                              size="small"
                              onClick={() => {
                                setSelectedPipeline(pipeline);
                                loadPipelineStatus(pipeline.id);
                                setStatusDialogOpen(true);
                              }}
                            >
                              状态
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              onClick={() => {
                                setSelectedPipeline(pipeline);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              删除
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Stack>

      {/* 创建对话框 */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>创建 Pipeline</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="名称"
              value={createForm.name}
              onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
              autoFocus
            />
            <FormControl fullWidth>
              <InputLabel>优先级</InputLabel>
              <Select
                value={createForm.priority}
                onChange={(e) => setCreateForm({ ...createForm, priority: e.target.value as 'low' | 'normal' | 'high' })}
                label="优先级"
              >
                <MenuItem value="low">低</MenuItem>
                <MenuItem value="normal">普通</MenuItem>
                <MenuItem value="high">高</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>取消</Button>
          <Button onClick={handleCreate} variant="contained" disabled={!createForm.name}>
            创建
          </Button>
        </DialogActions>
      </Dialog>

      {/* 配置对话框 */}
      <Dialog open={configDialogOpen} onClose={() => setConfigDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Pipeline 配置 - {selectedPipeline?.name}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>优先级</InputLabel>
              <Select
                value={configForm.priority}
                onChange={(e) => setConfigForm({ ...configForm, priority: e.target.value as 'low' | 'normal' | 'high' })}
                label="优先级"
              >
                <MenuItem value="low">低</MenuItem>
                <MenuItem value="normal">普通</MenuItem>
                <MenuItem value="high">高</MenuItem>
              </Select>
            </FormControl>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Switch
                checked={configForm.enabled}
                onChange={(e) => setConfigForm({ ...configForm, enabled: e.target.checked })}
              />
              <Typography>启用</Typography>
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfigDialogOpen(false)}>取消</Button>
          <Button onClick={handleUpdateConfig} variant="contained">
            保存
          </Button>
        </DialogActions>
      </Dialog>

      {/* 阶段对话框 */}
      <Dialog open={stagesDialogOpen} onClose={() => setStagesDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Pipeline 阶段 - {selectedPipeline?.name}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth
                label="阶段名称"
                value={addStageForm.stage_name}
                onChange={(e) => setAddStageForm({ ...addStageForm, stage_name: e.target.value })}
              />
              <FormControl sx={{ minWidth: 120 }}>
                <InputLabel>优先级</InputLabel>
                <Select
                  value={addStageForm.priority}
                  onChange={(e) => setAddStageForm({ ...addStageForm, priority: e.target.value as 'low' | 'normal' | 'high' })}
                  label="优先级"
                >
                  <MenuItem value="low">低</MenuItem>
                  <MenuItem value="normal">普通</MenuItem>
                  <MenuItem value="high">高</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                onClick={handleAddStage}
                disabled={!addStageForm.stage_name}
              >
                添加
              </Button>
            </Stack>
            {pipelineStages.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                暂无阶段
              </Typography>
            ) : (
              <Stack spacing={1}>
                {pipelineStages.map((stage, index) => (
                  <Card key={index} variant="outlined">
                    <CardContent sx={{ py: 1, px: 2 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {index + 1}. {stage.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            优先级: {getPriorityLabel(stage.priority)}
                          </Typography>
                        </Box>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Chip
                            label={stage.enabled ? '启用' : '禁用'}
                            size="small"
                            color={stage.enabled ? 'success' : 'default'}
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveStage(index)}
                            color="error"
                          >
                            <RemixIcon icon="ri-delete-bin-line" size={16} />
                          </IconButton>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStagesDialogOpen(false)}>关闭</Button>
        </DialogActions>
      </Dialog>

      {/* 状态对话框 */}
      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Pipeline 状态 - {selectedPipeline?.name}</DialogTitle>
        <DialogContent>
          {pipelineStatus ? (
            <Stack spacing={2} sx={{ mt: 2 }}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2">启用状态</Typography>
                <Chip label={pipelineStatus.enabled ? '是' : '否'} size="small" />
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2">运行状态</Typography>
                <Chip
                  label={pipelineStatus.running ? '运行中' : '未运行'}
                  color={pipelineStatus.running ? 'info' : 'default'}
                  size="small"
                />
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2">执行次数</Typography>
                <Typography variant="body2">{pipelineStatus.execution_count}</Typography>
              </Stack>
              {pipelineStatus.last_execution && (
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">最后执行</Typography>
                  <Typography variant="body2">
                    {new Date(pipelineStatus.last_execution).toLocaleString()}
                  </Typography>
                </Stack>
              )}
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
              暂无状态数据
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>关闭</Button>
        </DialogActions>
      </Dialog>

      {/* 删除确认对话框 */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>确认删除</DialogTitle>
        <DialogContent>
          <Typography>
            确定要删除 Pipeline "{selectedPipeline?.name}" 吗？此操作不可撤销。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>取消</Button>
          <Button color="error" onClick={handleDelete}>
            删除
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
