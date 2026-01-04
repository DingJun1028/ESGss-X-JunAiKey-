#!/bin/bash
# ESG儀表板災難恢復腳本

set -e

BACKUP_DIR="/backup"
TIMESTAMP=${1:-latest}
ENVIRONMENT=${ENVIRONMENT:-production}

echo "開始災難恢復 - 環境: $ENVIRONMENT, 備份時間戳: $TIMESTAMP"

# 停止所有服務
echo "停止所有服務..."
docker-compose -f docker-compose.prod.yml down

# 查找最新的備份如果沒有指定時間戳
if [ "$TIMESTAMP" = "latest" ]; then
    TIMESTAMP=$(ls -t "$BACKUP_DIR/postgres/" | head -1 | sed 's/esg_dashboard_//' | sed 's/\.sql\.gz//')
    echo "使用最新的備份: $TIMESTAMP"
fi

# 恢復 PostgreSQL
echo "恢復 PostgreSQL 資料庫..."
DB_CONTAINER="esg-db"
DB_PASSWORD=${DB_PASSWORD}

# 創建恢復腳本
cat > restore_db.sh << EOF
#!/bin/bash
set -e

echo "等待 PostgreSQL 啟動..."
until pg_isready -U esg_user -d esg_dashboard; do
    sleep 2
done

echo "恢復資料庫..."
gunzip -c /backup/postgres/esg_dashboard_$TIMESTAMP.sql.gz | psql -U esg_user -d esg_dashboard

echo "資料庫恢復完成！"
EOF

chmod +x restore_db.sh

# 啟動資料庫
docker-compose -f docker-compose.prod.yml up -d esg-db

# 等待資料庫啟動並恢復
docker exec esg-db ./restore_db.sh

# 恢復 Redis
echo "恢復 Redis 數據..."
docker cp "$BACKUP_DIR/redis/redis_dump_$TIMESTAMP.rdb" esg-redis:/data/dump.rdb
docker-compose -f docker-compose.prod.yml restart esg-redis

# 啟動其他服務
echo "啟動應用服務..."
docker-compose -f docker-compose.prod.yml up -d esg-api esg-dashboard

# 等待服務啟動
echo "等待服務啟動..."
sleep 60

# 健康檢查
echo "執行健康檢查..."
if curl -f http://localhost/health; then
    echo "✅ 前端健康檢查通過"
else
    echo "❌ 前端健康檢查失敗"
    exit 1
fi

if curl -f http://localhost:3001/health; then
    echo "✅ API 健康檢查通過"
else
    echo "❌ API 健康檢查失敗"
    exit 1
fi

# 清理臨時文件
rm restore_db.sh

echo "災難恢復完成！"
echo "恢復的備份時間戳: $TIMESTAMP"
echo "請驗證應用功能是否正常。"

# 發送恢復通知
if [ -n "$SLACK_WEBHOOK_URL" ]; then
    curl -X POST -H 'Content-type: application/json' \
        --data "{\"text\":\"🚨 ESG儀表板災難恢復完成\\n環境: $ENVIRONMENT\\n備份時間戳: $TIMESTAMP\\n時間: $(date)\"}" \
        "$SLACK_WEBHOOK_URL"
fi