import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import ProtectedRoute from './guards';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard')));

// chat routing
const ChatPage = Loadable(lazy(() => import('views/chat')));

// management routing
const PluginsPage = Loadable(lazy(() => import('views/plugins')));
const PlatformsPage = Loadable(lazy(() => import('views/platforms')));
const LLMProvidersPage = Loadable(lazy(() => import('views/llm-providers')));
const KnowledgeBasesPage = Loadable(lazy(() => import('views/knowledge-bases')));
const CommandsPage = Loadable(lazy(() => import('views/commands')));

// prompts routing
const PersonalitiesPage = Loadable(lazy(() => import('views/personalities')));
const SystemPromptsPage = Loadable(lazy(() => import('views/system-prompts')));
const ToolPromptsPage = Loadable(lazy(() => import('views/tool-prompts')));

// advanced routing
const AgentsPage = Loadable(lazy(() => import('views/agents')));
const PipelinesPage = Loadable(lazy(() => import('views/pipelines')));
const ConversationsPage = Loadable(lazy(() => import('views/conversations')));
const LongTermMemoryPage = Loadable(lazy(() => import('views/long-term-memory')));
const BackupsPage = Loadable(lazy(() => import('views/backups')));

// system routing
const ToolsPage = Loadable(lazy(() => import('views/tools')));
const LogsPage = Loadable(lazy(() => import('views/logs')));
const SettingsPage = Loadable(lazy(() => import('views/settings')));
const ResetPasswordPage = Loadable(lazy(() => import('views/settings/reset-password')));
const AboutPage = Loadable(lazy(() => import('views/about')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: (
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  ),
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      element: <DashboardDefault />
    },
    {
      path: 'chat',
      element: <ChatPage />
    },
    {
      path: 'plugins',
      element: <PluginsPage />
    },
    {
      path: 'platforms',
      element: <PlatformsPage />
    },
    {
      path: 'llm-providers',
      element: <LLMProvidersPage />
    },
    {
      path: 'knowledge-bases',
      element: <KnowledgeBasesPage />
    },
    {
      path: 'commands',
      element: <CommandsPage />
    },
    {
      path: 'personalities',
      element: <PersonalitiesPage />
    },
    {
      path: 'system-prompts',
      element: <SystemPromptsPage />
    },
    {
      path: 'tool-prompts',
      element: <ToolPromptsPage />
    },
    {
      path: 'agents',
      element: <AgentsPage />
    },
    {
      path: 'pipelines',
      element: <PipelinesPage />
    },
    {
      path: 'conversations',
      element: <ConversationsPage />
    },
    {
      path: 'long-term-memory',
      element: <LongTermMemoryPage />
    },
    {
      path: 'backups',
      element: <BackupsPage />
    },
    {
      path: 'tools',
      element: <ToolsPage />
    },
    {
      path: 'logs',
      element: <LogsPage />
    },
    {
      path: 'settings',
      element: <SettingsPage />
    },
    {
      path: 'settings/reset-password',
      element: <ResetPasswordPage />
    },
    {
      path: 'about',
      element: <AboutPage />
    }
  ]
};

export default MainRoutes;
