---
name: prompt-atlas
description: >-
  视觉提示词图库 Visual Prompt Atlas：9 槽位原子词库 + 确定性评分 + 提示词体检/拼装方法论。
  Use when the user wants to write, assemble, analyze, score, improve, or translate prompts for
  AI image / video generation (Midjourney, Sora, Kling, Runway, Seedance, Wan, etc.), or explore
  prompt terms (lighting, camera movement, shot size, composition, color grading, style, mood,
  time, lens technique). 中英文双语输出，respond in the user's language.
---

# 视觉提示词图库 / Visual Prompt Atlas

> 把 AI 提示词当「工程对象」而非「文采竞赛」：可拼装、可体检、可评分。
> Treat AI prompts as engineering objects, not prose: they can be assembled, checked, and scored.
> **Output language rule：用户用中文提问就用中文回答；user asks in English, answer in English.**

## 1. 核心理念 / Core Concept

**9 槽位（9 Slots）** —— 一条完整的视觉提示词由 9 个可控维度组成：

| 槽位 Slot | 英文 EN | 回答什么问题 |
|---|---|---|
| 光线 | Lighting | 光从哪来、什么质感、什么色温 |
| 运镜 | Camera Movement | 镜头怎么动 |
| 景别 | Shot Size | 离主体多远 |
| 构图 | Composition | 元素怎么排布 |
| 调色 | Color Grading | 什么色彩倾向 |
| 风格 | Style | 什么视觉流派 |
| 氛围 | Mood | 什么情绪底色 |
| 时间 | Time | 什么时刻、什么天气 |
| 镜头技术 | Lens & Technique | 什么光学质感 |

**确定性分数（Determinism Score，0–100）** —— 词条控制力的量化估计：
- **status = heuristic（当前 52 个词条）**：编辑经验估计，**不是实测概率**，不得表述为「稳定还原概率 X%」或「跨模型已验证」
- **status = benchmarked（当前 8 个词条，Confidence B）**：经 `docs/BENCHMARK.md` 管道实测（image-baseline-001/002/003：**3 个独立模型家族**（Seedream 4.0/4.5 + 智谱 CogView-4）× 6 场景 × 3 seeds A/B，每词 54 对观测），附样本量、模型、置信度（A/B/C）、方法版本
- 分级：≥ 80 高 · 60–79 中 · < 60 低；低分 = 常「说了白说」，建议替换/补强

核心理念：**未指定的槽位不是错误，是留给模型的自由。** Unspecified slots are creative freedom handed to the model, not mistakes.

## 2. 数据文件 / Data Files

词库在 `core.json`（v2 schema，规范见 `docs/SCHEMA.md`），字段说明（Fields）：

| 字段 | 说明 |
|---|---|
| `slots[].id / zh / en / desc / descEn` | 9 个槽位定义，中英双语 |
| `atoms[].id / type / slot / modalities` | 词条 ID、类型（atom 原子 / macro 复合词）、主槽位、适用模态（image/video） |
| `atoms[].zh / en / aliases` | 中英文词 + 别名（只参与匹配，不参与关系图） |
| `atoms[].score` | 对象：`value` + `status`（heuristic/benchmarked）+ confidence/sampleSize/models/benchmarkVersion |
| `atoms[].relations` | 关系图：hardConflict / softTension / redundant / requires / implies / expandsTo |
| `atoms[].desc / descEn / example` | 效果说明（双语）+ 英文示例 |

**使用规则**：只使用词库中真实存在的词条。词库没有的概念标注「⚠️ 未收录（自拟）」，并按 Workflow C 规范提交。

## 3. 工作流 A：拼装配方卡 / Workflow A — Assemble a Recipe

**触发**：用户想生成一条新提示词、描述一个画面、把想法转成提示词。

**步骤 / Steps**：
1. 问清三要素（缺失才问，不要连环追问）：**主体 Subject**、**动作 Action**、**场景 Scene**
2. 按 9 槽位从 `core.json` 中挑选合适词条，每槽 1 个（最多 2 个，避免冲突）
3. 组装英文提示词，模板：
   ```
   [subject] [action] in [scene], [lighting], [camera], [shot], [composition],
   [color], [style], [mood], [time], [technique]
   ```
