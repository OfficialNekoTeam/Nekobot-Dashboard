// assets - 使用 remixicon 替换 @tabler/icons-react
import 'remixicon/fonts/remixicon.css';

// 菜单项类型
import { MenuItem } from './types';

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard: MenuItem = {
  id: 'dashboard',
  title: '仪表板',
  type: 'group',
  children: [
    {
      id: 'default',
      title: '概览',
      type: 'item',
      url: '/dashboard',
      icon: 'ri-dashboard-line',
      breadcrumbs: false,
    },
  ],
};

export default dashboard;
