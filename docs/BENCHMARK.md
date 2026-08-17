# BENCHMARK · 可复现实测协议 / Reproducible Benchmark Protocol

> **状态（2026-08-17）：图像首轮已执行并完成聚合。** runId `image-baseline-001`：2 模型（doubao-seedream-4-0-250828 / doubao-seedream-4-5-251128）× 6 场景 × 8 词条 × Control/Treatment = 192 张（2048×2048，seed=1）。
> 评测 = 豆包 VLM YES/NO adherence + 119 张复评 + 4 处两轮矛盾的人工裁决（逐张核对图片，注记见 evaluations 文件的 `evaluator.auditResolved` 字段）。
> 结果：8 词条全部升级 `benchmarked`（Confidence C，每词 12 对观测），汇总见 `benchmark/results/summary-image-baseline-001.json`。
> 与 §4.1 规划的差异：模型 3→2、场景 4→6（维持每词 12 对观测的 C 门槛）；§4.2 视频 smoke 尚未执行，仍待视频 API 资源。

首轮实测结果（heuristic 估计 → benchmarked 实测）：

| 词条 | heuristic | benchmarked（C） |
|---|---:|---:|
| monochrome 黑白 | 88 | **100** |
| anime style 动漫风格 | 82 | **100** |
| symmetrical composition 对称构图 | 80 | **90** |
| golden hour 黄金时刻 | 92 | **80** |
| volumetric light 体积光 | 72 | **80** |
| close-up 特写 | 90 | **80** |
| shallow depth of field 浅景深 | 82 | **77** |
| rule of thirds 三分法 | 55 | **63** |

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
