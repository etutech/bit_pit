# Bit Pit 比特大坑

## [比特大坑项目文档](https://aji0hopc6z.feishu.cn/base/N5HkbW5EPaDzcKsSzIccC7J8nDF?table=ldxYgo3ReMc12P2M)


## 技术栈
- **框架**: [Next.js](https://nextjs.org/)
- **UI 框架**: 
  - [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
  - [DaisyUI](https://daisyui.com/) - Tailwind CSS 的组件库
  - [Konva](https://konvajs.org/) - Konava Cavans 库

## 环境要求
- Node.js >= 16.13.x (推荐: 20.5.x)
- npm

## 开始使用

### 1. 安装
```bash
# 克隆仓库
git clone [repository-url]

# 安装依赖
npm install
```

### 2. 本地开发环境设置

#### 环境配置
创建 `.env` 文件并添加以下变量：
```
# 在此添加环境变量
```

#### 启动开发服务器
```bash
npm run dev
```

#### 访问

http://localhost:3000/draw

## 部署
```bash
# 构建并启动生产服务器
npm run build && npm start
```

## Git 工作流

### 分支策略
![分支结构](/branches.jpg)

### 分支类型
| 类型     | 格式         | 基础分支 | 描述                |
|----------|----------------|-------------|----------------------------|
| 功能     | `feature/*`    | `main`      | 新功能开发               |
| 重构     | `ref/*`        | `main`      | 代码重构          |
| 测试     | `test/*`       | `main`      | 测试相关更改      |
| 维护     | `chore/*`      | `main`      | 维护任务         |
| 修复     | `fix/*`        | `main`      | 错误修复                 |
| 紧急修复  | `hotfix/*`     | `production`| 生产环境紧急修复      |

### 重要规则
1. 禁止直接推送到 `production` 分支
2. 所有更改必须先经过 `main` 分支
3. 合并到 `production` 前必须充分测试

### 环境 URL
- 生产环境: 
- 预发布环境: 

## 开发指南

### 代码风格
- 使用 ESLint，缩进为 2 个空格
- 组件放置规则：
  - 单一用途的组件可以在其父文件中定义
  - 可复用组件应放在单独的文件中

### TypeScript 规范
- 接口和类型名称使用大写
- 接口名称以 "I" 开头（例如：`IPost`、`IUser`）
- 相关类型分组到命名空间文件中
- 类型定义应靠近其使用位置

### 推荐的 VS Code 扩展
- ESLint
- Tailwind CSS IntelliSense
- EditorConfig
- Live Share

## 环境配置
- 本地环境: `.env` 文件
- 预发布/生产环境: Vercel 环境变量

## Bash 命令
开发
```bash
npm run dev
```
部署
```bash
npm run build && npm start
```

---

### 编码规范

- Eslint: 配置文件: [.eslint.js](.eslintrc.js)，使用 2 个空格作为缩进。
- 当组件仅在一个或两个文件中使用时，可以定义在该文件或主文件中。

### 类型定义

- 接口和类型名称应使用大写。
- 接口应以字母 "I" 开头，例如 IPost、IUser。
- 在命名空间 .ts 文件中导出多个接口和类型。
- 每个接口或类型应定义在包含组件的同一文件中。

### VS Code 插件

- **ESlint**: 选择 eslint 作为默认编辑器格式化工具，并启用"保存时格式化"。
- **Tailwind** CSS IntelliSense。
- **EditorConfig** for VS Code。
- **Live Share** (用于结对编程)。

### [Tailwind](https://tailwindcss.com/)
无需离开 HTML 即可快速构建现代网站。

### [Daisy UI](https://daisyui.com/) 
**Tailwind CSS** 最受欢迎的组件库

### [layered paper art](https://www.layeredpaperart.com/free-files)
**免费文件**