4. 输出「配方卡」：
   - 英文提示词（English prompt）
   - 中文逐槽解读（slot-by-slot Chinese breakdown）
   - **四维 Control Profile**（与体检仪同一语言，`core-lib.recipeProfile` / 网页配方卡一致）：Reliability 可靠性 = 所选词条平均分（macro 不计入）、Coverage 覆盖 = 已填槽位/适用槽位、Consistency 一致性、Freedom 留白
   - 提示：词条分数 < 60 的给出替代建议
5. **不输出 Prompt 级单一总分**——平均分/XX分这类聚合分数已在 v3 废除，全产品只有 Control Profile 一种评分语言。

**示例输出模板 / Output template**：
```
🎬 配方卡
主体/动作/场景：a young woman walking in the rain, a cyberpunk city street
EN: a young woman walking in the rain in a cyberpunk city street, neon glow,
    tracking shot, close-up, symmetrical composition, teal and orange,
    anime style, suspenseful, rainy night, shallow depth of field, slow motion
中文解读：光线-霓虹光；运镜-跟拍；景别-特写；构图-对称；调色-青橙；风格-日系动漫；
         氛围-悬疑；时间-雨夜；技术-浅景深+慢动作
确定性：Control Profile —— Reliability 80 · Coverage 9/9 · Consistency 100 · Freedom 0
```

## 4. 工作流 B：体检分析 / Workflow B — Check a Prompt

**触发**：用户贴出一条已有提示词，想知道它哪里缺、靠不靠谱、怎么改。

**步骤 / Steps**：
1. 先判断模态与意图（image/video）：**静态图片默认运镜槽位 = N/A**；适用槽位之外的留白是 Freedom 不是错误
2. 逐槽扫描（Matcher 2.0）：最长词优先 + span 去重（extreme close-up 不再同时命中 close-up）+ 别名归一（close up/closeup）+ 英文边界；蕴含关系计覆盖不重复计分（rainy-night ⟹ night）
3. 输出「9 槽位报告」，槽位状态为以下四态之一：
   - ✅ SPECIFIED 已指定（列出词条 + 分数）
   - ⚠️ FREE_TEXT 疑似已描述（原文含相关自由文本，标注人工确认）
   - ◻️ UNSPECIFIED 未指定（不是错误，是留给模型的决定）
   - ➖ NOT_APPLICABLE 不适用（如静态图片的运镜；抽象空间场景的时间维度）
   - 另有**独立冲突清单**（relations.hardConflict 或自由文本冲突）与**模态不符警告**（image 提示词中的 video-only 词条）
   - ⚠️ 不确定源：所有 heuristic 低分（<60）词条，逐个给出替换/补强建议；Macro（复合词）建议「拆解并增强」
4. 输出四维 Control Profile（v3，已废除单一总分；确定性命令行入口 `node scripts/check.js "<提示词>" [image|video]`）：
   ```
   Reliability  可靠性   = 已识别词条平均分（macro 不计入），无词条时为 —
   Coverage     覆盖率   = 已覆盖适用槽位 / 适用槽位总数
   Consistency  一致性   = 100 − 硬冲突×30 − 软张力×10
   Freedom      留白     = 未指定槽位数（不是错误，是创作自由）
   ControlLevel 定性档位 = high / medium / low / conflict
   ```
5. 输出「优化版提示词」（Optimizer 2.0）：
   - **每槽最多新增 1 个词条**；候选必须与原文 + 已选词条**两两冲突检查**（relations.hardConflict）
   - 无合适候选时输出 **NO_SUGGESTION（保留自由）**——「不改」是正常结果
   - 长提示词新增词放开头作全局前缀；附逐槽结构化解读（✅ 原文含 / ➕ 新增 / ⛔ 跳过冲突 / ◻️ 无建议 / ⚠️ 疑似已描述）

## 5. 工作流 C：词库扩充 / Workflow C — Extend the Dictionary

**触发**：用户想新增词条、词条缺英文/描述、词条分数存疑。

