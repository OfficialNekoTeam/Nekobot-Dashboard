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

// system routing
const LogsPage = Loadable(lazy(() => import('views/logs')));
const SettingsPage = Loadable(lazy(() => import('views/settings')));

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
      path: 'logs',
      element: <LogsPage />
    },
    {
      path: 'settings',
      element: <SettingsPage />
    }
  ]
};

export default MainRoutes;
