# Web Shop - 在线商城后端

基于 Node.js + Express + MySQL 的在线商城后端系统，实现了购物车功能。

## 技术栈

- **Node.js** - 运行环境
- **Express** - Web 框架
- **MySQL** - 数据库
- **JWT** - 身份认证
- **bcryptjs** - 密码加密

## 项目结构

```
web_shop/
├── database/
│   └── init.sql           # 数据库初始化脚本
├── src/
│   ├── config/
│   │   └── database.js    # 数据库配置
│   ├── controllers/
│   │   └── cartController.js  # 购物车控制器
│   ├── middleware/
│   │   └── auth.js        # JWT 认证中间件
│   ├── routes/
│   │   └── cart.js        # 购物车路由
│   └── server.js          # 服务器入口
├── .env.example           # 环境变量示例
├── .gitignore
├── package.json
└── README.md
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=web_shop
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

### 3. 初始化数据库

使用 MySQL 客户端执行初始化脚本：

```bash
mysql -u root -p < database/init.sql
```

或者登录 MySQL 后执行：

```sql
source database/init.sql;
```

### 4. 启动服务器

开发模式（支持热重载）：

```bash
npm run dev
```

生产模式：

```bash
npm start
```

服务器将运行在 `http://localhost:3000`

## API 文档

### 认证说明

除了健康检查接口外，所有 API 都需要在请求头中携带 JWT Token：

```
Authorization: Bearer <your_jwt_token>
```

### 测试用户

数据库已预置测试用户：

- **用户名**: testuser
- **邮箱**: test@example.com
- **密码**: password123
- **用户ID**: 1

### 购物车 API

#### 1. 添加到购物车

**请求**

```http
POST /api/cart
Content-Type: application/json
Authorization: Bearer <token>

{
  "product_id": 1,
  "quantity": 2
}
```

**响应**

```json
{
  "success": true,
  "message": "添加到购物车成功",
  "data": {
    "cart_item_id": 1,
    "quantity": 2
  }
}
```

**功能说明**：
- 如果购物车已有该商品，数量累加
- 如果是新商品，创建新记录
- 自动检查库存是否充足

---

#### 2. 获取购物车

**请求**

```http
GET /api/cart
Authorization: Bearer <token>
```

**响应**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "product_id": 1,
        "quantity": 2,
        "name": "iPhone 15 Pro",
        "description": "苹果最新款旗舰手机",
        "price": "7999.00",
        "stock": 50,
        "images": ["https://via.placeholder.com/300"],
        "category": "手机",
        "subtotal": "15998.00"
      }
    ],
    "total_price": "15998.00",
    "total_items": 1
  }
}
```

**功能说明**：
- 返回购物车商品列表
- 包含商品详情（名称、价格、图片等）
- 自动计算总价

---

#### 3. 更新数量

**请求**

```http
PUT /api/cart/:id
Content-Type: application/json
Authorization: Bearer <token>

{
  "quantity": 5
}
```

**响应**

```json
{
  "success": true,
  "message": "更新成功",
  "data": {
    "cart_item_id": 1,
    "quantity": 5
  }
}
```

**功能说明**：
- 更新指定购物车项的数量
- 自动检查库存

---

#### 4. 删除商品

**请求**

```http
DELETE /api/cart/:id
Authorization: Bearer <token>
```

**响应**

```json
{
  "success": true,
  "message": "删除成功"
}
```

**功能说明**：
- 从购物车删除指定商品

---

### 错误响应

所有 API 的错误响应格式：

```json
{
  "success": false,
  "message": "错误描述"
}
```

常见错误码：

- `400` - 请求参数错误
- `401` - 未认证或 Token 无效
- `404` - 资源不存在
- `500` - 服务器内部错误

## 测试接口

### 使用 curl 测试

1. **获取 JWT Token**（需要先实现登录接口，当前使用测试 Token）

```bash
# 生成测试 Token（在 Node.js 中执行）
const jwt = require('jsonwebtoken');
const token = jwt.sign({ userId: 1 }, 'your_jwt_secret_key');
console.log(token);
```

2. **添加到购物车**

```bash
curl -X POST http://localhost:3000/api/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{"product_id": 1, "quantity": 2}'
```

3. **获取购物车**

```bash
curl http://localhost:3000/api/cart \
  -H "Authorization: Bearer <your_token>"
```

4. **更新数量**

```bash
curl -X PUT http://localhost:3000/api/cart/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{"quantity": 5}'
```

5. **删除商品**

```bash
curl -X DELETE http://localhost:3000/api/cart/1 \
  -H "Authorization: Bearer <your_token>"
```

### 使用 Postman 测试

1. 导入 Postman Collection（可选）
2. 在 Headers 中添加 `Authorization: Bearer <token>`
3. 测试各个接口

## 数据库设计

详见 `database.md` 文件。

主要表结构：

- **users** - 用户表
- **products** - 商品表
- **cart_items** - 购物车表
- **addresses** - 地址表
- **orders** - 订单表
- **order_items** - 订单商品表

## 开发说明

### 代码规范

- 使用 ES6+ 语法
- 异步操作使用 async/await
- 统一的错误处理
- RESTful API 设计

### 安全性

- JWT Token 认证
- 密码 bcrypt 加密
- SQL 参数化查询（防止 SQL 注入）
- CORS 跨域配置

## 后续计划

- [ ] 实现用户注册/登录 API
- [ ] 实现商品管理 API
- [ ] 实现订单管理 API
- [ ] 添加单元测试
- [ ] 添加接口文档（Swagger）
- [ ] 实现支付功能

## 许可证

ISC
