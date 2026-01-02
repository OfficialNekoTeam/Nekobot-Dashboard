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
  AppBar,
  Toolbar,
  Fab,
  Zoom,
  CircularProgress,
  Chip,
  Avatar,
  styled,
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
import RemixIcon from 'ui-component/RemixIcon';

// ==============================|| CHAT PAGE ||============================== //

// 自定义消息气泡组件
const MessageBubble = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'isUser',
})<{ isUser: boolean }>(({ theme, isUser }) => ({
  padding: theme.spacing(1.5, 2),
  maxWidth: '70%',
  backgroundColor: isUser ? theme.palette.primary.main : theme.palette.background.paper,
  color: isUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
  borderRadius: theme.spacing(2),
  borderBottomLeftRadius: isUser ? theme.spacing(2) : 0,
  borderBottomRightRadius: isUser ? 0 : theme.spacing(2),
  boxShadow: theme.shadows[1],
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: theme.shadows[2],
  },
}));

export default function ChatPage() {
  const theme = useTheme();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

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
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar variant="dense">
          <Stack direction="row" spacing={2} alignItems="center" sx={{ flexGrow: 1 }}>
            <RemixIcon icon="ri-robot-line" size={24} sx={{ color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              聊天管理
            </Typography>
            {currentSession && (
              <Chip
                label={currentSession.summary || '新会话'}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
          </Stack>
          <Button
            startIcon={<RemixIcon icon="ri-add-line" size={18} />}
            variant="contained"
            onClick={handleNewSession}
            disabled={isSending}
            size="small"
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
              display: { xs: currentSessionId ? 'none' : 'block', md: 'block' },
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
                {sessions.map((session, index) => (
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
                          <RemixIcon icon="ri-delete-bin-line" size={16} />
                        </IconButton>
                      )
                    }
                  >
                    <ListItemButton
                      selected={currentSessionId === session.id}
                      onClick={() => setCurrentSessionId(session.id)}
                      disabled={isSending}
                      sx={{
                        transition: 'all 0.2s ease',
                        '&.Mui-selected': {
                          bgcolor: 'primary.main',
                          '&:hover': {
                            bgcolor: 'primary.dark',
                          },
                        },
                      }}
                    >
                      <Avatar
                        sx={{
                          mr: 2,
                          bgcolor: currentSessionId === session.id ? 'primary.contrastText' : 'primary.main',
                          width: 36,
                          height: 36,
                        }}
                      >
                        <RemixIcon icon="ri-chat-3-line" size={16} />
                      </Avatar>
                      <ListItemText
                        primary={session.summary || '新会话'}
                        secondary={`${new Date(session.created_at).toLocaleString()} · ${session.message_count} 条消息`}
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

              {/* 移动端新建会话按钮 */}
              <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: { md: 'none' } }}>
                <Button
                  fullWidth
                  startIcon={<RemixIcon icon="ri-add-line" size={18} />}
                  variant="contained"
                  onClick={handleNewSession}
                  disabled={isSending}
                >
                  新建会话
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* 聊天区域 */}
          <Grid size={{ xs: 12, md: 9, lg: 9.5 }} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {currentSessionId ? (
              <>
                {/* 消息列表 */}
                <Box
                  ref={messagesContainerRef}
                  sx={{
                    flexGrow: 1,
                    overflow: 'auto',
                    p: 3,
                    bgcolor: theme.palette.background.default,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
                      <Stack spacing={2} alignItems="center">
                        <CircularProgress />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          加载消息中...
                        </Typography>
                      </Stack>
                    </Box>
                  ) : messages.length === 0 ? (
                    <Box
                      sx={{
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                      }}
                    >
                      <Zoom in>
                        <Stack spacing={3} alignItems="center">
                          <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main' }}>
                            <RemixIcon icon="ri-robot-line" size={48} />
                          </Avatar>
                          <Stack spacing={1}>
                            <Typography variant="h5" sx={{ fontWeight: 600 }}>
                              你好，我是 NekoBot
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 400 }}>
                              我是一个智能助手，随时准备回答你的问题。开始聊天吧！
                            </Typography>
                          </Stack>
                        </Stack>
                      </Zoom>
                    </Box>
                  ) : (
                    <Stack spacing={2} sx={{ flexGrow: 0 }}>
                      {messages.map((message, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: 'flex',
                            justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                            animation: 'fadeIn 0.3s ease',
                          }}
                        >
                          <Stack
                            direction={message.role === 'user' ? 'row-reverse' : 'row'}
                            spacing={1}
                            alignItems="flex-start"
                            sx={{ maxWidth: '70%' }}
                          >
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                bgcolor: message.role === 'user' ? 'primary.main' : 'secondary.main',
                              }}
                            >
                              {message.role === 'user' ? (
                                <RemixIcon icon="ri-chat-3-line" size={16} />
                              ) : (
                                <RemixIcon icon="ri-robot-line" size={16} />
                              )}
                            </Avatar>
                            <MessageBubble isUser={message.role === 'user'}>
                              <Typography
                                variant="body2"
                                sx={{
                                  whiteSpace: 'pre-wrap',
                                  wordBreak: 'break-word',
                                  lineHeight: 1.6,
                                }}
                              >
                                {message.content}
                              </Typography>
                            </MessageBubble>
                          </Stack>
                        </Box>
                      ))}
                      {isSending && (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                          <Stack direction="row" spacing={1} alignItems="flex-start">
                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                              <RemixIcon icon="ri-robot-line" size={16} />
                            </Avatar>
                            <MessageBubble isUser={false}>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <CircularProgress size={16} />
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                  正在思考...
                                </Typography>
                              </Stack>
                            </MessageBubble>
                          </Stack>
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
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                        },
                      }}
                    />
                    <IconButton
                      color="primary"
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isSending}
                      sx={{
                        alignSelf: 'flex-end',
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        '&:hover': {
                          bgcolor: 'primary.dark',
                        },
                        '&:disabled': {
                          bgcolor: 'action.disabledBackground',
                          color: 'text.disabled',
                        },
                      }}
                    >
                      <RemixIcon icon="ri-send-plane-fill" size={18} />
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
                <Stack spacing={3} alignItems="center">
                  <Avatar sx={{ width: 100, height: 100, bgcolor: 'primary.main' }}>
                    <RemixIcon icon="ri-robot-line" size={60} />
                  </Avatar>
                  <Stack spacing={1} alignItems="center" textAlign="center">
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      欢迎使用 NekoBot 聊天
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: 400 }}>
                      选择或创建一个会话开始聊天
                    </Typography>
                  </Stack>
                  <Zoom in>
                    <Fab
                      color="primary"
                      aria-label="新建会话"
                      onClick={handleNewSession}
                      sx={{
                        position: 'relative',
                        mt: 2,
                      }}
                    >
                      <RemixIcon icon="ri-add-line" size={18} />
                    </Fab>
                  </Zoom>
                </Stack>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
