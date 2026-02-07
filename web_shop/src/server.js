const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');
const addressRoutes = require('./routes/address');
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/addresses', addressRoutes);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: '服务运行正常' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: '服务器内部错误',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '请求的资源不存在'
  });
});

// 启动服务器
async function startServer() {
  try {
    await testConnection();
    app.listen(PORT, () => {
      console.log(`✓ 服务器运行在端口 ${PORT}`);
      console.log(`✓ 健康检查: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('✗ 服务器启动失败:', error.message);
    process.exit(1);
  }
}

startServer();
