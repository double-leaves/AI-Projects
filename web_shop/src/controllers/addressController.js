const { pool } = require('../config/database');

class AddressController {
  // 添加地址
  async addAddress(req, res) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      const { name, phone, province, city, district, detail, is_default = false } = req.body;
      const userId = req.userId;

      // 验证必填字段
      if (!name || !phone || !province || !city || !district || !detail) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: '收货人、电话、省市区和详细地址不能为空'
        });
      }

      // 如果设置为默认地址，将其他地址的 is_default 设为 false
      if (is_default) {
        await connection.query(
          'UPDATE addresses SET is_default = FALSE WHERE user_id = ?',
          [userId]
        );
      } else {
        // 如果是第一个地址，自动设为默认地址
        const [addresses] = await connection.query(
          'SELECT COUNT(*) as count FROM addresses WHERE user_id = ?',
          [userId]
        );
        
        if (addresses[0].count === 0) {
          req.body.is_default = true;
        }
      }

      // 创建地址
      const [result] = await connection.query(
        'INSERT INTO addresses (user_id, name, phone, province, city, district, detail, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [userId, name, phone, province, city, district, detail, req.body.is_default || is_default]
      );

      await connection.commit();

      return res.status(201).json({
        success: true,
        message: '地址添加成功',
        data: {
          address_id: result.insertId
        }
      });

    } catch (error) {
      await connection.rollback();
      console.error('添加地址错误:', error);
      return res.status(500).json({
        success: false,
        message: '添加地址失败'
      });
    } finally {
      connection.release();
    }
  }

  // 获取地址列表
  async getAddresses(req, res) {
    const connection = await pool.getConnection();
    
    try {
      const userId = req.userId;

      // 获取地址列表，默认地址排在前面
      const [addresses] = await connection.query(
        'SELECT id, name, phone, province, city, district, detail, is_default, created_at FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC',
        [userId]
      );

      return res.json({
        success: true,
        data: {
          addresses: addresses,
          total: addresses.length
        }
      });

    } catch (error) {
      console.error('获取地址列表错误:', error);
      return res.status(500).json({
        success: false,
        message: '获取地址列表失败'
      });
    } finally {
      connection.release();
    }
  }

  // 更新地址
  async updateAddress(req, res) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      const { id } = req.params;
      const { name, phone, province, city, district, detail, is_default } = req.body;
      const userId = req.userId;

      // 检查地址是否存在且属于当前用户
      const [addresses] = await connection.query(
        'SELECT id, is_default FROM addresses WHERE id = ? AND user_id = ?',
        [id, userId]
      );

      if (addresses.length === 0) {
        await connection.rollback();
        return res.status(404).json({
          success: false,
          message: '地址不存在'
        });
      }

      // 如果设置为默认地址，将其他地址的 is_default 设为 false
      if (is_default === true || is_default === 1) {
        await connection.query(
          'UPDATE addresses SET is_default = FALSE WHERE user_id = ? AND id != ?',
          [userId, id]
        );
      }

      // 构建更新语句
      const updates = [];
      const values = [];

      if (name !== undefined) {
        updates.push('name = ?');
        values.push(name);
      }
      if (phone !== undefined) {
        updates.push('phone = ?');
        values.push(phone);
      }
      if (province !== undefined) {
        updates.push('province = ?');
        values.push(province);
      }
      if (city !== undefined) {
        updates.push('city = ?');
        values.push(city);
      }
      if (district !== undefined) {
        updates.push('district = ?');
        values.push(district);
      }
      if (detail !== undefined) {
        updates.push('detail = ?');
        values.push(detail);
      }
      if (is_default !== undefined) {
        updates.push('is_default = ?');
        values.push(is_default);
      }

      if (updates.length === 0) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: '没有需要更新的字段'
        });
      }

      values.push(id);

      // 更新地址
      await connection.query(
        `UPDATE addresses SET ${updates.join(', ')} WHERE id = ?`,
        values
      );

      await connection.commit();

      return res.json({
        success: true,
        message: '地址更新成功'
      });

    } catch (error) {
      await connection.rollback();
      console.error('更新地址错误:', error);
      return res.status(500).json({
        success: false,
        message: '更新地址失败'
      });
    } finally {
      connection.release();
    }
  }

  // 删除地址
  async deleteAddress(req, res) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      const { id } = req.params;
      const userId = req.userId;

      // 检查地址是否存在且属于当前用户
      const [addresses] = await connection.query(
        'SELECT id, is_default FROM addresses WHERE id = ? AND user_id = ?',
        [id, userId]
      );

      if (addresses.length === 0) {
        await connection.rollback();
        return res.status(404).json({
          success: false,
          message: '地址不存在'
        });
      }

      const wasDefault = addresses[0].is_default;

      // 删除地址
      await connection.query(
        'DELETE FROM addresses WHERE id = ?',
        [id]
      );

      // 如果删除的是默认地址，将第一个地址设为默认
      if (wasDefault) {
        const [remainingAddresses] = await connection.query(
          'SELECT id FROM addresses WHERE user_id = ? ORDER BY created_at ASC LIMIT 1',
          [userId]
        );

        if (remainingAddresses.length > 0) {
          await connection.query(
            'UPDATE addresses SET is_default = TRUE WHERE id = ?',
            [remainingAddresses[0].id]
          );
        }
      }

      await connection.commit();

      return res.json({
        success: true,
        message: '地址删除成功'
      });

    } catch (error) {
      await connection.rollback();
      console.error('删除地址错误:', error);
      return res.status(500).json({
        success: false,
        message: '删除地址失败'
      });
    } finally {
      connection.release();
    }
  }
}

module.exports = new AddressController();
