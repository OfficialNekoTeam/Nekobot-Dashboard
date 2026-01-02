// assets - 使用 remixicon
import 'remixicon/fonts/remixicon.css';

// 菜单项类型
import { MenuItem } from './types';

// ==============================|| ADVANCED MENU ITEMS ||============================== //

const advanced: MenuItem = {
  id: 'advanced',
  title: '高级功能',
  type: 'group',
  children: [
    {
      id: 'agents',
      title: 'Agent 管理',
      type: 'item',
      url: '/agents',
      icon: 'ri-robot-2-line',
      breadcrumbs: true,
    },
    {
      id: 'pipelines',
      title: 'Pipeline 管理',
      type: 'item',
      url: '/pipelines',
      icon: 'ri-git-merge-line',
      breadcrumbs: true,
    },
    {
      id: 'conversations',
      title: '对话管理',
      type: 'item',
      url: '/conversations',
      icon: 'ri-message-2-line',
      breadcrumbs: true,
    },
    {
      id: 'long-term-memory',
      title: '长期记忆',
      type: 'item',
      url: '/long-term-memory',
      icon: 'ri-brain-line',
      breadcrumbs: true,
    },
    {
      id: 'backups',
      title: '备份管理',
      type: 'item',
      url: '/backups',
      icon: 'ri-archive-line',
      breadcrumbs: true,
    },
  ],
};

export default advanced;
