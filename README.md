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

- **9 槽位结构化检查（Lint）**：贴入提示词 → 告诉你写了什么、把什么留给了模型、哪里冲突、哪些词模糊
- **确定性分数（经验估计）**：每个词条带 0–100 分数，当前全部为 `heuristic` 经验估计（诚实标注，不冒充实测）；实测分数将通过 Benchmark 管道发布
- **可复现的规则引擎**：Matcher/Optimizer 是纯函数（`web/core-lib.js`），带 84 项回归测试，行为可离线复现
- **配方卡生成器**：按槽位选词拼装 → 中英文提示词一键复制

## ✨ 三大能力 / Features

| 能力 | 说明 |
|---|---|
| 🔍 **提示词体检仪（Linter）** | 贴入提示词 → 逐槽扫描 → 五态报告（已指定/疑似已描述/未指定/不适用/冲突）+ 确定性得分 + 图片/视频模式 + 一键生成优化版 |
| 🧪 **视觉配方卡** | 9 槽位选词拼装 → 实时预览卡片 → 中/英文提示词一键复制 |
| 📚 **原子词库** | 60 个词条 × 9 槽位（含 3 个复合词 Macro），双语（zh/en）+ 别名 + 关系图 + 分数状态标注 |
| 🧪 **回归测试与 CI** | Matcher/Optimizer 纯函数 + 84 项 fixtures；schema/引用/别名/关系/同步全量自动校验 |

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

在线演示由 GitHub Actions 自动部署（`.github/workflows/deploy-pages.yml`）。仓库 Settings → Pages 的 Source 设为 **GitHub Actions** 即可，之后每次更新 `web/` 自动上线。访问 <https://f8wco.github.io/prompt-atlas/>。

## 📁 项目结构 / Structure

```
prompt-atlas/
├── SKILL.md              # 技能入口（AI 读取的主文件，双语）
├── README.md / .en.md    # 项目说明（中/英）
├── core.json             # 词库源数据 v2（唯一权威，Atom/Macro + 关系图 + score 对象）
├── build.ps1             # 同步脚本：core.json → web/core-data.js
├── schema/
│   └── core.schema.json  # JSON Schema 契约
├── scripts/
│   ├── validate-core.js  # 数据校验（schema/引用/别名/关系）
│   └── migrate-v2.js     # v1→v2 一次性迁移脚本（审计留档）
├── tests/
│   ├── run-tests.js      # 回归测试运行器（Matcher/Optimizer fixtures）
│   ├── matcher.fixtures.json
│   └── optimizer.fixtures.json
├── docs/
│   ├── SCHEMA.md         # 数据模型规范
│   ├── MIGRATION-v2.md   # 迁移记录
│   ├── BENCHMARK.md      # 可复现实测协议
│   ├── ECONOMY.md        # 积分/徽章/悬赏激励体系
│   └── LAUNCH.md         # 冷启动策划 + 图库采集 4 管道
├── web/                  # 网页演示（纯静态，中英切换）
│   ├── index.html
│   ├── style.css
│   ├── app.js            # UI 层
│   ├── core-lib.js       # 纯函数规则引擎（浏览器/测试共用）
│   └── core-data.js      # 由 build.ps1 生成，勿手改
└── .github/workflows/    # CI：数据校验 + 回归测试 + 同步检查 + 自动部署
```

## 🧱 9 槽位模型 / The 9 Slots

光线 · 运镜 · 景别 · 构图 · 调色 · 风格 · 氛围 · 时间 · 镜头技术

一条完整提示词 = 主体/动作/场景（自由文本）+ 9 槽位（词库选词）。**未指定的槽位不是错误，是留给模型的创作自由；工具帮你管理「控制 vs 自由」的平衡。**

## 📊 确定性分数 / Determinism Score

**诚实声明：当前 60 个词条全部为 `heuristic`（经验估计），不是实测概率。** 分数来自编辑经验，用于相对排序；「被模型稳定还原的概率」类表述仅适用于 `benchmarked` 状态（通过 `docs/BENCHMARK.md` 管道实测后发布）。

| 分数 | 含义 | 例子 |
|---|---|---|
| ≥ 80 高 | 编辑判断为强控制的物理事实 | golden hour 黄金时刻（92）、close-up 特写（90）、time-lapse 延时（88） |
| 60–79 中 | 常见风格/技法，模型间有差异 | film grain 胶片颗粒（75）、handheld 手持（65） |
| < 60 低 | 抽象、复合、易漂移的概念 | cinematic 电影感（55，已标为 Macro 复合词）、rule of thirds 三分法（55） |

## 🗺️ 路线图 / Roadmap

- [x] v0.1 核心词库 60 词条 + 体检仪 + 配方卡 + 词库浏览
- [x] v0.2 Checker 升级：冲突检测 + 疑似已描述 + 一键优化版（每槽最多 1 词 + NO_SUGGESTION）
- [x] v0.3a Schema v2：Atom/Macro + 关系图 + score.status + JSON Schema + 84 项回归测试 + CI 全量校验
- [ ] v0.3b Benchmark MVP：8 图 192 样本 A/B + 4 视频 smoke（协议已就绪，待 API 资源，见 `docs/BENCHMARK.md`）
- [ ] Control Profile 四维报告（Reliability/Coverage/Consistency/Freedom 分离）
- [ ] 图库扩充至 200 词条（4 管道，见 `docs/LAUNCH.md`）
- [ ] 积分系统与悬赏榜（需要后端，接口已在 `docs/ECONOMY.md` 定义）

## 📄 许可证 / License

[MIT](LICENSE) · 词库数据（core.json）同样以 MIT 开放，欢迎 fork 与贡献。

## 🙏 贡献 / Contributing

新增词条请按 `SKILL.md` 工作流 C 的规范提交 PR：修改 `core.json` 后运行 `build.ps1`，并附带打分依据。
