const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');

// 所有订单路由都需要认证
router.use(authMiddleware);

// 创建订单
router.post('/', orderController.createOrder);

// 获取订单列表（支持状态筛选）
router.get('/', orderController.getOrders);

// 获取订单详情
router.get('/:id', orderController.getOrderDetail);

// 取消订单
router.put('/:id/cancel', orderController.cancelOrder);

module.exports = router;
