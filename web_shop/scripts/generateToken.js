const jwt = require('jsonwebtoken');
require('dotenv').config();

// 生成测试用户的 JWT Token
const userId = 1; // 测试用户 ID
const token = jwt.sign(
  { userId: userId },
  process.env.JWT_SECRET || 'your_jwt_secret_key_here',
  { expiresIn: '7d' } // 7天有效期
);

console.log('\n=== 测试 JWT Token ===\n');
console.log('用户ID:', userId);
console.log('Token:', token);
console.log('\n=== 使用方法 ===\n');
console.log('在 API 请求头中添加：');
console.log('Authorization: Bearer ' + token);
console.log('\n');
