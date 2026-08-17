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

**确定性分数（Determinism Score，0–100）** —— 每个词条被主流模型**稳定还原**的概率：
- ≥ 80 高确定性（high）：写了基本就有
- 60–79 中确定性（mid）：大概率有，偶尔漂移
- < 60 低确定性（low）：经常「说了白说」，模型随机脑补

核心洞察：**没写的槽位 = 随机脑补的槽位。** The blank slots are where the model improvises.

## 2. 数据文件 / Data Files

词库在 `core.json`，字段说明（Fields）：

| 字段 | 说明 |
|---|---|
| `slots[].id / zh / en / desc / descEn` | 9 个槽位定义，中英双语 |
| `atoms[].id / slot / zh / en / score` | 词条 ID、所属槽位、中英文词、确定性分数 |
| `atoms[].desc / descEn` | 效果说明（双语） |
| `atoms[].example` | 英文示例写法 |

**使用规则**：只使用词库中真实存在的词条。如果需要表达词库没有的概念，明确标注「⚠️ 未收录（自拟）」，并建议按扩充规范提交。

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
   - 配方确定性 = 所选词条平均分；覆盖率 = 已填槽位数/9
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
1. 逐槽扫描：把提示词与 `core.json` 词条匹配（中英文均可识别）
2. 输出「9 槽位缺漏报告」：
   - ✅ 已覆盖槽位：列出识别到的词条 + 各自确定性分数
   - ❌ 缺失槽位：每槽给出 2 个高确定性建议词
   - ⚠️ 不确定源：所有确定性 < 60 的词条，逐个给出替换/补强建议
3. 计算得分：
   ```
   覆盖率 = 已覆盖槽位数 / 9
   确定性得分 = round(覆盖率 × (40 + 0.6 × 已识别词条平均分))
   ```
   分级：≥80 高确定性 · 60–79 中 · 40–59 低 · <40 危险区
4. 输出改进版提示词（补全缺失槽位、替换不确定源），并附前后得分对比

## 5. 工作流 C：词库扩充 / Workflow C — Extend the Dictionary

**触发**：用户想新增词条、词条缺英文/描述、词条分数存疑。

**规范 / Rules**：
- 必填字段：`id`（kebab-case）、`slot`（必须属于 9 槽位之一）、`zh`、`en`、`score`、`desc`、`descEn`、`example`
- **评分标准（打分依据）**：高确定性（80+）= 任何主流模型都能稳定还原的物理事实（golden hour、close-up、time-lapse）；中确定性（60–79）= 常见风格/技法，模型间有差异（film grain、handheld）；低确定性（<60）= 抽象、复合、易漂移的概念（cinematic、rule of thirds、long take）
- 查重：先搜索 `zh`/`en`，避免同义重复；同义词应合并
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
