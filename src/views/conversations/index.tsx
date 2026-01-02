/**
 * 对话管理页面
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
} from '@mui/material';

// project imports
import RemixIcon from 'ui-component/RemixIcon';
import { getConversations, deleteConversation, type Conversation } from 'api/conversation';

// ==============================|| CONVERSATIONS PAGE ||============================== //

export default function ConversationsPage() {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const loadConversations = async () => {
    setLoading(true);
    try {
      const response = await getConversations();
      if (response.success && response.data) {
        setConversations(response.data.conversations || []);
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedConv) return;
    try {
      await deleteConversation(selectedConv.id);
      setConversations(conversations.filter((c) => c.id !== selectedConv.id));
      setDeleteDialogOpen(false);
      setSelectedConv(null);
    } catch (err) {
      console.error('Failed to delete conversation:', err);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3}>
        {/* 标题栏 */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h3" sx={{ fontWeight: 600 }}>
            对话管理
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<RemixIcon icon="ri-refresh-line" size={18} />}
              onClick={loadConversations}
              disabled={loading}
            >
              刷新
            </Button>
            <Button
              variant="contained"
              startIcon={<RemixIcon icon="ri-add-line" size={18} />}
            >
              新建对话
            </Button>
          </Stack>
        </Stack>

        {/* 对话列表 */}
        <Card>
          <CardContent>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : conversations.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <RemixIcon icon="ri-message-2-line" size={48} sx={{ color: 'text.secondary', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  暂无对话
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>会话 ID</TableCell>
                      <TableCell>消息数</TableCell>
                      <TableCell>创建时间</TableCell>
                      <TableCell>更新时间</TableCell>
                      <TableCell>操作</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {conversations.map((conv) => (
                      <TableRow key={conv.id} hover>
                        <TableCell>{conv.id}</TableCell>
                        <TableCell>{conv.session_id}</TableCell>
                        <TableCell>{conv.message_count}</TableCell>
                        <TableCell>{new Date(conv.created_at).toLocaleString()}</TableCell>
                        <TableCell>{new Date(conv.updated_at).toLocaleString()}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Button size="small">查看</Button>
                            <Button
                              size="small"
                              color="error"
                              onClick={() => {
                                setSelectedConv(conv);
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

      {/* 删除确认对话框 */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>确认删除</DialogTitle>
        <DialogContent>
          <Typography>
            确定要删除此对话吗？此操作不可撤销。
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
