const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  try {
    // 从请求头获取 token
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: '未提供认证令牌'
      });
    }

    // 验证 token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: '无效的认证令牌'
    });
  }
};

module.exports = authMiddleware;
