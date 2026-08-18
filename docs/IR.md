# Scene IR · 中间表示设计 / Intermediate Representation

> 状态：**设计稿（v0.1，未实施）**。Storyboard v2 的分享 payload 已是它的雏形——本文件把目标结构固定下来，
> 让后续的网页编辑器、Agent 生成器、模型适配器都围绕同一份数据工作。

## 1. 为什么要 IR

当前三种入口各自为政：网页配方卡输出字符串、分镜页输出时间戳文本、Agent 按 SKILL.md 自由发挥。
一旦固定 IR：

- **网页版** = IR 的可视化编辑器
- **Agent Skill** = IR 的生成器（剧本 → IR）
- **Model Adapter** = IR → 各模型专属 Prompt 的编译器（Kling 强调运动、Seedance 强调时序、Midjourney 强调构图参数）
- **Checker / Control Profile** = IR 的静态分析器

## 2. 结构（草案）

```jsonc
{
  "irVersion": 1,
  "globalStyle": "顶级国漫院线质感",          // 全片继承
  "duration": 120,                            // 总秒数
  "segLength": 15,
  "scenes": [{
    "id": "seg-1",
    "start": 0, "end": 15,
    "content": {
      "subject": "江离",
      "action": "歪在软榻上听曲",
      "environment": "醉仙楼三楼雅间"
    },
    "beats": [
      { "time": [0, 2], "role": "establish", "action": "门窗细缝漏进喧闹" }
    ],
    "controls": {                              // 9 槽位，值为 atom id
      "lighting": "golden-hour",
      "shot": "close-up",
      "camera": null
    }
  }],
  "continuity": {                              // v0.5：跨段一致性（评审点名的真痛点）
    "characters": [{ "id": "jiangli", "desc": "18 岁白衣少年", "scenes": ["seg-1", "seg-2"] }],
    "environmentInheritance": ["globalStyle", "seg-N.reuse:seg-1.environment"]
  }
}
```

## 3. 分层映射

| IR 字段 | 层 | 现有实现 |
|---|---|---|
| content.* | Content Layer | 分镜页拍点文本 |
| controls.* | Visual Control Layer | 9 槽位 / core.json |
| beats/时间戳 | Temporal Layer | storyboard.js 硬约束 |
| （未来）adapter | Compilation Layer | Model Adapter（v0.6） |

## 4. 实施顺序建议

1. 分镜页内部 state 直接采用 IR 结构（分享链接 payload 升级为 IR，向后兼容解码）
2. `core-lib.js` 增加 `compileIR(ir, adapterId)`（先只有 `generic` 一个 adapter）
3. Checker 增加 `lintIR(ir)`（跨段冲突、camera 衔接、continuity 检查）
4. 第一个真实 adapter：Kling 或 Seedance（P5，一次只做两个）
