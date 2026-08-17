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
   - 配方确定性 = 所选词条平均分；覆盖率 = 已填槽位数/适用槽位数
   - 提示：确定性 < 60 的词条给出替代建议

**示例输出模板 / Output template**：
```
🎬 配方卡
主体/动作/场景：a young woman walking in the rain, a cyberpunk city street
EN: a young woman walking in the rain in a cyberpunk city street, neon glow,
    tracking shot, close-up, symmetrical composition, teal and orange,
    anime style, suspenseful, rainy night, shallow depth of field, slow motion
中文解读：光线-霓虹光；运镜-跟拍；景别-特写；构图-对称；调色-青橙；风格-日系动漫；
         氛围-悬疑；时间-雨夜；技术-浅景深+慢动作
确定性：80/100（高）· 覆盖率 9/9
```

## 4. 工作流 B：体检分析 / Workflow B — Check a Prompt

**触发**：用户贴出一条已有提示词，想知道它哪里缺、靠不靠谱、怎么改。

**步骤 / Steps**：
1. 先判断模态与意图（image/video）：**静态图片默认运镜槽位 = N/A**；适用槽位之外的留白是 Freedom 不是错误
2. 逐槽扫描（Matcher 2.0）：最长词优先 + span 去重（extreme close-up 不再同时命中 close-up）+ 别名归一（close up/closeup）+ 英文边界；蕴含关系计覆盖不重复计分（rainy-night ⟹ night）
3. 输出「9 槽位报告」，槽位状态为以下之一：
   - ✅ SPECIFIED 已指定（列出词条 + 分数）
   - ⚠️ FREE_TEXT 疑似已描述（原文含相关自由文本，标注人工确认）
   - ◻️ UNSPECIFIED 未指定（不是错误，是留给模型的决定）
   - ➖ NOT_APPLICABLE 不适用（如静态图片的运镜）
   - 🚫 CONFLICT 冲突（relations.hardConflict 或自由文本冲突提示）
   - ⚠️ 不确定源：所有 heuristic 低分（<60）词条，逐个给出替换/补强建议；Macro（复合词）建议「拆解并增强」
4. 计算得分（v0.2 公式，分母 = 适用槽位数）：
   ```
   覆盖率 = 已覆盖槽位数 / 适用槽位数
   确定性得分 = round(覆盖率 × (40 + 0.6 × 已识别词条平均分))
   ```
   分级：≥80 高 · 60–79 中 · 40–59 低 · <40 大量留白；如存在 FREE_TEXT 槽位，注明实际确定性可能高于得分
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

## 6. 边界与红线 / Boundaries

- 版权：真实电影片段只作参考描述，绝不直接复制受版权保护的作品描述；CC0 素材需标注来源
- 诚实：确定性分数必须给依据，不编造「测试过」的结论
- 语言：中英双语能力，跟随用户语言输出；词条引用同时给出 zh + en
- 词库外概念：先标注「未收录（自拟）」再使用，并建议提交扩充

## 7. 相关文档 / Related Docs

- `README.md` — 项目总纲 / overview（中文）· `README.en.md`（English）
- `docs/ECONOMY.md` — 积分/徽章/悬赏激励体系 / incentive system
- `docs/LAUNCH.md` — 冷启动与图库采集 4 管道 / cold start & collection pipelines
- `web/` — 网页演示（体检仪/配方卡/词库，中英切换）/ web demo
