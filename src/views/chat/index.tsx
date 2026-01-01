/**
 * 聊天管理页面
 * 管理聊天会话和消息
 */

import { useEffect, useState, useCallback, useRef } from 'react';

// material-ui
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
  Fab,
  AppBar,
  Toolbar,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project imports
import {
  createNewSession,
  getSessions,
  getSession,
  deleteSession,
  sendMessageStream,
} from 'api/chat';
import type { ChatSession, ChatMessage } from 'types/chat';

// assets
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';

// ==============================|| CHAT PAGE ||============================== //

export default function ChatPage() {
  const theme = useTheme();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 加载会话列表
  const loadSessions = useCallback(async () => {
    try {
      const response = await getSessions();
      if (response.success && response.data) {
        setSessions(response.data.sessions);
        // 如果有会话且没有当前选中的会话，自动选择第一个
        if (response.data.sessions.length > 0 && !currentSessionId) {
          setCurrentSessionId(response.data.sessions[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  }, [currentSessionId]);

  // 加载当前会话的消息
  const loadSessionMessages = useCallback(async (sessionId: string) => {
    try {
      setIsLoading(true);
      const response = await getSession(sessionId);
      if (response.success && response.data) {
        setMessages(response.data.messages);
      }
    } catch (error) {
      console.error('Failed to load session:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 创建新会话
  const handleNewSession = async () => {
    try {
      const response = await createNewSession();
      if (response.success && response.data) {
        setCurrentSessionId(response.data.session_id);
        setMessages([]);
        await loadSessions();
      }
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  // 删除会话
  const handleDeleteSession = async (sessionId: string) => {
    try {
      await deleteSession(sessionId);
      if (currentSessionId === sessionId) {
        setCurrentSessionId(null);
        setMessages([]);
      }
      await loadSessions();
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  };

  // 发送消息
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !currentSessionId || isSending) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsSending(true);

    // 添加用户消息
    const userMsg: ChatMessage = {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    // 使用流式响应
    let assistantMessage = '';
    const assistantMsg: ChatMessage = {
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
    };

    try {
      const cancel = sendMessageStream(
        {
          message: userMessage,
          session_id: currentSessionId,
          enable_streaming: true,
        },
        (text: string) => {
          assistantMessage += text;
          setMessages((prev) => {
            const newMessages = [...prev];
            const lastMsg = newMessages[newMessages.length - 1];
            if (lastMsg?.role === 'assistant') {
              lastMsg.content = assistantMessage;
            } else {
              newMessages.push({ ...assistantMsg, content: assistantMessage });
            }
            return newMessages;
          });
        },
        (error: string) => {
          console.error('Stream error:', error);
        },
        () => {
          setIsSending(false);
        }
      );

      return () => cancel();
    } catch (error) {
      console.error('Failed to send message:', error);
      setIsSending(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  // 当选择的会话变化时，加载会话消息
  useEffect(() => {
    if (currentSessionId) {
      loadSessionMessages(currentSessionId);
    }
  }, [currentSessionId, loadSessionMessages]);

  // 滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const currentSession = sessions.find((s) => s.id === currentSessionId);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 顶部工具栏 */}
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar variant="dense">
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            聊天管理
          </Typography>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={handleNewSession}
            disabled={isSending}
          >
            新建会话
          </Button>
        </Toolbar>
      </AppBar>

      {/* 主体内容 */}
      <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden' }}>
        <Grid container sx={{ height: '100%' }}>
          {/* 会话列表 */}
          <Grid
            size={{ xs: 12, md: 3, lg: 2.5 }}
            sx={{
              borderRight: 1,
              borderColor: 'divider',
              height: '100%',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'background.paper',
              }}
            >
              <List sx={{ flexGrow: 1, overflow: 'auto', p: 0 }}>
                {sessions.map((session) => (
                  <ListItem
                    key={session.id}
                    disablePadding
                    secondaryAction={
                      session.id === currentSessionId && (
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={() => handleDeleteSession(session.id)}
                          disabled={isSending}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )
                    }
                  >
                    <ListItemButton
                      selected={currentSessionId === session.id}
                      onClick={() => setCurrentSessionId(session.id)}
                      disabled={isSending}
                    >
                      <ListItemText
                        primary={session.summary || '新会话'}
                        secondary={`${new Date(session.created_at).toLocaleString()} - ${session.message_count} 条消息`}
                        primaryTypographyProps={{
                          sx: {
                            fontWeight: currentSessionId === session.id ? 600 : 400,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          },
                        }}
                        secondaryTypographyProps={{
                          sx: {
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          },
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>

          {/* 聊天区域 */}
          <Grid size={{ xs: 12, md: 9, lg: 9.5 }} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {currentSessionId ? (
              <>
                {/* 消息列表 */}
                <Box
                  sx={{
                    flexGrow: 1,
                    overflow: 'auto',
                    p: 2,
                    bgcolor: theme.palette.background.default,
                  }}
                >
                  {isLoading ? (
                    <Typography sx={{ textAlign: 'center', mt: 4 }}>加载中...</Typography>
                  ) : messages.length === 0 ? (
                    <Typography sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>
                      暂无消息，开始聊天吧
                    </Typography>
                  ) : (
                    <Stack spacing={2}>
                      {messages.map((message, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: 'flex',
                            justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                          }}
                        >
                          <Paper
                            elevation={1}
                            sx={{
                              p: 2,
                              maxWidth: '70%',
                              bgcolor: message.role === 'user' ? 'primary.main' : 'background.paper',
                              color: message.role === 'user' ? 'primary.contrastText' : 'text.primary',
                            }}
                          >
                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                              {message.content}
                            </Typography>
                          </Paper>
                        </Box>
                      ))}
                      {isSending && (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                          <Paper elevation={1} sx={{ p: 2, bgcolor: 'background.paper' }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              正在输入...
                            </Typography>
                          </Paper>
                        </Box>
                      )}
                      <div ref={messagesEndRef} />
                    </Stack>
                  )}
                </Box>

                {/* 输入区域 */}
                <Divider />
                <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
                  <Stack direction="row" spacing={1}>
                    <TextField
                      fullWidth
                      multiline
                      maxRows={4}
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="输入消息... (Enter 发送，Shift+Enter 换行)"
                      disabled={isSending}
                      size="small"
                    />
                    <IconButton
                      color="primary"
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isSending}
                      sx={{ alignSelf: 'flex-end' }}
                    >
                      <SendIcon />
                    </IconButton>
                  </Stack>
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: theme.palette.background.default,
                }}
              >
                <Stack spacing={2} alignItems="center">
                  <Typography variant="h6" color="text.secondary">
                    选择或创建一个会话开始聊天
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleNewSession}
                  >
                    新建会话
                  </Button>
                </Stack>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
