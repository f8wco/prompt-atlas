# MIGRATION v2 · 词库 v1 → v2 迁移记录

## 变更摘要 / Summary

| 维度 | v1 | v2 |
|---|---|---|
| 版本 | 1 | 2 |
| score | 裸整数 | 对象 `{value, status: heuristic, confidence, benchmarkVersion, sampleSize, models, updatedAt}` |
| 词条类型 | 无 | `type: atom \| macro`（首批 3 个 macro：cinematic / cyberpunk-style / rainy-night） |
| 模态 | 无 | `modalities: ["image","video"]`，纯时序词为 `["video"]` |
| 别名 | 无 | `aliases: {zh, en}`（close up/closeup、time lapse/timelapse 等归一） |
| 关系 | 无（代码内关键词黑名单） | `relations: {hardConflict, softTension, redundant, requires, implies, expandsTo}`（首批约 20 组） |

## 迁移方式 / How it was done

一次性迁移脚本：`node scripts/migrate-v2.js`（幂等：v2 输入直接跳过）。脚本保留在仓库作为审计留档。

迁移后必须重建生成文件并跑全量校验：

```bash
node scripts/migrate-v2.js   # 如尚未迁移
pwsh -File build.ps1         # 重建 web/core-data.js
node scripts/validate-core.js
node tests/run-tests.js
```

## 兼容性说明 / Compatibility

- 所有词条 `id` 保持不变，网页与外部引用不受影响；
- 网页对 `score` 的读取通过 `readScore()` 兼容新旧两种形态（过渡期安全）；
- 旧的关键词冲突黑名单保留为「自由文本冲突提示」，与新的 relations 硬冲突并行：**relations 负责词条间关系，黑名单负责词条 vs 自由文本**（详见 docs/SCHEMA.md）。

## 诚实性变更 / Honesty Change

v1 曾把 score 描述为「稳定还原概率」。v2 起：**所有现有分数 status = heuristic（经验估计），不得表述为概率或实测结论**；实测分数只能通过 benchmark 管道产出（docs/BENCHMARK.md）并以 `benchmarked` 状态发布。
