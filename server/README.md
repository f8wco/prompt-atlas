# Atlas Analytics 接收端部署说明（已部署于 www.f8w.com）

**部署状态**：✅ 已于 2026-08-19 上线生产（Python 版）。本文档同时是部署记录与回滚手册。

## 实际部署形态（Python 版，服务器无 Node）

服务器（58.87.94.200，腾讯云北京）主站为纯 Python 栈，接收端因此部署 **Python 移植版**（契约与 Node 版完全一致：同端点/同过滤规则/同 CORS）：

| 组件 | 位置 |
|---|---|
| 接收端脚本 | `/opt/atlas/atlas-evt-receiver.py`（本仓库 `server/atlas-evt-receiver.py`） |
| systemd 服务 | `/etc/systemd/system/atlas-evt.service`（`atlas-evt`，PORT=8901，Restart=always） |
| nginx location | `/etc/nginx/conf.d/f8w.conf` 内 `location = /api/atlas/evt` → `proxy_pass http://127.0.0.1:8901`（conf 备份：`f8w.conf.bak-20260819`） |
| 数据落盘 | `/opt/atlas/data/atlas-events-YYYY-MM-DD.jsonl`（按日滚动；部署验证数据已归档至 `events-archive-2026-08-19-deploytest.jsonl`，不进周报） |

## 运维命令

```bash
sudo systemctl status atlas-evt          # 状态
sudo systemctl restart atlas-evt         # 重启（更新 .py 后）
sudo journalctl -u atlas-evt -n 50       # 日志（仅启动行，逐请求静默）
# 数据保留：与分析 ID 同步 90 天，过期文件可 cron 清理
# 用户删除请求：grep aid 各日文件删除对应行后重写；联系方式见 web/privacy.html
```

## 回滚

- 主站 `/prompt-atlas/`：`sudo tar -xzf /home/ubuntu/patlas-v03b-backup-20260819.tgz -C /var/www`（v0.3b 完整备份）
- nginx：`sudo cp /etc/nginx/conf.d/f8w.conf.bak-20260819 /etc/nginx/conf.d/f8w.conf && sudo nginx -t && sudo systemctl reload nginx`
- 接收端：`sudo systemctl disable --now atlas-evt && sudo rm /etc/systemd/system/atlas-evt.service && sudo systemctl daemon-reload`

## 安全要点（已内建）

- CORS 白名单仅 www/atlas 两 Origin，无 credentials
- 请求体上限 1KB；事件名/字段双重白名单 + 长度上限（>60 字符字段整事件拒绝）
- aid 格式校验（8-64 位字母数字连字符）；监听 127.0.0.1（仅经 nginx 对外）
- **beacon 以 text/plain 发送（免 CORS 预检）**——2026-08-19 部署时发现并修复：sendBeacon+JSON Blob 会触发预检且 beacon 无法完成预检流程，导致零事件到达（修复提交见 web/analytics.js）

## Node 版（备用）

`server/atlas-evt-receiver.js` 为同契约 Node 实现（零依赖），供有 Node 环境的部署目标使用；当前生产以 Python 版为准。
