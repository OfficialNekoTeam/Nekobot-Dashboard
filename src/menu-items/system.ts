// assets - 使用 remixicon
import 'remixicon/fonts/remixicon.css';

// 菜单项类型
import { MenuItem } from './types';

// ==============================|| SYSTEM MENU ITEMS ||============================== //

const system: MenuItem = {
  id: 'system',
  title: '系统',
  type: 'group',
  children: [
    {
      id: 'logs',
      title: '日志查看',
      type: 'item',
      url: '/logs',
      icon: 'ri-file-list-3-line',
      breadcrumbs: true,
    },
    {
      id: 'settings',
      title: '系统设置',
      type: 'item',
      url: '/settings',
      icon: 'ri-settings-3-line',
      breadcrumbs: true,
    },
  ],
};

export default system;
