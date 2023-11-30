## Restaurant 餐廳論壇

使用 Node.js、express、express handlebars 全端技術、MySQL Database、sequelize 搜尋打造的餐廳論壇

## Features 功能

1. SignUp 登入、Facebook OAuth 登入
2. Filter 分類瀏覽餐廳
3. Search 關鍵字搜尋
4. Sort 正反續、類型排序導覽
5. New 最新動態導覽
6. User list 追蹤人數排序使用者瀏覽
7. Top10 前 10 名追蹤人數餐廳導覽
8. Profile 檔案瀏覽與編輯
9. Admin 管理員 CRUD 功能

## Environment SetUp 環境建置

1. Node.js
2. MySQL
3. express
4. express-handlebars
5. sequelize

## Installing 安裝流程

1. Clone 此專案至本機電腦，打開你的 terminal

```
git clone https://github.com/deamo771003/Restaurant.git
```

2. 開啟終端機(Terminal)，進入存放此專案的資料夾

```
cd Restaurant
```

3. 安裝 npm 套件

```
npm init -y
```

4. 安裝所有套件

```
npm install
```

5. 安裝 cross-env

```
npm install --save-dev cross-env
```

6. 安裝 nodemon

```
npm install --save-dev nodemon
```

7. 新增.env 檔並加入以下內容

```
IMGUR_CLIENT_ID=自定義(圖片存儲)
FACEBOOK_ID=自定義(OAuth)
FACEBOOK_SECRET=自定義(OAuth)
FACEBOOK_CALLBACK=自定義(OAuth)
SESSION_SECRET=自定義
REDIS_URL=redis://redis:6379 (docker)
RDS_USERNAME=自定義
RDS_PASSWORD=自定義
RDS_DB_NAME=自定義
RDS_HOSTNAME=自定義
RDS_PORT=3306
```

8. 載入 MySQL Table

```
npx sequelize db:migrate
```

9. 載入預設範例資料

```
npx sequelize db:seed:all
```

10. cmd 輸入啟動

```
npm run dev
```

## 使用 docker 建置環境

1. 安裝 docker desktop

[docker](https://www.docker.com/)官網下載

2. 打開 cmd 輸入

```
docker-compose up -d
```

3. cmd 輸入啟動

```
npm run dev
```

## 可使用以下帳號測試

```
後台
account: root
password: 12345678

前台
email: user1@example.com
password: 12345678

或選擇使用 Facebook 登入
```

## Contributor 開發人員

[JimmyLin](https://github.com/deamo771003)
