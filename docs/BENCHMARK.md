# BENCHMARK · 可复现实测协议 / Reproducible Benchmark Protocol

> **状态（2026-08-18 · Dataset Release 0.2）：图像基准四轮已执行并完成聚合，20 词条升至 Confidence B（3 个独立模型家族，2160 张）。** run 001（seed 1，192 张，2×Seedream）+ run 002（seeds 2–3，384 张，2×Seedream）+ run 003（seeds 1–3，288 张，智谱 CogView-4 @1440×1440）+ run 004（12 个定向词条，seeds 1–3，1296 张，3 家族）：3 家族 × 6 场景 × 3 seeds × Control/Treatment，每词 54 对观测。
> 评测 = 豆包 VLM YES/NO adherence，每图独立两轮 + 矛盾人工裁决（四轮共裁决 4+12+11+38 = **65 处**，逐张核对图片，注记见 evaluations 文件的 `evaluator.auditResolved` 字段）。
> 汇总：`benchmark/results/summary-image-baseline-001+image-baseline-002+image-baseline-003+image-baseline-004.json`；异常挖掘：`node benchmark/analyze-anomalies.js`；免费再分析：`node benchmark/analyze-baseline.js --run image-baseline-001`。
> 与 §4.1 规划的差异：Seedream 家族内 2 模型 + CogView 家族 1 模型补齐第三家族；CogView-4 不支持 2048²（上限 2²¹ px），用 1440²；run 004 的 3 次生成失败为内容过滤假阳性（重试通过，失败记录见 `failures-*.jsonl`）；§4.2 视频 smoke 尚未执行，仍待视频 API 资源。

实测结果（heuristic 估计 → C 级 12 对 → B 级 36 对（Seedream×2）→ B 级 54 对（3 家族））：

| 词条 | heuristic | C（12 对） | B 36 对 | **B 54 对（3 家族）** |
|---|---:|---:|---:|---:|
| monochrome 黑白 | 88 | 100 | 100 | **82** |
| anime style 动漫风格 | 82 | 100 | 100 | **100** |
| volumetric light 体积光 | 72 | 80 | 86 | **64** |
| golden hour 黄金时刻 | 92 | 80 | 79 | **79** |
| symmetrical composition 对称构图 | 80 | 90 | 78 | **65** |
| shallow depth of field 浅景深 | 82 | 77 | 71 | **66** |
| close-up 特写 | 90 | 80 | 67 | **61** |
| rule of thirds 三分法 | 55 | 63 | 66 | **57** |
| macro 微距（run 004） | 85 | — | — | **3** |
| telephoto compression 长焦压缩 | 70 | — | — | **59** |
| fisheye lens 鱼眼 | 80 | — | — | **89** |
| rim light 轮廓光 | 84 | — | — | **65** |
| backlit silhouette 逆光剪影 | 78 | — | — | **77** |
| neon glow 霓虹光 | 85 | — | — | **82** |
| teal and orange 青橙调色 | 88 | — | — | **88** |
| film grain 胶片颗粒 | 75 | — | — | **71** |
| pastel colors 粉彩色 | 78 | — | — | **84** |
| ink wash painting 水墨画 | 70 | — | — | **69** |
| blue hour 蓝调时刻 | 88 | — | — | **86** |
| negative space 负空间 | 68 | — | — | **42** |

**家族偏差 > 种子方差**：CogView-4 单家族 modelScore 与 Seedream 差距巨大——monochrome 100/100 vs **61**、volumetric light 83/90 vs **38**、ink wash painting 100/100 vs **33**、negative space 73/67 vs **11**、anime 100/100/100（唯一跨家族满分）。这实证了 §Confidence v0.2 的判断：同厂两代模型的一致不能外推为跨模型结论，第三独立家族的信息增量远大于追加 seed。

**run 004 最大意外——macro 实测仅 3 分**（依从率 4%，Seedream 4.0 为 0）：连「物理事实」类词汇也可能全家族失效。「写 macro 就出微距」是当前所有测试模型的共同盲区，提示词里应改用画面描述（如 extreme close-up of ...）。**这一发现本身就是 20 词实测最大的单点价值。**

### 深度发现 / Findings（run 001，复用已付费数据的免费再分析）

**基线出现率 B（不加该词时模型自己画出来的比例）**——B 越高，这个词越「白写」：

| 词条 | 基线 B | 结论 |
|---|---:|---|
| rule of thirds | **92%** | 6 个场景 lift 全为 0——「说了白说」的实测铁证 |
| shallow depth of field | 75% | 人像/产品/动物场景模型默认就虚化；仅街景/建筑有增量 |
| golden hour | 67% | 暖光是模型的审美默认值；仅森林/建筑场景听指令 |
| close-up | 33% | 人像/产品/建筑场景默认就近；街景/动物需明写 |
| volumetric light | 33% | 对照图偶发眩光被误判，人工裁决已修正 |
| monochrome / anime / symmetry | **0%** | 真正的强控制开关：写了 100% 生效 |

**模型代差（Seedream 4.0 → 4.5 的 modelScore）**：4.5 在 close-up / symmetry / volumetric 上各 +17，但 rule of thirds 反而 −12（4.5 的构图默认倾向更强）。新一代 ≠ 更听话，分数必须分模型看。

