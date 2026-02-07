const { pool } = require('../config/database');

class OrderController {
  // 生成订单号：时间戳 + 6位随机数
  generateOrderNo() {
    const timestamp = Date.now();
    const random = Math.floor(100000 + Math.random() * 900000);
    return `${timestamp}${random}`;
  }

  // 创建订单
  async createOrder(req, res) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      const { address_id, cart_item_ids } = req.body;
      const userId = req.userId;

      // 验证必填字段
      if (!address_id) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: '收货地址不能为空'
        });
      }

      if (!cart_item_ids || !Array.isArray(cart_item_ids) || cart_item_ids.length === 0) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: '购物车商品列表不能为空'
        });
      }

      // 检查地址是否存在且属于当前用户
      const [addresses] = await connection.query(
        'SELECT id FROM addresses WHERE id = ? AND user_id = ?',
        [address_id, userId]
      );

      if (addresses.length === 0) {
        await connection.rollback();
        return res.status(404).json({
          success: false,
          message: '收货地址不存在'
        });
      }

      // 获取购物车商品信息
      const placeholders = cart_item_ids.map(() => '?').join(',');
      const [cartItems] = await connection.query(`
        SELECT 
          ci.id,
          ci.product_id,
          ci.quantity,
          p.name,
          p.price,
          p.stock
        FROM cart_items ci
        INNER JOIN products p ON ci.product_id = p.id
        WHERE ci.id IN (${placeholders}) AND ci.user_id = ?
      `, [...cart_item_ids, userId]);

      if (cartItems.length === 0) {
        await connection.rollback();
        return res.status(404).json({
          success: false,
          message: '购物车商品不存在'
        });
      }

      if (cartItems.length !== cart_item_ids.length) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: '部分购物车商品不存在或不属于当前用户'
        });
      }

      // 检查库存并计算总价
      let totalPrice = 0;
      const insufficientStock = [];

      for (const item of cartItems) {
        if (item.stock < item.quantity) {
          insufficientStock.push({
            product_name: item.name,
            required: item.quantity,
            available: item.stock
          });
        }
        totalPrice += parseFloat(item.price) * item.quantity;
      }

      if (insufficientStock.length > 0) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: '部分商品库存不足',
          insufficient_stock: insufficientStock
        });
      }

      // 生成订单号
      const orderNo = this.generateOrderNo();

      // 创建订单
      const [orderResult] = await connection.query(
        'INSERT INTO orders (order_no, user_id, address_id, total_price, status) VALUES (?, ?, ?, ?, ?)',
        [orderNo, userId, address_id, totalPrice.toFixed(2), 'pending']
      );

      const orderId = orderResult.insertId;

      // 创建订单商品记录并扣减库存
      for (const item of cartItems) {
        // 插入订单商品
        await connection.query(
          'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
          [orderId, item.product_id, item.quantity, item.price]
        );

        // 扣减库存
        await connection.query(
          'UPDATE products SET stock = stock - ? WHERE id = ?',
          [item.quantity, item.product_id]
        );
      }

      // 清空购物车中已下单的商品
      await connection.query(
        `DELETE FROM cart_items WHERE id IN (${placeholders})`,
        cart_item_ids
      );

      // 提交事务
      await connection.commit();

      return res.status(201).json({
        success: true,
        message: '订单创建成功',
        data: {
          order_id: orderId,
          order_no: orderNo,
          total_price: totalPrice.toFixed(2),
          items_count: cartItems.length
        }
      });

    } catch (error) {
      await connection.rollback();
      console.error('创建订单错误:', error);
      return res.status(500).json({
        success: false,
        message: '创建订单失败'
      });
    } finally {
      connection.release();
    }
  }

  // 获取订单列表
  async getOrders(req, res) {
    const connection = await pool.getConnection();
    
    try {
      const userId = req.userId;
      const { status } = req.query;

      let query = `
        SELECT 
          o.id,
          o.order_no,
          o.total_price,
          o.status,
          o.created_at,
          o.updated_at,
          COUNT(oi.id) as items_count
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        WHERE o.user_id = ?
      `;
      
      const params = [userId];

      // 按状态筛选
      if (status) {
        query += ' AND o.status = ?';
        params.push(status);
      }

      query += ' GROUP BY o.id ORDER BY o.created_at DESC';

      const [orders] = await connection.query(query, params);

      return res.json({
        success: true,
        data: {
          orders: orders,
          total: orders.length
        }
      });

    } catch (error) {
      console.error('获取订单列表错误:', error);
      return res.status(500).json({
        success: false,
        message: '获取订单列表失败'
      });
    } finally {
      connection.release();
    }
  }

  // 获取订单详情
  async getOrderDetail(req, res) {
    const connection = await pool.getConnection();
    
    try {
      const { id } = req.params;
      const userId = req.userId;

      // 获取订单基本信息
      const [orders] = await connection.query(`
        SELECT 
          o.id,
          o.order_no,
          o.total_price,
          o.status,
          o.created_at,
          o.updated_at,
          a.name as receiver_name,
          a.phone as receiver_phone,
          a.province,
          a.city,
          a.district,
          a.detail as address_detail
        FROM orders o
        INNER JOIN addresses a ON o.address_id = a.id
        WHERE o.id = ? AND o.user_id = ?
      `, [id, userId]);

      if (orders.length === 0) {
        return res.status(404).json({
          success: false,
          message: '订单不存在'
        });
      }

      const order = orders[0];

      // 获取订单商品列表
      const [orderItems] = await connection.query(`
        SELECT 
          oi.id,
          oi.product_id,
          oi.quantity,
          oi.price,
          p.name,
          p.images,
          p.category,
          (oi.quantity * oi.price) as subtotal
        FROM order_items oi
        INNER JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `, [id]);

      // 解析 JSON 字段
      const items = orderItems.map(item => ({
        ...item,
        images: typeof item.images === 'string' ? JSON.parse(item.images) : item.images
      }));

      return res.json({
        success: true,
        data: {
          ...order,
          items: items
        }
      });

    } catch (error) {
      console.error('获取订单详情错误:', error);
      return res.status(500).json({
        success: false,
        message: '获取订单详情失败'
      });
    } finally {
      connection.release();
    }
  }

  // 取消订单
  async cancelOrder(req, res) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      const { id } = req.params;
      const userId = req.userId;

      // 检查订单是否存在且属于当前用户
      const [orders] = await connection.query(
        'SELECT id, status FROM orders WHERE id = ? AND user_id = ?',
        [id, userId]
      );

      if (orders.length === 0) {
        await connection.rollback();
        return res.status(404).json({
          success: false,
          message: '订单不存在'
        });
      }

      const order = orders[0];

      // 只能取消待支付的订单
      if (order.status !== 'pending') {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: '只能取消待支付的订单',
          current_status: order.status
        });
      }

      // 获取订单商品列表
      const [orderItems] = await connection.query(
        'SELECT product_id, quantity FROM order_items WHERE order_id = ?',
        [id]
      );

      // 恢复库存
      for (const item of orderItems) {
        await connection.query(
          'UPDATE products SET stock = stock + ? WHERE id = ?',
          [item.quantity, item.product_id]
        );
      }

      // 更新订单状态为已取消
      await connection.query(
        'UPDATE orders SET status = ? WHERE id = ?',
        ['cancelled', id]
      );

      // 提交事务
      await connection.commit();

      return res.json({
        success: true,
        message: '订单已取消'
      });

    } catch (error) {
      await connection.rollback();
      console.error('取消订单错误:', error);
      return res.status(500).json({
        success: false,
        message: '取消订单失败'
      });
    } finally {
      connection.release();
    }
  }
}

module.exports = new OrderController();
