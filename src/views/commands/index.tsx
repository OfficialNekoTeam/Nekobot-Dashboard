/**
 * 命令管理页面
 * 管理机器人命令
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
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  ToggleButton,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project imports
import {
  getCommands,
  toggleCommand,
  renameCommand,
  getCommandConflicts,
} from 'api';
import type { Command, CommandsResponse } from 'types/command';

// project imports
import RemixIcon from 'ui-component/RemixIcon';

// ==============================|| COMMANDS PAGE ||============================== //

export default function CommandsPage() {
  const theme = useTheme();
  const [commandsData, setCommandsData] = useState<CommandsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [conflicts, setConflicts] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCommand, setSelectedCommand] = useState<Command | null>(null);
  const [formData, setFormData] = useState({
    new_name: '',
    aliases: [] as string[],
  });

  // 加载命令列表
  const loadCommands = async () => {
    try {
      setLoading(true);
      const [commandsRes, conflictsRes] = await Promise.all([
        getCommands(),
        getCommandConflicts(),
      ]);

      if (commandsRes.success && commandsRes.data) {
        setCommandsData(commandsRes.data);
      }
      if (conflictsRes.success && conflictsRes.data) {
        setConflicts(conflictsRes.data);
      }
    } catch (err) {
      console.error('Failed to load commands:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCommands();
  }, []);

  // 切换命令状态
  const handleToggle = async (command: Command) => {
    try {
      await toggleCommand({
        handler_full_name: command.handler_full_name,
        enabled: !command.enabled,
      });
      loadCommands();
    } catch (err) {
      console.error('Failed to toggle command:', err);
    }
  };

  // 打开重命名对话框
  const handleRename = (command: Command) => {
    setSelectedCommand(command);
    setFormData({
      new_name: command.handler_name,
      aliases: command.aliases,
    });
    setDialogOpen(true);
  };

  // 保存重命名
  const handleSave = async () => {
    try {
      await renameCommand({
        handler_full_name: selectedCommand!.handler_full_name,
        new_name: formData.new_name,
        aliases: formData.aliases,
      });
      setDialogOpen(false);
      loadCommands();
    } catch (err) {
      console.error('Failed to rename command:', err);
    }
  };

  if (loading) {
    return <Box sx={{ p: 3 }}><Typography>加载中...</Typography></Box>;
  }

  if (!commandsData) {
    return <Box sx={{ p: 3 }}><Typography>加载失败</Typography></Box>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h3" sx={{ fontWeight: 600 }}>
            命令管理
          </Typography>
          <Button variant="outlined" startIcon={<RemixIcon icon="ri-refresh-line" size="small" />} onClick={loadCommands}>
            刷新
          </Button>
        </Stack>

        {/* 统计卡片 */}
        <Stack direction="row" spacing={2}>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="h4">{commandsData.summary.total}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  总命令数
                </Typography>
              </Stack>
            </CardContent>
          </Card>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Typography variant="h4" sx={{ color: 'success.main' }}>
                  {commandsData.summary.total - commandsData.summary.disabled}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  已启用
                </Typography>
              </Stack>
            </CardContent>
          </Card>
          {commandsData.summary.conflicts > 0 && (
            <Card sx={{ flex: 1, bgcolor: 'warning.light' }}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <RemixIcon icon="ri-alarm-warning-fill" sx={{ color: 'warning.main' }} />
                  <Typography variant="h4" sx={{ color: 'warning.dark' }}>
                    {commandsData.summary.conflicts}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    冲突
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          )}
        </Stack>

        {/* 命令列表 */}
        <Card>
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>命令</TableCell>
                    <TableCell>插件</TableCell>
                    <TableCell>别名</TableCell>
                    <TableCell>权限</TableCell>
                    <TableCell>状态</TableCell>
                    <TableCell align="right">操作</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {commandsData.items.map((cmd) => (
                    <TableRow key={cmd.handler_full_name} hover>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="body1" sx={{ fontWeight: 500, fontFamily: 'monospace' }}>
                            {cmd.effective_command}
                          </Typography>
                          {cmd.has_conflict && (
                            <RemixIcon icon="ri-alarm-warning-fill" size="small" sx={{ color: 'warning.main' }} />
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip label={cmd.plugin} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        {cmd.aliases.length > 0 ? (
                          <Stack direction="row" spacing={0.5}>
                            {cmd.aliases.map((alias, idx) => (
                              <Chip
                                key={idx}
                                label={alias}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                          </Stack>
                        ) : (
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            无
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={cmd.permission || 'default'}
                          size="small"
                          color={cmd.permission === 'admin' ? 'error' : 'default'}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={cmd.enabled ? '已启用' : '已禁用'}
                          color={cmd.enabled ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <ToggleButton
                            value="checked"
                            selected={cmd.enabled}
                            onChange={() => handleToggle(cmd)}
                            size="small"
                            sx={{
                              '&.Mui-selected': {
                                bgcolor: 'success.main',
                                color: 'success.contrastText',
                              },
                            }}
                          >
                            {cmd.enabled ? '已启用' : '已禁用'}
                          </ToggleButton>
                          <IconButton size="small" onClick={() => handleRename(cmd)}>
                            <RemixIcon icon="ri-edit-line" size="small" />
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

        {/* 冲突列表 */}
        {conflicts.length > 0 && (
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: 'warning.main' }}>
                命令冲突
              </Typography>
              <List>
                {conflicts.map((conflict, idx) => (
                  <ListItem key={idx}>
                    <ListItemText
                      primary={`冲突: ${conflict.command1} vs ${conflict.command2}`}
                      secondary={`类型: ${conflict.conflict_type}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}
      </Stack>

      {/* 重命名对话框 */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>重命名命令</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="当前命令"
              value={selectedCommand?.effective_command || ''}
              disabled
            />
            <TextField
              fullWidth
              label="新命令名"
              value={formData.new_name}
              onChange={(e) => setFormData({ ...formData, new_name: e.target.value })}
              placeholder="输入新的命令名称"
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
