const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/auth');

// 所有购物车路由都需要认证
router.use(authMiddleware);

// 添加到购物车
router.post('/', cartController.addToCart);

// 获取购物车
router.get('/', cartController.getCart);

// 更新数量
router.put('/:id', cartController.updateQuantity);

// 删除商品
router.delete('/:id', cartController.removeItem);

module.exports = router;
