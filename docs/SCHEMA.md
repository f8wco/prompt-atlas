# Schema v2 · 数据模型规范 / Data Model Specification

`core.json` 是词库唯一权威数据源（single source of truth），`web/core-data.js` 由 `build.ps1` 自动生成，禁止手改。

机器可读契约见 `schema/core.schema.json`；可执行校验见 `scripts/validate-core.js`（CI 强制运行）。

## 1. Atom 与 Macro / Atom vs Macro

| 概念 | 定义 | 判定测试 |
|---|---|---|
| **Atom 原子** | 单一、可观察、可在 A/B 中独立测试的视觉控制 | 「能否用一次 A/B（加词 vs 不加词）分离出这个词的独立效果？」 |
| **Macro 复合词** | 多个 atom 打包成的高层概念 | 「拆开后是否仍然成立且更可控？」 |

规则：
- Macro 必须有非空 `expandsTo` 或 `implies`；
- Macro 可用于创作，但其 `score` 不应被解释为「单一控制量的确定性」；
- Benchmark 主体优先测 atom。

当前 Macro（首批 3 个）：`cinematic`、`cyberpunk-style`、`rainy-night`。

## 2. 字段说明 / Fields

```jsonc
{
  "id": "close-up",              // kebab-case，全局唯一，对外引用的 canonical id
  "type": "atom",                // atom | macro
  "slot": "shot",                // primarySlot，必须属于 9 槽位之一
  "modalities": ["image", "video"],  // 适用模态；纯时序词（运镜/延时等）为 ["video"]
  "zh": "特写", "en": "close-up",
  "aliases": { "zh": [], "en": ["close up", "closeup"] },  // 只参与匹配，不参与关系图
  "score": {
    "value": 90,                 // 0-100
    "status": "heuristic",       // heuristic=经验估计 | benchmarked=实测
    "confidence": null,          // A/B/C，仅 benchmarked 有意义
    "benchmarkVersion": null,    // 实测方法版本，保证历史分数可追溯
    "sampleSize": 0,
    "models": [],
    "updatedAt": "2026-08"
  },
  "relations": {
    "hardConflict": [],          // 同一 scope 下互斥，禁止自动同时选择
    "softTension": [],           // 可共存但互相削弱/需更多说明，黄色提示
    "redundant": [],             // 语义重复，不增加新控制量
    "requires": [],              // 成立需要前提
    "implies": [],               // 蕴含：计入覆盖，但可靠性只按 canonical 计一次
    "expandsTo": []              // Macro 拆解目标
  },
  "desc": "", "descEn": "", "example": ""
}
```

## 3. 关系语义 / Relation Semantics

| 关系 | Checker 行为 |
|---|---|
| `hardConflict` | 禁止自动同时选择；建议用户二选一（必须对称声明） |
| `softTension` | 黄色提示，不自动禁用 |
| `redundant` | 去重/提示冗余 |
| `requires` | 缺前提则降 confidence 或提示 |
| `implies` | 覆盖映射（如 rainy-night ⟹ night 计时间槽覆盖），可靠性不重复计分 |
| `expandsTo` | 提供「拆解并增强」动作 |

## 4. Score 状态 / Score Status

| status | 允许的表述 | 禁止的表述 |
|---|---|---|
| `heuristic` | 经验估计 / editorial estimate | 「稳定还原概率 82%」「跨模型已验证」 |
| `benchmarked` | Atlas Score + Confidence + Samples + Models + Benchmark 版本 | 隐藏样本量；把单一模型结果泛化为所有模型 |

`benchmarked` 硬性要求（CI 校验）：`sampleSize ≥ 12`、`models ≥ 2`、`benchmarkVersion` 非空。

## 5. Alias 规则 / Alias Rules

- alias 只负责匹配（Matcher 的 canonical 归一），不参与关系图；
- 同一语言内，一个 alias 只能映射到一个 canonical id（CI 校验）；
- 常见差异（`close up`/`closeup`/`close-up`、`time lapse`/`timelapse`）用 alias 归一，而不是造新词条。

## 6. 校验清单（CI 强制执行）/ Validation Checklist

1. JSON Schema：字段缺失、类型不符、enum 越界、score.value 非 0-100 → fail
2. ID 唯一性：atom/macro id 重复 → fail
3. 槽位引用：slot 不在 9 槽位中 → fail
4. Alias 冲突：同语言 alias 映射多个 id → fail
5. 关系引用：引用不存在 id / 自引用 / hardConflict 不对称 → fail
6. Macro 规则：无 expandsTo/implies 的 macro → fail
7. 生成同步：core.json 与 web/core-data.js 不一致 → fail
8. 行为回归：Matcher/Optimizer fixtures 失败 → fail
