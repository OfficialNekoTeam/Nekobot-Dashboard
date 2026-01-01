/**
 * 菜单项统一导出
 */

import dashboard from './dashboard';
import chat from './chat';
import management from './management';
import prompts from './prompts';
import system from './system';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [dashboard, chat, management, prompts, system]
};

export default menuItems;
