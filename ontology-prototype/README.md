# 本体模型智能建模平台 — 高保真 UI 原型

可交互的高保真产品原型，覆盖本体建模、模型管理、审核中心、资源广场等核心模块。

## 快速启动

```bash
cd ontology-prototype
npm install
npm run dev
```

访问 http://localhost:5173

## 页面导航

| 模块 | 路径 | 说明 |
|------|------|------|
| 工作台 | `/` | 概览与快速入口 |
| 本体建模 | `/modeling` | 五种建模方式入口 |
| 数据接入 | `/modeling/data-access` | 选择 API / 数据库接入类型 |
| API 接入配置 | `/modeling/data-access/api` | 新建 API 接口：左配置右测试双栏布局，支持鉴权/参数/探测/Schema |
| 数据库接入配置 | `/modeling/data-access/database` | 配置数据库：左选类型右填连接，测试后下一步选资源 |
| 专家自主建模 | `/modeling/manual/new` | 三栏布局：对象树 + 图画布 + 属性面板 |
| 智能辅助建模 | `/modeling/assist` | 四步向导：基本信息 → 上传 → AI构建 → 确认 |
| 现有模型演进 | `/modeling/evolve` | 选择基础模型 + 差异对比 |
| 规则建模 | `/modeling/rule` | 本体 + Skill + 自然语言 |
| 逻辑建模 | `/modeling/logic` | Markdown 编辑器 + MCP 面板 |
| 本体模型库 | `/models/ontology` | 卡片列表 + 状态筛选 |
| 模型详情 | `/models/ontology/1` | 图/树双视图 + 标注 |
| 审核中心 | `/audit` | 待审核 / 我的提交 |
| 审核详情 | `/audit/1` | Diff 对比 + 审批操作 |
| 资源广场 | `/plaza` | 三大资产中心 |
| 资产详情 | `/plaza/asset/model/1` | 功能说明 / 使用说明 |
| 上传共享 | `/plaza/upload` | 用户上传共享能力 |

## 技术栈

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- React Router 7
- Lucide Icons

## 设计规范

- 主色：Indigo (#4F46E5)
- 字体：Noto Sans SC + Inter
- 状态色：草稿(灰) / 审核中(橙) / 已发布(绿) / 已驳回(红) / 变更审批中(蓝)
