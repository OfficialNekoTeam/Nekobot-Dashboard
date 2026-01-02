import { memo } from 'react';

// material-ui
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// ==============================|| ABOUT PAGE ||============================== //

function AboutPage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        {/* Header */}
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Box
              component="img"
              src="/logo.png"
              alt="NekoBot"
              sx={{ width: 80, height: 80, mb: 2 }}
            />
            <Typography variant="h3" gutterBottom>
              NekoBot Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              基于 React 和 Material-UI 的聊天机器人管理面板
            </Typography>
          </CardContent>
        </Card>

        {/* Information Cards */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 30%' }, minWidth: 250 }}>
            <MainCard>
              <Stack spacing={2}>
                <Box className="ri-information-line" sx={{ fontSize: 40, color: 'primary.main' }} />
                <Typography variant="h5">关于项目</Typography>
                <Typography variant="body2" color="text.secondary">
                  NekoBot 是一个功能强大的聊天机器人管理系统，支持多平台接入、插件扩展、知识库管理等功能。
                </Typography>
              </Stack>
            </MainCard>
          </Box>

          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 30%' }, minWidth: 250 }}>
            <MainCard>
              <Stack spacing={2}>
                <Box className="ri-shield-check-line" sx={{ fontSize: 40, color: 'success.main' }} />
                <Typography variant="h5">版本信息</Typography>
                <Typography variant="body2" color="text.secondary">
                  当前版本: {import.meta.env.VITE_APP_VERSION || '1.0.0'}
                </Typography>
              </Stack>
            </MainCard>
          </Box>

          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 30%' }, minWidth: 250 }}>
            <MainCard>
              <Stack spacing={2}>
                <Box className="ri-team-line" sx={{ fontSize: 40, color: 'secondary.main' }} />
                <Typography variant="h5">开发团队</Typography>
                <Typography variant="body2" color="text.secondary">
                  NekoBot Team
                </Typography>
              </Stack>
            </MainCard>
          </Box>
        </Box>

        {/* Features */}
        <MainCard title="主要功能">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ flex: { xs: '1 1 50%', md: '1 1 25%' }, minWidth: 150 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box className="ri-chat-3-line" sx={{ fontSize: 24, color: 'primary.main' }} />
                <Typography variant="body2">多平台聊天管理</Typography>
              </Stack>
            </Box>
            <Box sx={{ flex: { xs: '1 1 50%', md: '1 1 25%' }, minWidth: 150 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box className="ri-plugin-line" sx={{ fontSize: 24, color: 'primary.main' }} />
                <Typography variant="body2">插件系统</Typography>
              </Stack>
            </Box>
            <Box sx={{ flex: { xs: '1 1 50%', md: '1 1 25%' }, minWidth: 150 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box className="ri-book-2-line" sx={{ fontSize: 24, color: 'primary.main' }} />
                <Typography variant="body2">知识库管理</Typography>
              </Stack>
            </Box>
            <Box sx={{ flex: { xs: '1 1 50%', md: '1 1 25%' }, minWidth: 150 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box className="ri-brain-line" sx={{ fontSize: 24, color: 'primary.main' }} />
                <Typography variant="body2">LLM 接入</Typography>
              </Stack>
            </Box>
            <Box sx={{ flex: { xs: '1 1 50%', md: '1 1 25%' }, minWidth: 150 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box className="ri-terminal-box-line" sx={{ fontSize: 24, color: 'primary.main' }} />
                <Typography variant="body2">命令管理</Typography>
              </Stack>
            </Box>
            <Box sx={{ flex: { xs: '1 1 50%', md: '1 1 25%' }, minWidth: 150 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box className="ri-file-list-3-line" sx={{ fontSize: 24, color: 'primary.main' }} />
                <Typography variant="body2">日志查看</Typography>
              </Stack>
            </Box>
            <Box sx={{ flex: { xs: '1 1 50%', md: '1 1 25%' }, minWidth: 150 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box className="ri-settings-3-line" sx={{ fontSize: 24, color: 'primary.main' }} />
                <Typography variant="body2">系统设置</Typography>
              </Stack>
            </Box>
            <Box sx={{ flex: { xs: '1 1 50%', md: '1 1 25%' }, minWidth: 150 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Box className="ri-emotion-line" sx={{ fontSize: 24, color: 'primary.main' }} />
                <Typography variant="body2">人格管理</Typography>
              </Stack>
            </Box>
          </Box>
        </MainCard>

        {/* Tech Stack */}
        <MainCard title="技术栈">
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ flex: { xs: '1 1 33%', sm: '1 1 25%', md: '1 1 16%' }, minWidth: 100 }}>
              <Stack spacing={1} alignItems="center">
                <Box className="ri-reactjs-line" sx={{ fontSize: 32, color: '#61DAFB' }} />
                <Typography variant="body2">React 19</Typography>
              </Stack>
            </Box>
            <Box sx={{ flex: { xs: '1 1 33%', sm: '1 1 25%', md: '1 1 16%' }, minWidth: 100 }}>
              <Stack spacing={1} alignItems="center">
                <Box className="ri-material-ui-line" sx={{ fontSize: 32, color: '#007FFF' }} />
                <Typography variant="body2">Material-UI</Typography>
              </Stack>
            </Box>
            <Box sx={{ flex: { xs: '1 1 33%', sm: '1 1 25%', md: '1 1 16%' }, minWidth: 100 }}>
              <Stack spacing={1} alignItems="center">
                <Box className="ri-code-s-slash-line" sx={{ fontSize: 32, color: '#3178C6' }} />
                <Typography variant="body2">TypeScript</Typography>
              </Stack>
            </Box>
            <Box sx={{ flex: { xs: '1 1 33%', sm: '1 1 25%', md: '1 1 16%' }, minWidth: 100 }}>
              <Stack spacing={1} alignItems="center">
                <Box className="ri-router-line" sx={{ fontSize: 32, color: '#CA4245' }} />
                <Typography variant="body2">React Router</Typography>
              </Stack>
            </Box>
            <Box sx={{ flex: { xs: '1 1 33%', sm: '1 1 25%', md: '1 1 16%' }, minWidth: 100 }}>
              <Stack spacing={1} alignItems="center">
                <Box className="ri-layout-grid-line" sx={{ fontSize: 32, color: '#FF6B6B' }} />
                <Typography variant="body2">Vite</Typography>
              </Stack>
            </Box>
            <Box sx={{ flex: { xs: '1 1 33%', sm: '1 1 25%', md: '1 1 16%' }, minWidth: 100 }}>
              <Stack spacing={1} alignItems="center">
                <Box className="ri-refresh-line" sx={{ fontSize: 32, color: '#F59E0B' }} />
                <Typography variant="body2">SWR</Typography>
              </Stack>
            </Box>
          </Box>
        </MainCard>

        {/* Footer */}
        <Typography variant="body2" color="text.secondary" align="center">
          &copy; {new Date().getFullYear()} NekoBot Team. All rights reserved.
        </Typography>
      </Stack>
    </Container>
  );
}

export default memo(AboutPage);
