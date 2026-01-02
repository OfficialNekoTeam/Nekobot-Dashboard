/**
 * 备份管理页面
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
} from '@mui/material';

// project imports
import RemixIcon from 'ui-component/RemixIcon';
import { getBackups, createBackup, deleteBackup, downloadBackup, type Backup } from 'api/backup';

// ==============================|| BACKUPS PAGE ||============================== //

export default function BackupsPage() {
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [backups, setBackups] = useState<Backup[]>([]);
  const [selectedBackup, setSelectedBackup] = useState<Backup | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [description, setDescription] = useState('');

  const loadBackups = async () => {
    setLoading(true);
    try {
      const response = await getBackups();
      if (response.success && response.data) {
        setBackups(response.data.backups || []);
      }
    } catch (err) {
      console.error('Failed to load backups:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    setCreating(true);
    try {
      const response = await createBackup(description || undefined);
      if (response.success) {
        setCreateDialogOpen(false);
        setDescription('');
        await loadBackups();
      }
    } catch (err) {
      console.error('Failed to create backup:', err);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedBackup) return;
    try {
      await deleteBackup(selectedBackup.id);
      setBackups(backups.filter((b) => b.id !== selectedBackup.id));
      setDeleteDialogOpen(false);
      setSelectedBackup(null);
    } catch (err) {
      console.error('Failed to delete backup:', err);
    }
  };

  const handleDownload = async (backup: Backup) => {
    try {
      const blob = await downloadBackup(backup.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = backup.filename;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download backup:', err);
    }
  };

  const handleRestore = async (backup: Backup) => {
    if (!confirm(`确定要从备份 "${backup.filename}" 恢复吗？此操作将覆盖当前数据。`)) {
      return;
    }
    try {
      // await restoreBackup(backup.id);
      console.log('Restore backup:', backup.id);
    } catch (err) {
      console.error('Failed to restore backup:', err);
    }
  };

  useEffect(() => {
    loadBackups();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        {/* 标题栏 */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h3" sx={{ fontWeight: 600 }}>
            备份管理
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<RemixIcon icon="ri-refresh-line" size={18} />}
              onClick={loadBackups}
              disabled={loading}
            >
              刷新
            </Button>
            <Button
              variant="contained"
              startIcon={<RemixIcon icon="ri-add-line" size={18} />}
              onClick={() => setCreateDialogOpen(true)}
            >
              创建备份
            </Button>
          </Stack>
        </Stack>

        {/* 备份列表 */}
        <Card>
          <CardContent>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : backups.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <RemixIcon icon="ri-archive-line" size={48} sx={{ color: 'text.secondary', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  暂无备份
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>文件名</TableCell>
                      <TableCell>大小</TableCell>
                      <TableCell>描述</TableCell>
                      <TableCell>创建时间</TableCell>
                      <TableCell>操作</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {backups.map((backup) => (
                      <TableRow key={backup.id} hover>
                        <TableCell>{backup.filename}</TableCell>
                        <TableCell>{backup.size_formatted}</TableCell>
                        <TableCell>{backup.description || '-'}</TableCell>
                        <TableCell>{new Date(backup.created_at).toLocaleString()}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Button
                              size="small"
                              onClick={() => handleDownload(backup)}
                            >
                              下载
                            </Button>
                            <Button
                              size="small"
                              onClick={() => handleRestore(backup)}
                            >
                              恢复
                            </Button>
                            <Button
                              size="small"
                              color="error"
                              onClick={() => {
                                setSelectedBackup(backup);
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

      {/* 创建备份对话框 */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>创建备份</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="描述"
            placeholder="可选，为此备份添加描述"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)} disabled={creating}>
            取消
          </Button>
          <Button onClick={handleCreateBackup} disabled={creating}>
            {creating ? '创建中...' : '创建'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 删除确认对话框 */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>确认删除</DialogTitle>
        <DialogContent>
          <Typography>
            确定要删除备份 "{selectedBackup?.filename}" 吗？此操作不可撤销。
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