**规范 / Rules**（v2 schema，CI 强制校验）：
- 必填字段：`id`（kebab-case 唯一）、`type`（atom/macro）、`slot`（必须属于 9 槽位之一）、`modalities`、`zh`、`en`、`score`（value 0–100 + status）、`relations`、`desc`、`descEn`、`example`
- **Macro 判定测试**：能否用一次 A/B 分离出独立效果？不能则 type=macro，且必须填 `expandsTo` 或 `implies`
- **评分标准**：新词条 score.status 一律 `heuristic`，注明经验依据；只有通过 `docs/BENCHMARK.md` 管道才可标 `benchmarked`
- 关系声明：`hardConflict` 必须双向对称；`implies`（如 rainy-night ⟹ night）用于覆盖映射；`softTension` 用于「组合困难但非互斥」
- 别名：常见差异（close up/closeup、time lapse/timelapse）进 `aliases` 归一，不造新词条；同语言别名不得与现有词条冲突
- 查重：先搜索 `zh`/`en`/`aliases`，同义词应合并
- 提交前本地跑：`node scripts/validate-core.js` + `pwsh -File build.ps1` + `node tests/run-tests.js`（三者 CI 都会强制跑）
- 扩充来源见 `docs/LAUNCH.md` 的 4 条管道（批量自生成 / CC0 素材匹配 / 悬赏认领 / 一词成名周赛）

## 6. 工作流 D：剧本 → 分镜提示词 / Workflow D — Script to Storyboard

**触发**：用户给出一个剧本/故事/文案，要求按固定时长（如每段 15 秒）拆成多段视频提示词。

**步骤 / Steps**：
1. 问清三件事（缺才问）：**总时长与分段长度**（默认每段 15 秒）、**目标平台**（即梦/可灵/Sora 等）、**统一风格基调**（如「顶级国漫院线质感」）
2. 生成时间骨架（确定性工具，非手算）：
   ```
   node scripts/storyboard.js --total 60 --seg 15
   ```
   或使用网页版（可分享链接）：`web/storyboard.html`（https://f8wco.github.io/prompt-atlas/storyboard.html）——贴入剧本自动拆段拆拍 + 每段 9 槽位选词 + 冲突检查 + Control Profile。
   输出 N 段 × 每段拍点骨架（如 [0-2s][2-4s][4-7s]...），长提示词的**时间戳结构是硬约束**，不要改动拍点边界
3. 把剧本内容分配到拍点（叙事三段式：建立→发展→高潮/收尾），每拍写清：主体 + 动作 + 场景
4. 为每段选 9 槽位词条（同工作流 A 的规则：每槽 1 个、hardConflict 禁止同选、运镜槽只对视频有效）
5. 输出格式（与主流分镜模型兼容的时间戳格式）：
   ```
   【统一风格】<风格基调>，<全段共用的风格词条>
   【第 1 段 / 15s】
   [0-2s] <主体+动作+场景>, <光线>, <景别>, ...
   [2-4s] ...
   ...
   【第 2 段 / 15s】 ...
   ```
6. 收尾必做：对每段跑一次 `node scripts/check.js "<该段提示词>" video`，报告冲突/漏槽；对整体给一句「控制 vs 自由」评价（分镜稿通常覆盖率高是正常的——它是高定制场景）

**红线**：拍点边界、总段数由骨架工具确定；词条仍只从 core.json 选；每段运镜必须前后衔接（如第 1 段以特写收尾，第 2 段就不应突然全景开場，除非剧本要求）。

## 7. 边界与红线 / Boundaries

- 版权：真实电影片段只作参考描述，绝不直接复制受版权保护的作品描述；CC0 素材需标注来源
- 诚实：确定性分数必须给依据，不编造「测试过」的结论
- 语言：中英双语能力，跟随用户语言输出；词条引用同时给出 zh + en
- 词库外概念：先标注「未收录（自拟）」再使用，并建议提交扩充

## 8. 相关文档 / Related Docs

- `README.md` — 项目总纲 / overview（中文）· `README.en.md`（English）
- `docs/ECONOMY.md` — 积分/徽章/悬赏激励体系 / incentive system
- `docs/LAUNCH.md` — 冷启动与图库采集 4 管道 / cold start & collection pipelines
- `web/` — 网页演示（体检仪/配方卡/词库，中英切换）/ web demo
