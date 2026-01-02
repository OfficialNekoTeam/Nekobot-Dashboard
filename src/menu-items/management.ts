// assets - 使用 remixicon
import 'remixicon/fonts/remixicon.css';

// 菜单项类型
import { MenuItem } from './types';

// ==============================|| MANAGEMENT MENU ITEMS ||============================== //

const management: MenuItem = {
  id: 'management',
  title: '管理',
  type: 'group',
  children: [
    {
      id: 'plugins',
      title: '插件管理',
      type: 'item',
      url: '/plugins',
      icon: 'ri-apps-line',
      breadcrumbs: true,
    },
    {
      id: 'platforms',
      title: '平台管理',
      type: 'item',
      url: '/platforms',
      icon: 'ri-robot-line',
      breadcrumbs: true,
    },
    {
      id: 'llm-providers',
      title: 'LLM 服务商',
      type: 'item',
      url: '/llm-providers',
      icon: 'ri-openai-fill',
      breadcrumbs: true,
    },
    {
      id: 'knowledge-bases',
      title: '知识库',
      type: 'item',
      url: '/knowledge-bases',
      icon: 'ri-database-2-line',
      breadcrumbs: true,
    },
    {
      id: 'commands',
      title: '命令管理',
      type: 'item',
      url: '/commands',
      icon: 'ri-terminal-box-line',
      breadcrumbs: true,
    },
  ],
};

export default management;
