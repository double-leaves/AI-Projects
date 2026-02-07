const { pool } = require('../config/database');

class CartController {
  // 添加到购物车
  async addToCart(req, res) {
    const connection = await pool.getConnection();
    try {
      const { product_id, quantity = 1 } = req.body;
      const userId = req.userId;

      // 验证必填字段
      if (!product_id) {
        return res.status(400).json({
          success: false,
          message: '商品ID不能为空'
        });
      }

      // 检查商品是否存在
      const [products] = await connection.query(
        'SELECT id, name, stock FROM products WHERE id = ?',
        [product_id]
      );

      if (products.length === 0) {
        return res.status(404).json({
          success: false,
          message: '商品不存在'
        });
      }

      const product = products[0];

      // 检查库存是否充足
      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: '库存不足',
          available_stock: product.stock
        });
      }

      // 检查购物车中是否已有该商品
      const [existingItems] = await connection.query(
        'SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?',
        [userId, product_id]
      );

      if (existingItems.length > 0) {
        // 已存在，累加数量
        const existingItem = existingItems[0];
        const newQuantity = existingItem.quantity + quantity;

        // 检查累加后的数量是否超过库存
        if (newQuantity > product.stock) {
          return res.status(400).json({
            success: false,
            message: '库存不足',
            available_stock: product.stock,
            current_cart_quantity: existingItem.quantity
          });
        }

        await connection.query(
          'UPDATE cart_items SET quantity = ? WHERE id = ?',
          [newQuantity, existingItem.id]
        );

        return res.json({
          success: true,
          message: '购物车更新成功',
          data: {
            cart_item_id: existingItem.id,
            quantity: newQuantity
          }
        });
      } else {
        // 不存在，创建新记录
        const [result] = await connection.query(
          'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
          [userId, product_id, quantity]
        );

        return res.status(201).json({
          success: true,
          message: '添加到购物车成功',
          data: {
            cart_item_id: result.insertId,
            quantity: quantity
          }
        });
      }
    } catch (error) {
      console.error('添加到购物车错误:', error);
      return res.status(500).json({
        success: false,
        message: '添加到购物车失败'
      });
    } finally {
      connection.release();
    }
  }

  // 获取购物车
  async getCart(req, res) {
    const connection = await pool.getConnection();
    try {
      const userId = req.userId;

      const [cartItems] = await connection.query(`
        SELECT 
          ci.id,
          ci.product_id,
          ci.quantity,
          p.name,
          p.description,
          p.price,
          p.stock,
          p.images,
          p.category,
          (ci.quantity * p.price) as subtotal
        FROM cart_items ci
        INNER JOIN products p ON ci.product_id = p.id
        WHERE ci.user_id = ?
        ORDER BY ci.created_at DESC
      `, [userId]);

      // 解析 JSON 字段
      const items = cartItems.map(item => ({
        ...item,
        images: typeof item.images === 'string' ? JSON.parse(item.images) : item.images
      }));

      // 计算总价
      const totalPrice = items.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);

      return res.json({
        success: true,
        data: {
          items: items,
          total_price: totalPrice.toFixed(2),
          total_items: items.length
        }
      });
    } catch (error) {
      console.error('获取购物车错误:', error);
      return res.status(500).json({
        success: false,
        message: '获取购物车失败'
      });
    } finally {
      connection.release();
    }
  }

  // 更新数量
  async updateQuantity(req, res) {
    const connection = await pool.getConnection();
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      const userId = req.userId;

      // 验证数量
      if (!quantity || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: '数量必须大于0'
        });
      }

      // 检查购物车项是否存在且属于当前用户
      const [cartItems] = await connection.query(
        'SELECT ci.id, ci.product_id, p.stock FROM cart_items ci INNER JOIN products p ON ci.product_id = p.id WHERE ci.id = ? AND ci.user_id = ?',
        [id, userId]
      );

      if (cartItems.length === 0) {
        return res.status(404).json({
          success: false,
          message: '购物车项不存在'
        });
      }

      const cartItem = cartItems[0];

      // 检查库存
      if (quantity > cartItem.stock) {
        return res.status(400).json({
          success: false,
          message: '库存不足',
          available_stock: cartItem.stock
        });
      }

      // 更新数量
      await connection.query(
        'UPDATE cart_items SET quantity = ? WHERE id = ?',
        [quantity, id]
      );

      return res.json({
        success: true,
        message: '更新成功',
        data: {
          cart_item_id: parseInt(id),
          quantity: quantity
        }
      });
    } catch (error) {
      console.error('更新购物车数量错误:', error);
      return res.status(500).json({
        success: false,
        message: '更新失败'
      });
    } finally {
      connection.release();
    }
  }

  // 删除商品
  async removeItem(req, res) {
    const connection = await pool.getConnection();
    try {
      const { id } = req.params;
      const userId = req.userId;

      // 检查购物车项是否存在且属于当前用户
      const [cartItems] = await connection.query(
        'SELECT id FROM cart_items WHERE id = ? AND user_id = ?',
        [id, userId]
      );

      if (cartItems.length === 0) {
        return res.status(404).json({
          success: false,
          message: '购物车项不存在'
        });
      }

      // 删除
      await connection.query(
        'DELETE FROM cart_items WHERE id = ?',
        [id]
      );

      return res.json({
        success: true,
        message: '删除成功'
      });
    } catch (error) {
      console.error('删除购物车项错误:', error);
      return res.status(500).json({
        success: false,
        message: '删除失败'
      });
    } finally {
      connection.release();
    }
  }
}

module.exports = new CartController();
