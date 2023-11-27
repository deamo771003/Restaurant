#!/bin/sh

# 進行資料庫連接檢查
while ! mysql -h mysql -u root -ppassword -e "SELECT 1;" ; do
  echo "Waiting for database connection..."
  sleep 2
done

# 檢查Users表是否存在
table_exists=$(mysql -h mysql -u root -ppassword restaurant_sequelize -e "SHOW TABLES LIKE 'Users';" 2>/dev/null)

# 如果表不存在，執行遷移和種子
if [ -z "$table_exists" ]; then
  npx sequelize-cli db:migrate
  npx sequelize-cli db:seed:all
else
  echo 'Database is not empty, skipping seeds'
fi

# 啟動app
npm start