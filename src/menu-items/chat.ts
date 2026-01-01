// assets - 使用 remixicon
import 'remixicon/fonts/remixicon.css';

// 菜单项类型
import { MenuItem } from './types';

// ==============================|| CHAT MENU ITEMS ||============================== //

const chat: MenuItem = {
  id: 'chat',
  title: '聊天',
  type: 'group',
  children: [
    {
      id: 'chat-sessions',
      title: '聊天会话',
      type: 'item',
      url: '/chat',
      icon: 'ri-chat-3-line',
      breadcrumbs: true,
    },
  ],
};

export default chat;
