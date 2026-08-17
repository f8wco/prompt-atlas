<p align="center">
  <h1 align="center">🎬 视觉提示词图库 · Visual Prompt Atlas</h1>
  <p align="center">
    把 AI 提示词当「工程对象」：<b>9 槽位原子词库 + 确定性评分 + 提示词体检仪</b><br>
    Treat AI prompts as engineering objects: 9-slot atom dictionary + determinism scores + prompt checker
  </p>
  <p align="center">
    <a href="README.en.md">🇬🇧 English</a> ·
    <a href="#-快速开始">快速开始</a> ·
    <a href="#-三大能力">三大能力</a> ·
    <a href="SKILL.md">SKILL.md</a> ·
    <a href="https://github.com/f8wco/prompt-atlas">GitHub</a>
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/Skill-Agent%20Skill-7c5cff" alt="Agent Skill">
    <img src="https://img.shields.io/badge/Atoms-60-fb923c" alt="60 atoms">
    <img src="https://img.shields.io/badge/Slots-9-22d3ee" alt="9 slots">
    <img src="https://img.shields.io/badge/Language-中英双语-d74a3a" alt="bilingual">
    <img src="https://img.shields.io/badge/License-MIT-yellow" alt="MIT">
  </p>
</p>

---

## ❓ 为什么需要它 / Why

同一句「a girl in a city, cinematic」写 10 次能出 10 个样——因为提示词里有太多**「说了白说」**的词，和太多**「压根没说」**的槽位。

别人的 prompt 库是「收藏大全」；这个项目是**方法论 + 词库 + 工具**：

- **每个词条带确定性分数**（0–100）：被模型稳定还原的概率，说人话就是「写了有没有用」
- **提示词体检仪**：贴入任何提示词 → 9 槽位缺漏报告 + 确定性得分，告诉你哪句话白写了、哪个槽位漏了
- **配方卡生成器**：按槽位选词拼装 → 中英文提示词一键复制

## ✨ 三大能力 / Features

| 能力 | 说明 |
|---|---|
| 🔍 **提示词体检仪** | 贴入提示词 → 逐槽扫描 → 缺漏报告 + 确定性得分 + 不确定源警告 + 一键分享报告 |
| 🧪 **视觉配方卡** | 9 槽位选词拼装 → 实时预览卡片 → 中/英文提示词一键复制 |
| 📚 **原子词库** | 60 个词条 × 9 槽位，双语（zh/en），带确定性评分、效果说明、示例 |

## 🚀 快速开始 / Quick Start

### 作为 Agent 技能安装（Claude Code / Codex / WorkBuddy 等）

```bash
# Claude Code / 类 Claude 工具
git clone https://github.com/f8wco/prompt-atlas.git ~/.claude/skills/prompt-atlas

# Codex
git clone https://github.com/f8wco/prompt-atlas.git ~/.codex/skills/prompt-atlas
```

安装后在对话中直接说：
> 「用 prompt-atlas 体检这条提示词：a girl in a city, cinematic」
> 「用 prompt-atlas 帮我写一条赛博朋克雨夜追车的视频提示词」

### 网页演示（本地）

直接双击打开 `web/index.html` 即可使用（无需服务器，支持 **🌐 中/EN 一键切换**）。

### 网页演示（在线）

GitHub 仓库 → Settings → Pages → Source 选 `main` 分支 → 目录选 `/web` → Save。
几分钟后访问 `https://f8wco.github.io/prompt-atlas/`。

## 📁 项目结构 / Structure

```
prompt-atlas/
├── SKILL.md              # 技能入口（AI 读取的主文件，双语）
├── README.md / .en.md    # 项目说明（中/英）
├── core.json             # 词库源数据（唯一权威，双语字段）
├── build.ps1             # 同步脚本：core.json → web/core-data.js
├── docs/
│   ├── ECONOMY.md        # 积分/徽章/悬赏激励体系
│   └── LAUNCH.md         # 冷启动策划 + 图库采集 4 管道
├── web/                  # 网页演示（纯静态，中英切换）
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   └── core-data.js      # 由 build.ps1 生成，勿手改
└── .github/workflows/    # CI：校验词库与同步文件一致性
```

## 🧱 9 槽位模型 / The 9 Slots

光线 · 运镜 · 景别 · 构图 · 调色 · 风格 · 氛围 · 时间 · 镜头技术

一条完整提示词 = 主体/动作/场景（自由文本）+ 9 槽位（词库选词）。**没写的槽位，AI 随机脑补。**

## 📊 确定性分数 / Determinism Score

| 分数 | 含义 | 例子 |
|---|---|---|
| ≥ 80 高 | 任何主流模型都能稳定还原的物理事实 | golden hour 黄金时刻（92）、close-up 特写（90）、time-lapse 延时（88） |
| 60–79 中 | 常见风格/技法，模型间有差异 | film grain 胶片颗粒（75）、handheld 手持（65） |
| < 60 低 | 抽象、复合、易漂移的概念，经常说了白说 | cinematic 电影感（55）、rule of thirds 三分法（55） |

## 🗺️ 路线图 / Roadmap

- [x] v0.1 核心词库 60 词条（9 槽位）+ 体检仪 + 配方卡 + 词库浏览（本仓库）
- [ ] 图库扩充至 200 词条（4 管道：批量自生成 / CC0 匹配 / 悬赏认领 / 一词成名周赛，见 `docs/LAUNCH.md`）
- [ ] 接入生图 API（词条自动配图；API Key 放服务端，前端只拿图）
- [ ] 积分系统与悬赏榜（需要后端，接口已在 `docs/ECONOMY.md` 定义）

## 📄 许可证 / License

[MIT](LICENSE) · 词库数据（core.json）同样以 MIT 开放，欢迎 fork 与贡献。

## 🙏 贡献 / Contributing

新增词条请按 `SKILL.md` 工作流 C 的规范提交 PR：修改 `core.json` 后运行 `build.ps1`，并附带打分依据。
