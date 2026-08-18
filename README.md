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
    <img src="https://img.shields.io/badge/Benchmark-20%20benchmarked%20(B)-16a34a" alt="20 atoms benchmarked">
    <img src="https://img.shields.io/badge/Slots-9-22d3ee" alt="9 slots">
    <img src="https://img.shields.io/badge/Language-中英双语-d74a3a" alt="bilingual">
    <img src="https://img.shields.io/badge/License-MIT-yellow" alt="MIT">
  </p>
</p>

---

## ❓ 为什么需要它 / Why

> ⚡ **我们实测发现（2160 张 A/B 图）**：`macro 微距` 写了模型也不拍微距——依从率仅 4%，Seedream 4.0 直接 0 分，三家模型家族集体无视这个词。**「听起来专业」的提示词可能完全是无效指令**：[看 20 词实测数据](#-确定性分数--determinism-score)

同一句「a girl in a city, cinematic」写 10 次能出 10 个样——因为提示词里有太多**「说了白说」**的词，和太多**「压根没说」**的槽位。

别人的 prompt 库是「收藏大全」；这个项目是**方法论 + 词库 + 工具**：

- **9 槽位结构化检查（Lint）**：贴入提示词 → 告诉你写了什么、把什么留给了模型、哪里冲突、哪些词模糊
- **确定性分数（诚实分级）**：每个词条带 0–100 分数——8 个核心词已跨 3 个模型家族实测（`benchmarked`，Confidence B），其余 52 个明确标注为 `heuristic` 经验估计，从不冒充实测概率
- **可复现的规则引擎**：Matcher/Optimizer 是纯函数（`web/core-lib.js`），带 100+ 项回归测试，行为可离线复现
- **配方卡生成器**：按槽位选词拼装 → 中英文提示词一键复制

## ✨ 三大能力 / Features

| 能力 | 说明 |
|---|---|
| 🔍 **提示词体检仪（Linter）** | 贴入提示词 → 逐槽扫描 → 四态报告（已指定/疑似已描述/未指定/不适用）+ 独立冲突检测 + 四维 Control Profile + 图片/视频模式 + 一键生成优化版 |
| 🧪 **视觉配方卡** | 9 槽位选词拼装 → 实时预览卡片 → 中/英文提示词一键复制 + **分享链接** |
| 🎞️ **剧本→分镜（新）** | 贴入剧本 → 按时长自动拆段拆拍、内容自动分配 → 每段选词 + 冲突检查 + Control Profile → [storyboard.html](https://atlas.f8w.com/storyboard.html)，可嵌入任何网站 |
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

在线演示由 GitHub Actions 自动部署（`.github/workflows/deploy-pages.yml`）。仓库 Settings → Pages 的 Source 设为 **GitHub Actions** 即可，之后每次更新 `web/` 自动上线。访问 <https://atlas.f8w.com/>。剧本→分镜独立页：<https://atlas.f8w.com/storyboard.html>（嵌入其他网站：`<iframe src="https://atlas.f8w.com/storyboard.html" style="width:100%;height:900px;border:0"></iframe>`）。

## 📁 项目结构 / Structure

```
prompt-atlas/
├── SKILL.md              # 技能入口（AI 读取的主文件，双语）
├── README.md / .en.md    # 项目说明（中/英）
├── core.json             # 词库源数据（唯一权威，Atom/Macro + 关系图 + score 对象）
├── scripts/build.js      # 跨平台构建：core.json → web/core-data.js（build.ps1 为兼容入口）
├── schema/
│   └── core.schema.json  # JSON Schema 契约
├── scripts/
│   ├── validate-schema.js # JSON Schema 结构校验（ajv，CI 强制）
│   ├── validate-core.js   # 语义校验（引用/别名/关系/对称性）
│   ├── check.js           # CLI：命令行体检（Agent 工作流 B 的确定性入口）
│   ├── storyboard.js      # 剧本→分镜骨架生成器（工作流 D：时长硬约束）
│   └── migrate-v2.js 等   # 一次性迁移脚本（审计留档）
├── tests/
│   ├── run-tests.js      # 回归测试运行器（Matcher/Optimizer fixtures）
│   ├── matcher.fixtures.json
│   └── optimizer.fixtures.json
├── benchmark/            # Benchmark 管道（可复现实测）
│   ├── manifests/        # 运行清单（模型/场景/seed/评测问题）
│   ├── run-image-baseline.js · eval-vlm.js · aggregate.js
│   └── results/          # 原始观测 + VLM 判定 + summary-*.json
├── docs/
│   ├── SCHEMA.md         # 数据模型规范
│   ├── IR.md             # Scene IR 中间表示设计（Prompt Compiler 路线）
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

**诚实声明：60 个词条中 20 个已实测（`benchmarked`，Confidence B），其余 40 个为 `heuristic`（经验估计）。** 实测共四轮（`image-baseline-001~004`）：**3 个独立模型家族**（Seedream 4.0 / Seedream 4.5 / 智谱 CogView-4）× 6 场景 × 3 seeds × Control/Treatment A/B，每词 54 对观测、累计 **2160 张**（协议与原始数据见 `docs/BENCHMARK.md`、`benchmark/results/`）。

> ⚠️ **证据范围**：以上分数仅在这 3 个图像模型家族上实测。Midjourney / Flux / SDXL / Sora / Kling 等未实测，分数**不可直接外推**——分模型差异请看词条的 `byModel` 明细（词库页已展示）。

| 分数 | 含义 | 例子（全部实测 B） |
|---|---|---|
| ≥ 80 高 | 强控制开关 | anime 动漫（**100**）、fisheye 鱼眼（**89**）、teal-orange 青橙（**88**）、blue hour 蓝调（**86**）、neon 霓虹（**82**）、monochrome 黑白（**82**）、pastel 粉彩（**84**） |
| 60–79 中 | 有效但有基线/家族差异 | golden hour（79）、backlit（77）、film grain（71）、ink wash 水墨（69）、rim light（65）、symmetry（65）、volumetric（64） |
| < 60 低 | 弱控制/白写 | close-up（61）、telephoto（59）、rule of thirds（57）、negative space（**42**）、**macro 微距（3）** |

三个教训：**样本量不够时连「实测」都可能是巧合**（12→36 对，close-up 80→67）；**同厂两代 ≠ 独立证据**（加第三家族后 monochrome 100→82、ink wash 在 CogView 上只有 33）；**连「物理事实」类词汇也可能全家族失效**——`macro` 实测仅 3 分（依从率 4%：写了模型也不拍微距），这是 004 轮最大的意外。

## 🗺️ 路线图 / Roadmap

- [x] v0.1 核心词库 60 词条 + 体检仪 + 配方卡 + 词库浏览
- [x] v0.2 Checker 升级：冲突检测 + 疑似已描述 + 一键优化版（每槽最多 1 词 + NO_SUGGESTION）
- [x] v0.3a Schema v2：Atom/Macro + 关系图 + score.status + JSON Schema + 回归测试 + CI 全量校验
- [x] Control Profile 四维报告（Reliability/Coverage/Consistency/Freedom 分离，废单一总分）
- [x] v0.3b（图像）Benchmark 实测：**3 个模型家族** × 6 场景 × 3 seeds = **2160 张 A/B，20 词条 Confidence B**（`benchmark/results/summary-*.json`；Dataset Release 0.2）
- [ ] v0.3b（视频）4 词条 smoke：协议已就绪，待视频 API 资源
- [x] v0.4（部分）Show, Don't Tell：词条证据对照（Before/After 实测图对，16 张入库）+ 配方卡分享链接（URL hash，免后端）
- [ ] v0.4 剩余：Recipe Card 视觉重设计 + 10–20 个精选配方 + Benchmark 画廊页 + 首页 30 秒理解
- [ ] v0.5 Prompt Compiler：剧本→分镜完善 + Content/Visual/Temporal 分层 IR + 时序冲突检查
- [ ] v0.6 Model Adapter：Atom×Model 定向实测（优先级 = 使用频率 × 不确定性 × 模型方差；升 A 需 72 对/词）+ 模型专属提示词转换
- [ ] 图库扩充与积分悬赏（见 `docs/LAUNCH.md`、`docs/ECONOMY.md`）

## 📄 许可证 / License

**代码 MIT**（`LICENSE`）· **数据 CC BY 4.0**（`DATA-LICENSE.md`）：`core.json` 与 `benchmark/` 数据可商用与再分发，**须署名**「Visual Prompt Atlas (f8wco/prompt-atlas)」并附链接；Agent 技能安装、CLI 调用、fork 代码等使用行为不受数据许可约束。

## 📖 引用 / Citation

数据和工具对你有帮助的话，请这样引用（CC BY 4.0 的署名要求即视为满足）：

```bibtex
@software{prompt-atlas,
  author = {f8w},
  title = {Visual Prompt Atlas: 9-slot prompt control system with cross-family benchmark evidence},
  year = {2026},
  url = {https://atlas.f8w.com}
}
```

## 🙏 贡献 / Contributing

新增词条请按 `SKILL.md` 工作流 C 的规范提交 PR：修改 `core.json` 后运行 `node scripts/build.js`（或 `npm run build`），并附带打分依据。提交词条或实测数据即表示同意以 CC BY 4.0 授权收录（代码贡献仍为 MIT）。
