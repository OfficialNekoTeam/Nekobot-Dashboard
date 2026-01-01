/**
 * 仪表板页面
 * 显示系统概览和统计信息
 */

import { useEffect, useState } from 'react';

// material-ui
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  LinearProgress,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project imports
import { getDashboardStats } from 'api';
import type { DashboardStats } from 'types/stat';

// ==============================|| DASHBOARD PAGE ||============================== //

export default function DashboardPage() {
  const theme = useTheme();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await getDashboardStats();
        if (response.success && response.data) {
          setStats(response.data);
        } else {
          setError('获取统计数据失败');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取统计数据失败');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>加载中...</Typography>
      </Box>
    );
  }

  if (error || !stats) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error || '加载失败'}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h3" sx={{ mb: 3, fontWeight: 600 }}>
        仪表板
      </Typography>

      <Grid container spacing={3}>
        {/* 插件统计 */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  插件
                </Typography>
                <Typography variant="h4">{stats.plugins.total}</Typography>
                <Stack direction="row" spacing={2}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" sx={{ color: 'success.main' }}>
                      已启用: {stats.plugins.enabled}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: 'error.main' }}>
                    已禁用: {stats.plugins.disabled}
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* 平台统计 */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  平台
                </Typography>
                <Typography variant="h4">{stats.platforms.total}</Typography>
                <Stack direction="row" spacing={2}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" sx={{ color: 'success.main' }}>
                      运行中: {stats.platforms.running}
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: 'error.main' }}>
                      已停止: {stats.platforms.stopped}
                    </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* 消息统计 */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  消息总数
                </Typography>
                <Typography variant="h4">{stats.messages.total}</Typography>
                <Box sx={{ mt: 1 }}>
                  {stats.messages.by_platform.slice(0, 3).map((item) => (
                    <Box key={item.platform} sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption">{item.platform}</Typography>
                      <Typography variant="caption">{item.count}</Typography>
                    </Box>
                  ))}
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* 活跃用户 */}
        {stats.user_activity && (
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Stack spacing={1}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    用户活动
                  </Typography>
                  <Typography variant="h4">{stats.user_activity.active_users}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    总会话数: {stats.user_activity.total_sessions}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* 资源使用情况 */}
      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid size={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                资源使用情况
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box>
                    <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">CPU 使用率</Typography>
                      <Typography variant="body2">{stats.resource_usage.cpu_usage.toFixed(1)}%</Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={stats.resource_usage.cpu_usage}
                      sx={{ height: 8, borderRadius: 1 }}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box>
                    <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">内存使用率</Typography>
                      <Typography variant="body2">{stats.resource_usage.memory_usage.toFixed(1)}%</Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={stats.resource_usage.memory_usage}
                      sx={{ height: 8, borderRadius: 1 }}
                      color="warning"
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box>
                    <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">磁盘使用率</Typography>
                      <Typography variant="body2">{stats.resource_usage.disk_usage.toFixed(1)}%</Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={stats.resource_usage.disk_usage}
                      sx={{ height: 8, borderRadius: 1 }}
                      color="error"
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 统计周期 */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          统计周期: {new Date(stats.period.start_date).toLocaleDateString()} - {new Date(stats.period.end_date).toLocaleDateString()} ({stats.period.days} 天)
        </Typography>
      </Box>
    </Box>
  );
}
