# NekoBot 前端管理后台

基于 React 19 + TypeScript + Vite + Material-UI 构建的现代化机器人管理后台系统。

## 技术栈

- **React 19.2.0** - UI框架
- **TypeScript 5.9** - 类型安全
- **Vite 7.2.6** - 构建工具
- **Material-UI 7.3.6** - UI组件库
- **React Router DOM 7.11.0** - 路由管理
- **Axios 1.13.2** - HTTP客户端
- **TailwindCSS 4.1.18** - CSS框架
- **i18next** - 国际化支持

## 项目结构

```
src/
├── api/                    # API服务层 - 与后端API对接
│   ├── auth.ts           # 认证API
│   ├── bot.ts            # 机器人配置API
│   ├── system.ts         # 系统监控API
│   ├── stat.ts           # 统计数据API
│   ├── plugin.ts         # 插件管理API
│   ├── platform.ts       # 平台管理API
│   ├── log.ts           # 日志API
│   ├── settings.ts       # 设置API
│   ├── llm.ts           # LLM提供商API
│   ├── session.ts        # 会话管理API
│   ├── command.ts        # 命令管理API
│   ├── personality.ts    # 人设管理API
│   ├── prompt.ts        # 提示词管理API
│   ├── chat.ts          # 聊天API
│   ├── mcp.ts           # MCP配置API
│   └── hot-reload.ts     # 热重载API
├── assets/              # 静态资源
├── components/          # 通用组件
├── config/             # 配置文件
├── contexts/           # React Context (认证、主题等)
│   ├── AuthContext.tsx   # 认证上下文
│   └── ...
├── hooks/              # 自定义Hooks
│   ├── useLocalStorage.ts
│   └── ...
├── layout/             # 布局组件
├── menu-items/         # 菜单配置
│   ├── types.ts         # 菜单类型定义
│   ├── dashboard.ts      # 仪表盘菜单
│   ├── management.ts     # 管理菜单
│   └── index.ts         # 菜单导出
├── routes/             # 路由配置
│   └── index.tsx       # 路由定义
├── store/              # 状态管理
├── themes/             # 主题配置
│   └── index.tsx       # 主题定制化
├── types/              # TypeScript类型定义
│   └── api.ts          # API类型
├── utils/              # 工具函数
│   └── request.ts       # Axios请求封装
├── views/              # 页面组件
│   ├── pages/          # 页面组件
│   │   └── auth-forms/
│   │       └── AuthLogin.tsx  # 登录页
│   ├── dashboard/       # 仪表盘
│   ├── system-monitor/  # 系统监控
│   ├── plugin-management/ # 插件管理
│   ├── platform-management/# 平台管理
│   ├── settings/        # 设置页面
│   ├── log-viewer/      # 日志查看
│   ├── personality-management/# 人设管理
│   ├── prompt-management/ # 提示词管理
│   ├── command-management/# 命令管理
│   ├── chat/           # 聊天页面
│   └── llm-management/   # LLM管理
└── main.tsx           # 应用入口
```

## 功能模块

### 已实现功能

1. **认证模块**
   - 用户登录/登出
   - 修改密码
   - Token管理
   - 权限验证

2. **仪表盘**
   - 系统概览
   - 插件统计
   - 平台统计
   - 消息统计
   - 资源使用率
   - 版本信息展示

3. **系统监控**
   - CPU使用率监控
   - 内存使用率监控
   - 磁盘使用率监控
   - 网络连接状态
   - 进程信息监控
   - 实时数据刷新（5秒间隔）

4. **插件管理**
   - 插件列表展示
   - 启用/禁用插件
   - 插件重载
   - 上传插件
   - 删除插件
   - 插件配置编辑

5. **平台管理**
   - 平台列表展示
   - 添加/删除平台
   - 更新平台配置
   - 平台状态管理

6. **设置管理**
   - 系统设置查看/编辑
   - 机器人配置管理
   - WebUI版本管理
   - 服务重启
   - 更新检查

7. **日志查看**
   - 日志文件列表
   - 日志内容查看
   - 日志类型筛选
   - 实时日志更新

8. **人设管理**
   - 人设列表
   - 创建/编辑/删除人设
   - 人设启用/禁用

9. **提示词管理**
   - 系统提示词管理
   - 工具提示词管理
   - 创建/编辑/删除提示词

10. **命令管理**
   - 命令列表
   - 启用/禁用命令
   - 命令重命名
   - 冲突检测

11. **LLM管理**
   - LLM提供商列表
   - 添加/编辑/删除提供商
   - 支持的提供商类型
   - API密钥管理

12. **会话管理**
   - 会话列表
   - 创建新会话
   - 查看会话详情
   - 删除会话
   - 会话总结

13. **热重载**
   - 热重载统计
   - 插件热重载
   - 配置热重载
   - 动态路由管理

## API接口对接

所有前端数据均通过后端API获取，无硬编码示例数据。API接口包括：

- `/api/auth/*` - 认证相关
- `/api/bot/*` - 机器人配置
- `/api/system/*` - 系统监控
- `/api/stat/*` - 统计数据
- `/api/plugins/*` - 插件管理
- `/api/platforms/*` - 平台管理
- `/api/logs/*` - 日志查看
- `/api/settings/*` - 设置管理
- `/api/llm/*` - LLM管理
- `/api/sessions/*` - 会话管理
- `/commands/*` - 命令管理
- `/api/personalities/*` - 人设管理
- `/api/system-prompts/*` - 系统提示词
- `/api/tool-prompts/*` - 工具提示词
- `/api/mcp/*` - MCP配置
- `/api/hot_reload/*` - 热重载

## 开发命令

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 类型检查
```bash
npm run lint
```

## 配置说明

### API基础URL
在开发环境中，API基础URL默认为 `http://localhost:5000`

如需修改，请在项目根目录创建 `.env` 文件：
```
VITE_API_BASE_URL=http://your-api-url:5000
```

### 存储键名
- `nekobot_token` - 用户认证令牌
- `nekobot_username` - 用户名
- `nekobot_theme` - 主题设置
- `nekobot_language` - 语言设置
- `nekobot_settings` - 系统设置

## 设计原则

1. **模块化设计** - 各功能模块独立，降低耦合
2. **类型安全** - 全面使用TypeScript确保类型安全
3. **组件复用** - 提取通用组件，提高开发效率
4. **API抽象** - 统一的API调用接口
5. **响应式设计** - 支持多种屏幕尺寸
6. **主题支持** - 深色/浅色主题切换
7. **国际化** - 支持多语言切换
8. **错误处理** - 统一的错误处理机制
9. **状态管理** - 使用React Context进行全局状态管理

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 许可证

MIT License

## 联系方式

项目地址: https://github.com/NekoBotTeam/nekobot-dashboard