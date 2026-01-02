/**
 * Agent 管理页面
 * 管理和监控系统 Agent
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
  Alert,
} from '@mui/material';

// project imports
import RemixIcon from 'ui-component/RemixIcon';
import {
  getAgents,
  getAgentInfo,
  getAgentConfig,
  updateAgentConfig,
  getAgentHooks,
  addAgentHook,
  removeAgentHook,
  getAgentMetrics,
  getAgentLogs,
  executeAgent,
  type Agent,
  type AgentConfig,
  type AgentHookInfo,
} from 'api/agent';

// ==============================|| AGENTS PAGE ||============================== //

function TabPanel({ children, value, index }: { children: React.ReactNode; value: number; index: number }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

export default function AgentsPage() {
  const [loading, setLoading] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  // Dialog states
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  const [hooksDialogOpen, setHooksDialogOpen] = useState(false);
  const [metricsDialogOpen, setMetricsDialogOpen] = useState(false);
  const [logsDialogOpen, setLogsDialogOpen] = useState(false);
  const [executeDialogOpen, setExecuteDialogOpen] = useState(false);

  // Data states
  const [agentConfig, setAgentConfig] = useState<AgentConfig | null>(null);
  const [agentHooks, setAgentHooks] = useState<AgentHookInfo[]>([]);
  const [agentMetrics, setAgentMetrics] = useState<any>(null);
  const [agentLogs, setAgentLogs] = useState<any[]>([]);

  // Form states
  const [configForm, setConfigForm] = useState<Partial<AgentConfig>>({});
  const [executeMessage, setExecuteMessage] = useState('');
  const [executeResult, setExecuteResult] = useState<any>(null);
  const [executing, setExecuting] = useState(false);

  const loadAgents = async () => {
    setLoading(true);
    try {
      const response = await getAgents();
      if (response.success && response.data) {
        setAgents(response.data.agents || []);
      }
    } catch (err) {
      console.error('Failed to load agents:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadAgentConfig = async (agentId: string) => {
    try {
      const response = await getAgentConfig(agentId);
      if (response.success && response.data) {
        setAgentConfig(response.data);
        setConfigForm(response.data);
      }
    } catch (err) {
      console.error('Failed to load agent config:', err);
    }
  };

  const loadAgentHooks = async (agentId: string) => {
    try {
      const response = await getAgentHooks(agentId);
      if (response.success && response.data) {
        setAgentHooks(response.data.hooks || []);
      }
    } catch (err) {
      console.error('Failed to load agent hooks:', err);
    }
  };

  const loadAgentMetrics = async (agentId: string) => {
    try {
      const response = await getAgentMetrics(agentId);
      if (response.success && response.data) {
        setAgentMetrics(response.data);
      }
    } catch (err) {
      console.error('Failed to load agent metrics:', err);
    }
  };

  const loadAgentLogs = async (agentId: string) => {
    try {
      const response = await getAgentLogs(agentId, 50);
      if (response.success && response.data) {
        setAgentLogs(response.data.logs || []);
      }
    } catch (err) {
      console.error('Failed to load agent logs:', err);
    }
  };

  useEffect(() => {
    loadAgents();
  }, []);

  // Update config
  const handleUpdateConfig = async () => {
    if (!selectedAgent) return;
    try {
      await updateAgentConfig(selectedAgent.id, configForm);
      setConfigDialogOpen(false);
      setSelectedAgent(null);
      await loadAgents();
      alert('配置更新成功');
    } catch (err) {
      console.error('Failed to update config:', err);
      alert(err instanceof Error ? err.message : '更新配置失败');
    }
  };

  // Add hook
  const handleAddHook = async (hookType: 'logging' | 'metrics') => {
    if (!selectedAgent) return;
    try {
      await addAgentHook(selectedAgent.id, hookType);
      await loadAgentHooks(selectedAgent.id);
    } catch (err) {
      console.error('Failed to add hook:', err);
      alert(err instanceof Error ? err.message : '添加 Hook 失败');
    }
  };

  // Remove hook
  const handleRemoveHook = async (hookIndex: number) => {
    if (!selectedAgent) return;
    try {
      await removeAgentHook(selectedAgent.id, hookIndex);
      await loadAgentHooks(selectedAgent.id);
    } catch (err) {
      console.error('Failed to remove hook:', err);
      alert(err instanceof Error ? err.message : '移除 Hook 失败');
    }
  };

  // Execute agent
  const handleExecute = async () => {
    if (!selectedAgent || !executeMessage.trim()) return;
    setExecuting(true);
    setExecuteResult(null);
    try {
      const response = await executeAgent({
        agent_id: selectedAgent.id,
        message: executeMessage,
      });
      if (response.success && response.data) {
        setExecuteResult(response.data);
      }
    } catch (err) {
      console.error('Failed to execute agent:', err);
      setExecuteResult({ error: err instanceof Error ? err.message : '执行失败' });
    } finally {
      setExecuting(false);
    }
  };

  // Open dialogs
  const openConfigDialog = async (agent: Agent) => {
    setSelectedAgent(agent);
    await loadAgentConfig(agent.id);
    setConfigDialogOpen(true);
  };

  const openHooksDialog = async (agent: Agent) => {
    setSelectedAgent(agent);
    await loadAgentHooks(agent.id);
    setHooksDialogOpen(true);
  };

  const openMetricsDialog = async (agent: Agent) => {
    setSelectedAgent(agent);
    await loadAgentMetrics(agent.id);
    setMetricsDialogOpen(true);
  };

  const openLogsDialog = async (agent: Agent) => {
    setSelectedAgent(agent);
    await loadAgentLogs(agent.id);
    setLogsDialogOpen(true);
  };

  const openExecuteDialog = (agent: Agent) => {
    setSelectedAgent(agent);
    setExecuteMessage('');
    setExecuteResult(null);
    setExecuteDialogOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        {/* 标题栏 */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h3" sx={{ fontWeight: 600 }}>
            Agent 管理
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<RemixIcon icon="ri-refresh-line" size={18} />}
              onClick={loadAgents}
              disabled={loading}
            >
              刷新
            </Button>
          </Stack>
        </Stack>

        {/* Agent 列表 */}
        <Card>
          <CardContent>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : agents.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <RemixIcon icon="ri-robot-line" size={48} sx={{ color: 'text.secondary', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  暂无 Agent
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>名称</TableCell>
                      <TableCell>类型</TableCell>
                      <TableCell>操作</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {agents.map((agent) => (
                      <TableRow key={agent.id} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                            {agent.id.slice(0, 12)}...
                          </Typography>
                        </TableCell>
                        <TableCell>{agent.name || '-'}</TableCell>
                        <TableCell>
                          <Chip
                            label={agent.type === 'llm' ? 'LLM' : 'Composite'}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Button size="small" onClick={() => openConfigDialog(agent)}>
                              配置
                            </Button>
                            <Button size="small" onClick={() => openHooksDialog(agent)}>
                              Hooks
                            </Button>
                            <Button size="small" onClick={() => openExecuteDialog(agent)}>
                              执行
                            </Button>
                            <Button size="small" onClick={() => openMetricsDialog(agent)}>
                              指标
                            </Button>
                            <Button size="small" onClick={() => openLogsDialog(agent)}>
                              日志
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

      {/* 配置对话框 */}
      <Dialog open={configDialogOpen} onClose={() => setConfigDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Agent 配置 - {selectedAgent?.name}</DialogTitle>
        <DialogContent>
          {agentConfig && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="LLM 服务商 ID"
                  value={configForm.llm_provider_id || ''}
                  onChange={(e) => setConfigForm({ ...configForm, llm_provider_id: e.target.value })}
                  disabled
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="模型"
                  value={configForm.model || ''}
                  onChange={(e) => setConfigForm({ ...configForm, model: e.target.value })}
                  disabled
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="温度"
                  type="number"
                  value={configForm.temperature ?? 0.7}
                  onChange={(e) => setConfigForm({ ...configForm, temperature: parseFloat(e.target.value) })}
                  inputProps={{ min: 0, max: 2, step: 0.1 }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="最大 Token 数"
                  type="number"
                  value={configForm.max_tokens ?? 2048}
                  onChange={(e) => setConfigForm({ ...configForm, max_tokens: parseInt(e.target.value) })}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="系统提示词"
                  value={configForm.system_prompt || ''}
                  onChange={(e) => setConfigForm({ ...configForm, system_prompt: e.target.value })}
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Switch
                    checked={configForm.enable_stream ?? false}
                    onChange={(e) => setConfigForm({ ...configForm, enable_stream: e.target.checked })}
                  />
                  <Typography>启用流式响应</Typography>
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Switch
                    checked={configForm.enable_tools ?? false}
                    onChange={(e) => setConfigForm({ ...configForm, enable_tools: e.target.checked })}
                  />
                  <Typography>启用工具</Typography>
                </Stack>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfigDialogOpen(false)}>取消</Button>
          <Button onClick={handleUpdateConfig} variant="contained">
            保存
          </Button>
        </DialogActions>
      </Dialog>

      {/* Hooks 对话框 */}
      <Dialog open={hooksDialogOpen} onClose={() => setHooksDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Agent Hooks - {selectedAgent?.name}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleAddHook('logging')}
              >
                添加日志 Hook
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleAddHook('metrics')}
              >
                添加指标 Hook
              </Button>
            </Stack>
            <Box>
              {agentHooks.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                  暂无 Hooks
                </Typography>
              ) : (
                <Stack spacing={1}>
                  {agentHooks.map((hook, index) => (
                    <Card key={index} variant="outlined">
                      <CardContent sx={{ py: 1, px: 2 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {hook.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {hook.type}
                            </Typography>
                          </Box>
                          <IconButton size="small" onClick={() => handleRemoveHook(index)} color="error">
                            <RemixIcon icon="ri-delete-bin-line" size={16} />
                          </IconButton>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHooksDialogOpen(false)}>关闭</Button>
        </DialogActions>
      </Dialog>

      {/* 执行对话框 */}
      <Dialog open={executeDialogOpen} onClose={() => setExecuteDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>执行 Agent - {selectedAgent?.name}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="消息"
              value={executeMessage}
              onChange={(e) => setExecuteMessage(e.target.value)}
              multiline
              rows={3}
              placeholder="输入要发送给 Agent 的消息..."
            />
            {executeResult && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    执行结果
                  </Typography>
                  <pre style={{
                    background: '#f5f5f5',
                    padding: '12px',
                    borderRadius: '4px',
                    overflow: 'auto',
                    maxHeight: '300px',
                  }}>
                    {JSON.stringify(executeResult, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExecuteDialogOpen(false)}>关闭</Button>
          <Button
            onClick={handleExecute}
            variant="contained"
            disabled={!executeMessage.trim() || executing}
          >
            {executing ? '执行中...' : '执行'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 指标对话框 */}
      <Dialog open={metricsDialogOpen} onClose={() => setMetricsDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Agent 指标 - {selectedAgent?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {agentMetrics ? (
              <pre style={{
                background: '#f5f5f5',
                padding: '12px',
                borderRadius: '4px',
                overflow: 'auto',
              }}>
                {JSON.stringify(agentMetrics, null, 2)}
              </pre>
            ) : (
              <Typography variant="body2" color="text.secondary">
                暂无指标数据
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMetricsDialogOpen(false)}>关闭</Button>
        </DialogActions>
      </Dialog>

      {/* 日志对话框 */}
      <Dialog open={logsDialogOpen} onClose={() => setLogsDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Agent 日志 - {selectedAgent?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {agentLogs.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                暂无日志
              </Typography>
            ) : (
              <Box sx={{ maxHeight: '400px', overflow: 'auto' }}>
                {agentLogs.map((log, index) => (
                  <Typography key={index} variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                    {JSON.stringify(log)}
                  </Typography>
                ))}
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogsDialogOpen(false)}>关闭</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
