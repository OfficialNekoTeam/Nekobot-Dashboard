/**
 * 长期记忆管理页面
 */

import { useState, useEffect } from 'react';

// material-ui
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
} from '@mui/material';

// project imports
import RemixIcon from 'ui-component/RemixIcon';
import {
  getMemories,
  getMemoryStats,
  setMemory,
  deleteMemory,
  searchMemories,
  clearExpiredMemories,
  type Memory,
  type MemoryStats,
} from 'api/long-term-memory';

// ==============================|| LONG TERM MEMORY PAGE ||============================== //

function TabPanel({ children, value, index }: { children: React.ReactNode; value: number; index: number }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

export default function LongTermMemoryPage() {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [stats, setStats] = useState<MemoryStats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Memory[]>([]);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const loadMemories = async () => {
    setLoading(true);
    try {
      const response = await getMemories();
      if (response.success && response.data) {
        setMemories(response.data.memories || []);
      }
    } catch (err) {
      console.error('Failed to load memories:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await getMemoryStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const response = await searchMemories(searchQuery);
      if (response.success && response.data) {
        setSearchResults(response.data.memories || []);
      }
    } catch (err) {
      console.error('Failed to search memories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await setMemory(newKey, newValue);
      if (response.success) {
        setCreateDialogOpen(false);
        setNewKey('');
        setNewValue('');
        await loadMemories();
      }
    } catch (err) {
      console.error('Failed to create memory:', err);
    }
  };

  const handleDelete = async () => {
    if (!selectedMemory) return;
    try {
      await deleteMemory(selectedMemory.id);
      setMemories(memories.filter((m) => m.id !== selectedMemory.id));
      setDeleteDialogOpen(false);
      setSelectedMemory(null);
    } catch (err) {
      console.error('Failed to delete memory:', err);
    }
  };

  const handleClearExpired = async () => {
    if (!confirm('确定要清除所有过期记忆吗？')) return;
    try {
      const response = await clearExpiredMemories();
      if (response.success) {
        alert(`已清除 ${response.data?.deleted_count || 0} 条过期记忆`);
        await loadMemories();
        await loadStats();
      }
    } catch (err) {
      console.error('Failed to clear expired memories:', err);
    }
  };

  useEffect(() => {
    loadMemories();
    loadStats();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        {/* 标题栏 */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h3" sx={{ fontWeight: 600 }}>
            长期记忆管理
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<RemixIcon icon="ri-refresh-line" size={18} />}
              onClick={loadMemories}
              disabled={loading}
            >
              刷新
            </Button>
            <Button
              variant="outlined"
              color="warning"
              startIcon={<RemixIcon icon="ri-delete-bin-line" size={18} />}
              onClick={handleClearExpired}
            >
              清除过期
            </Button>
            <Button
              variant="contained"
              startIcon={<RemixIcon icon="ri-add-line" size={18} />}
              onClick={() => setCreateDialogOpen(true)}
            >
              添加记忆
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
                      总记忆数
                    </Typography>
                    <Typography variant="h4">{stats.total_memories}</Typography>
                  </Box>
                  <RemixIcon icon="ri-database-2-line" size={32} sx={{ color: 'primary.main' }} />
                </Stack>
              </CardContent>
            </Card>
            <Card sx={{ flex: 1 }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      用户数
                    </Typography>
                    <Typography variant="h4">{stats.total_users}</Typography>
                  </Box>
                  <RemixIcon icon="ri-user-line" size={32} sx={{ color: 'secondary.main' }} />
                </Stack>
              </CardContent>
            </Card>
            <Card sx={{ flex: 1 }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      存储大小
                    </Typography>
                    <Typography variant="h4">{stats.size_formatted}</Typography>
                  </Box>
                  <RemixIcon icon="ri-hard-drive-2-line" size={32} sx={{ color: 'success.main' }} />
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        )}

        {/* 选项卡 */}
        <Card>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
              <Tab label="所有记忆" />
              <Tab label="搜索" />
            </Tabs>
          </Box>

          <CardContent>
            <TabPanel value={tabValue} index={0}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : memories.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <RemixIcon icon="ri-brain-line" size={48} sx={{ color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    暂无记忆
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>键</TableCell>
                        <TableCell>值</TableCell>
                        <TableCell>用户 ID</TableCell>
                        <TableCell>创建时间</TableCell>
                        <TableCell>操作</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {memories.map((memory) => (
                        <TableRow key={memory.id} hover>
                          <TableCell>{memory.id}</TableCell>
                          <TableCell>{memory.key}</TableCell>
                          <TableCell>
                            <Typography
                              sx={{
                                maxWidth: 300,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {JSON.stringify(memory.value)}
                            </Typography>
                          </TableCell>
                          <TableCell>{memory.user_id || '-'}</TableCell>
                          <TableCell>{new Date(memory.created_at).toLocaleString()}</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <Button size="small">查看</Button>
                              <Button
                                size="small"
                                color="error"
                                onClick={() => {
                                  setSelectedMemory(memory);
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
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Stack spacing={2}>
                <Stack direction="row" spacing={2}>
                  <TextField
                    fullWidth
                    placeholder="搜索记忆..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleSearch}
                    disabled={!searchQuery.trim()}
                  >
                    搜索
                  </Button>
                </Stack>

                {searchResults.length > 0 && (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>键</TableCell>
                          <TableCell>值</TableCell>
                          <TableCell>用户 ID</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {searchResults.map((memory) => (
                          <TableRow key={memory.id} hover>
                            <TableCell>{memory.id}</TableCell>
                            <TableCell>{memory.key}</TableCell>
                            <TableCell>{JSON.stringify(memory.value)}</TableCell>
                            <TableCell>{memory.user_id || '-'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Stack>
            </TabPanel>
          </CardContent>
        </Card>
      </Stack>

      {/* 创建记忆对话框 */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>添加记忆</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="键"
              placeholder="记忆的唯一标识"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
            />
            <TextField
              fullWidth
              label="值"
              placeholder="记忆的值（JSON 格式）"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              multiline
              rows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>取消</Button>
          <Button onClick={handleCreate} variant="contained" disabled={!newKey || !newValue}>
            添加
          </Button>
        </DialogActions>
      </Dialog>

      {/* 删除确认对话框 */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>确认删除</DialogTitle>
        <DialogContent>
          <Typography>
            确定要删除记忆 "{selectedMemory?.key}" 吗？此操作不可撤销。
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
