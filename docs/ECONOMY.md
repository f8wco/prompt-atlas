# 激励体系 ECONOMY · Incentive System

> 目标：让「图库」自己生长——用户贡献词条、配图、验证分数，获得积分与署名。
> Goal: make the dictionary grow itself — users contribute terms, images and score validation, and earn points and attribution.

---

## 一、积分行为表 / Points Table

| 行为 Action | 积分 Points | 说明 Notes |
|---|---|---|
| 提交新词条并通过审核 / Submit approved term | 50 | 含双语字段与打分依据 |
| 为缺图词条上传样图并被采用 / Upload accepted sample image | 80 | 采用后永久署名 |
| 报告词条分数不准（附对比测试）/ Report wrong score (with A/B evidence) | 30 | 人工复核后修正分数 |
| 修正词条英文/描述错误 / Fix EN/description errors | 10 | |
| 参与周赛 / Join weekly challenge | 20 | 提交即得 |
| 周赛冠军 / Win weekly challenge | 200 | 冠军帧成为官方样图 |
| 认领悬赏词条 / Claim a bounty term | 悬赏值 | 见悬赏榜 |

## 二、徽章体系 / Badges

| 徽章 Badge | 条件 Condition |
|---|---|
| 🏅 创始词条猎人 / Founding Term Hunter | 上线 90 天内提交 ≥ 10 个词条（绝版） |
| 🖼️ 样图定义者 / Frame Definer | 样图被采用 ≥ 1 张（永久署名） |
| 🔬 分数纠察员 / Score Auditor | 成功纠错分数 ≥ 5 次 |
| 🏆 一词成名 / One-Term Legend | 获得周赛冠军 ≥ 1 次 |

**创始期激励 / Founding bonus**：前 100 名种子用户享 90 天双倍积分；徽章永久展示在个人主页与词条署名处。

## 三、悬赏榜 / Bounty Board

- 缺图/缺词的词条挂上悬赏榜，明码标分
- 认领制：一人认领一个词，48 小时内提交，逾期释放
- 认领人完成即得悬赏分 + 样图署名权（"这个词的效果图由 @xxx 定义"）
- 悬赏分来源：新词条上线时系统默认 50 分，社区可加码

## 四、「一词成名」周赛 / Weekly "One-Term Legend" Challenge

1. 每周指定一个缺图词条（优先高确定性、高流量词）
2. 参赛者用该词条为核心制作视频/图片并提交
3. 社区投票 + 评审团（种子用户）各占 50%
4. 冠军：帧成为官方样图 + 200 积分 + 署名 + 作品进入官方宣传素材
5. 一箭四雕：采到图、验了词、活了社区、参赛作品本身就是传播素材

## 五、反作弊 / Anti-abuse

- 双倍积分期最容易招刷子：**提交需人工审核**，宁缺毋滥
- 上传内容需勾选版权声明（自有/CC0/已授权）
- 刷分账号：清零积分 + 冻结悬赏资格
- 真实电影片段只作参考展示，**绝不进入下载库**（版权红线）

## 六、后端接口预留 / Backend Interfaces (Reserved)

```
POST /terms           提交词条        {zh,en,desc,descEn,slot,score,evidence}
POST /images          上传样图        {termId,file,license}
POST /claims          认领悬赏        {termId}
POST /challenges      周赛投稿        {termId,mediaUrl}
GET  /leaderboard     积分榜
```
（积分/用户系统需要后端服务，本仓库当前为纯静态版本，接口在此预定义以便后续对接。）
