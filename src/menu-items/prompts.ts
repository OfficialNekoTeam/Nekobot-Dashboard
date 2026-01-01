// assets - 使用 remixicon
import 'remixicon/fonts/remixicon.css';

// 菜单项类型
import { MenuItem } from './types';

// ==============================|| PROMPTS MENU ITEMS ||============================== //

const prompts: MenuItem = {
  id: 'prompts',
  title: '提示词',
  type: 'group',
  children: [
    {
      id: 'personalities',
      title: '人格管理',
      type: 'item',
      url: '/personalities',
      icon: 'ri-user-smile-line',
      breadcrumbs: true,
    },
    {
      id: 'system-prompts',
      title: '系统提示词',
      type: 'item',
      url: '/system-prompts',
      icon: 'ri-file-text-line',
      breadcrumbs: true,
    },
    {
      id: 'tool-prompts',
      title: '工具提示词',
      type: 'item',
      url: '/tool-prompts',
      icon: 'ri-tools-line',
      breadcrumbs: true,
    },
  ],
};

export default prompts;