复跑：`node benchmark/analyze-baseline.js --run image-baseline-001`

## 1. 测什么 / What we measure

不是「这个词画出来好不好看」，而是 **instruction lift（指令增量）**：加入该词后，目标效果正确出现的比例相比基线提升多少。

```
Control（不含目标词）:   portrait of a woman standing by a window
Treatment（只加目标词）: portrait of a woman standing by a window, Rembrandt lighting
```

这样能分离「模型本来就爱这么画」与「这个词真的在起作用」。

## 2. 指标与公式 / Metrics（benchmarkVersion: 0.1）

```
A = treatment adherence   加入词后目标效果正确出现的比例
B = baseline occurrence   不加词时目标效果自然出现的比例
L = max(0, A - B)         instruction lift
Model Score = 100 × (0.7 × A + 0.3 × L)
Atlas Score = 0.8 × mean(Model Scores) + 0.2 × min(Model Scores)
```

公式随 `benchmarkVersion` 版本化；改权重必须发新版本，历史分数可追溯。

## 3. Confidence 门槛 / Confidence Thresholds

| 等级 | 要求（v0.1） | 含义 |
|---|---|---|
| A | ≥72 paired observations；≥3 模型；≥4 scene；评测一致性 ≥0.85 | 证据充分，主榜分数 |
| B | ≥36 observations；≥2 模型；≥3 scene；一致性 ≥0.75 | 中等证据，公开但标 B |
| C | ≥12 observations，或覆盖不足 | 探索性分数，不作强结论 |
| heuristic | 未满足最小证据 | 只显示「经验估计」 |

### Confidence v0.2（规划中，未实施）

当前 A/B/C 仅由 paired observations 与模型/场景数决定，有两个已知局限，计划在 benchmarkVersion 0.2 引入：

1. **model-family coverage**：Seedream 4.0/4.5 是同一家族的两代，双高分只证明「Seedream 域内可控」；跨家族（Flux / Imagen / GPT Image 类）证据才支撑普适结论——增加 seed 降低的是采样方差，降不了模型家族偏差。
2. **judge agreement**：双轮 VLM 一致率（当前两轮不一致率约 3%）将显式计入 Confidence，替代「两轮取后值 + 人工裁决」的隐式处理。

目标形态：Confidence = f(sample count, seed coverage, scene coverage, model-family coverage, judge agreement)。公式变更随 benchmarkVersion 发布，历史分数可追溯。

## 4. 首批执行方案 / First Runs

**首轮目标声明（重要）：192 张只能产生 Confidence C。**
每个 atom 仅 3 models × 4 scenes = 12 paired observations，达到 C（≥12）门槛；**不是主榜 A 级分数**。首轮的目的只是跑通可复现协议。

升 B 的配方：3 models × 4 scenes × 3 seeds = 36 pairs/atom（≥36），需 8×3×4×2×3 ≈ 576 张（或对边界组合追加 seeds）。

### 4.1 Image Baseline（8 atoms，目标 Confidence C）

| 参数 | 配置 |
|---|---|
| Atoms | close-up, monochrome, golden hour, symmetrical composition（高）；shallow depth of field, anime style, volumetric light, rule of thirds（中低） |
| Models | 3 个当期可稳定调用的主流图片模型（名单写入 manifest，不写死进 schema） |
| Scene templates | 4：portrait / street / product-like / environment |
| Conditions | Control + Treatment |
| 基线规模 | 8 × 3 × 4 × 2 = **192 张** |
| Borderline | 仅对分数接近或评测不一致的组合追加 2 seeds |

### 4.2 Video Smoke（4 atoms，协议验证）

2 个视频模型 × 4 motion atoms × 2 scene templates × 2 conditions = **32 条**。

| 词条 | 最低可观察证据 |
|---|---|
| tracking shot | 主体与镜头相对运动在连续帧中成立 |
| handheld | 存在非规则、非机械的微抖动时序模式 |
| dolly zoom | 主体比例近稳 + 背景透视变化的组合 |
| long take | 持续镜头、无明显剪切（评估完整时间轴） |

**红线：视频术语不得用「单张中间帧」作为成立证据。**

## 5. 执行前置条件 / Prerequisites

- 3 个图片模型 + 2 个视频模型的 API 可用额度（Key 放服务端/本地脚本，**绝不进前端与仓库**）；
- 预算参考：192 图 + 32 视频的 API 成本约 ¥100–300（按当期价格）；
- 评测器：VLM + 规则问题 + 人工抽检，**保存 raw judgment**，不只存汇总分；
- 目录：`benchmark/manifests/`（模型/场景/seed/condition 元数据）、`benchmark/scenes/`（场景模板）、`benchmark/results/`（原始观察）、`benchmark/aggregate.js`（汇总脚本）。

## 6. 记录格式 / Record Format

```json
{
  "benchmarkVersion": "0.1",
  "atomId": "close-up",
  "modality": "image",
  "model": "<model-id>",
  "sceneTemplate": "portrait-01",
  "condition": "treatment",
  "seed": 12345,
  "prompt": "...",
  "evaluator": {
    "type": "vlm+human-audit",
    "adherence": 1,
    "confidence": 0.93,
    "notes": "subject framing is clearly close-up"
  },
  "createdAt": "2026-xx-xx"
}
```
