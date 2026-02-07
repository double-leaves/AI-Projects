const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const authMiddleware = require('../middleware/auth');

// 所有地址路由都需要认证
router.use(authMiddleware);

// 添加地址
router.post('/', addressController.addAddress);

// 获取地址列表
router.get('/', addressController.getAddresses);

// 更新地址
router.put('/:id', addressController.updateAddress);

// 删除地址
router.delete('/:id', addressController.deleteAddress);

module.exports = router;
