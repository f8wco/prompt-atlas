# Atlas Analytics 接收端部署说明

`atlas-evt-receiver.js` 是零依赖 Node 接收端（P0-004），在 **www.f8w.com 主站服务器**上运行，接收 `https://www.f8w.com/api/atlas/evt`。

## 部署步骤（主站服务器，/var/www/fabu 所在机器）

1. 上传文件：把 `server/atlas-evt-receiver.js` 放到服务器任意目录（例如 `/opt/atlas/`）。
2. 进程守护（systemd 示例 `/etc/systemd/system/atlas-evt.service`）：

```ini
[Unit]
Description=Atlas Analytics receiver
After=network.target

[Service]
WorkingDirectory=/opt/atlas
ExecStart=/usr/bin/node /opt/atlas/atlas-evt-receiver.js
Environment=PORT=8901
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload && sudo systemctl enable --now atlas-evt
```

3. nginx 反代（加到 www.f8w.com 的 server 块）：

```nginx
location /api/atlas/evt {
    proxy_pass http://127.0.0.1:8901/api/atlas/evt;
    proxy_set_header Host $host;
    client_max_body_size 2k;
}
```

4. 验证：

```bash
curl -i -X POST https://www.f8w.com/api/atlas/evt \
  -H 'Content-Type: application/json' -H 'Origin: https://atlas.f8w.com' \
  -d '{"aid":"a-test-12345678","t":1,"name":"page_view","payload":{"path":"/","lang":"zh"}}'
# 期望 204；data/atlas-events-YYYY-MM-DD.jsonl 出现一行
```

## 数据与删除

- 存储位置：接收进程工作目录下 `data/atlas-events-YYYY-MM-DD.jsonl`（按日滚动，事件全量为过滤后信封，无 Prompt 正文）。
- 用户请求删除：按 aid grep 所有日文件删除对应行后重写（或直接告知保留期），联系方式见 web/privacy.html。
- 保留策略建议：90 天（与分析 ID 有效期一致），过期文件可 cron 清理。

## 安全要点（已内建）

- CORS 白名单仅 www/atlas 两 Origin，无 credentials
- 请求体上限 1KB（超限直接断开）
- 事件名/字段双重白名单 + 长度上限（>60 字符字段整事件拒绝）
- aid 格式校验（8-64 位字母数字连字符）
