/**
 * 仪表板页面
 * 显示系统概览和统计信息
 */

import { useEffect, useState, useRef } from 'react';

// material-ui
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  LinearProgress,
  IconButton,
  Chip,
  Alert,
  Button,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project imports
import { getDashboardStats } from 'api';
import RemixIcon from 'ui-component/RemixIcon';

// ==============================|| DASHBOARD PAGE ||============================== //

interface BackendStatsResponse {
  period: {
    start_date: string;
    end_date: string;
    days: number;
  };
  plugins: {
    total: number;
    enabled: number;
    disabled: number;
  };
  platforms: {
    total: number;
    running: number;
    stopped: number;
  };
  messages: {
    total: number;
    by_platform: Array<{
      platform: string;
      messages: number;  // 后端使用 messages 而不是 count
    }>;
  };
  user_activity?: {
    active_users: number;
    new_users?: number;
    total_sessions?: number;  // 后端可能没有这个字段
  };
  resource_usage: {
    cpu_usage: number;
    memory_usage: number;
    disk_usage: number;
  };
  generated_at: string;
}

export default function DashboardPage() {
  const theme = useTheme();
  const [stats, setStats] = useState<BackendStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
      const response = await getDashboardStats();
      if (response.success && response.data) {
        setStats(response.data as BackendStatsResponse);
        setLastUpdated(new Date().toLocaleTimeString());
        setError(null);
      } else {
        setError('获取统计数据失败');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取统计数据失败');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();

    // 设置自动刷新（每60秒）
    refreshIntervalRef.current = setInterval(() => {
      fetchData(true);
    }, 60000);

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, []);

  const StatCard = ({
    title,
    value,
    subtitle,
    color = 'primary',
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    color?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  }) => (
    <Card
      sx={{
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
      }}
    >
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {title}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: `${color}.main` }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {subtitle}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );

  if (loading) {
    return <LinearProgress sx={{ p: 3 }} />;
  }

  if (error || !stats) {
    return (
      <Stack sx={{ p: 3 }} spacing={2}>
        <Alert severity="error">
          {error || '加载失败'}
        </Alert>
        <Button onClick={() => fetchData()} variant="contained">
          重试
        </Button>
      </Stack>
    );
  }

  // 安全获取数据，避免 undefined 错误
  const plugins = stats.plugins || { total: 0, enabled: 0, disabled: 0 };
  const platforms = stats.platforms || { total: 0, running: 0, stopped: 0 };
  const messages = stats.messages || { total: 0, by_platform: [] };
  const resourceUsage = stats.resource_usage || { cpu_usage: 0, memory_usage: 0, disk_usage: 0 };
  const userActivity = stats.user_activity;
  const period = stats.period || { start_date: '', end_date: '', days: 0 };

  // 获取第一个平台的消息（如果有）
  const firstPlatform = messages.by_platform?.[0];
  const firstPlatformText = firstPlatform
    ? `${firstPlatform.platform}: ${firstPlatform.messages}`
    : '';

  return (
    <Box sx={{ p: 3 }}>
      {/* 标题和刷新按钮 */}
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h3" sx={{ fontWeight: 600 }}>
          仪表板
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            icon={<RemixIcon icon="ri-refresh-line" size={16} />}
            label={`最后更新: ${lastUpdated}`}
            size="small"
            variant="outlined"
          />
          <IconButton
            onClick={() => fetchData(true)}
            disabled={isRefreshing}
            color="primary"
            title="手动刷新"
          >
            <RemixIcon icon="ri-refresh-line" sx={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
          </IconButton>
        </Stack>
      </Stack>

      {/* 统计卡片行 */}
      <Grid container spacing={3}>
        {/* 插件统计 */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="插件"
            value={plugins.total}
            subtitle={`已启用: ${plugins.enabled} | 已禁用: ${plugins.disabled}`}
            color="primary"
          />
        </Grid>

        {/* 平台统计 */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="平台"
            value={platforms.total}
            subtitle={`运行中: ${platforms.running} | 已停止: ${platforms.stopped}`}
            color="success"
          />
        </Grid>

        {/* 消息统计 */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="消息总数"
            value={messages.total}
            subtitle={firstPlatformText}
            color="info"
          />
        </Grid>

        {/* 活跃用户 */}
        {userActivity && (
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatCard
              title="用户活动"
              value={userActivity.active_users}
              subtitle={`总会话数: ${userActivity.total_sessions || 0}`}
              color="warning"
            />
          </Grid>
        )}
      </Grid>

      {/* 资源使用情况 */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid size={12}>
          <Card
            sx={{
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: theme.shadows[4],
              },
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                资源使用情况
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      CPU 使用率
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>
                      {resourceUsage.cpu_usage.toFixed(1)}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={resourceUsage.cpu_usage}
                    sx={{
                      height: 10,
                      borderRadius: 2,
                      backgroundColor: 'action.hover',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 2,
                      },
                    }}
                    color={resourceUsage.cpu_usage > 80 ? 'error' : resourceUsage.cpu_usage > 50 ? 'warning' : 'primary'}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      内存使用率
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'warning.main', fontWeight: 600 }}>
                      {resourceUsage.memory_usage.toFixed(1)}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={resourceUsage.memory_usage}
                    sx={{
                      height: 10,
                      borderRadius: 2,
                      backgroundColor: 'action.hover',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 2,
                      },
                    }}
                    color={resourceUsage.memory_usage > 80 ? 'error' : 'warning'}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      磁盘使用率
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'error.main', fontWeight: 600 }}>
                      {resourceUsage.disk_usage.toFixed(1)}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={resourceUsage.disk_usage}
                    sx={{
                      height: 10,
                      borderRadius: 2,
                      backgroundColor: 'action.hover',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 2,
                      },
                    }}
                    color="error"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 统计周期 */}
      <Stack
        direction="row"
        sx={{
          mt: 3,
          pt: 2,
          borderTop: 1,
          borderColor: 'divider',
          justifyContent: 'flex-end',
        }}
      >
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          统计周期: {new Date(period.start_date).toLocaleDateString()} - {new Date(period.end_date).toLocaleDateString()} ({period.days} 天)
        </Typography>
      </Stack>
    </Box>
  );
}
