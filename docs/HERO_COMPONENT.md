# Hero 组件说明

## 组件概览

Hero 组件是个人作品集网站的首页主视觉区域，包含以下元素：

- 🎨 **动画头像**：带旋转边框的渐变圆形头像
- 📝 **大标题**：渐变色文字效果
- 💼 **副标题**：职业描述
- ✍️ **简介**：个人简短介绍
- 🔘 **CTA 按钮**：查看作品和联系我
- ⬇️ **滚动提示**：引导用户向下浏览

## 设计特点

### 深色主题
- 背景色：`#0a0a0a`
- 主文字：白色
- 次要文字：灰色系（`text-gray-400`, `text-gray-500`）

### 渐变色效果
- **紫色到粉色渐变**：`from-purple-500 to-pink-500`
  - 用于头像外圈
  - 用于按钮背景
  
- **标题渐变**：`from-purple-400 via-pink-400 to-purple-400`
  - 使用 `bg-clip-text` 和 `text-transparent` 实现文字渐变

### 背景装饰
- 左上角和右下角的模糊渐变圆圈
- 使用 `blur-3xl` 创建柔和的光晕效果

## 动画效果

使用 **Framer Motion** 实现以下动画：

1. **淡入动画**：所有元素从透明到不透明
2. **向上滑入**：文字元素从下方滑入
3. **缩放动画**：头像从小到大出现
4. **旋转动画**：头像外圈持续旋转（8秒一圈）
5. **上下浮动**：滚动提示箭头上下浮动
6. **延迟出场**：元素依次出现（stagger effect）

### 动画时间轴
- 0.0s - 容器淡入开始
- 0.2s - 头像出现
- 0.4s - 主标题出现
- 0.6s - 副标题出现
- 0.8s - 简介出现
- 1.0s - 按钮组出现
- 1.2s - 滚动提示出现

## 响应式设计

### 移动端（默认）
- 头像：`w-40 h-40`（160px）
- 标题：`text-5xl`
- 副标题：`text-xl`
- 按钮：垂直排列（`flex-col`）

### 平板（md: 768px+）
- 头像：`md:w-48 md:h-48`（192px）
- 标题：`md:text-7xl`
- 副标题：`md:text-2xl`
- 按钮：水平排列（`sm:flex-row`）

### 桌面（lg: 1024px+）
- 标题：`lg:text-8xl`
- 副标题：`lg:text-3xl`

## 自定义指南

### 1. 更换头像

**方法一：使用 Emoji（默认）**
```tsx
<span className="text-6xl">👨‍💻</span>  // 改成你喜欢的 emoji
```

**方法二：使用图片**
```tsx
// 1. 将图片放到 public/avatar.jpg
// 2. 替换代码：
<img src="/avatar.jpg" alt="头像" className="w-full h-full object-cover" />
```

### 2. 修改个人信息

```tsx
// 修改名字
<span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
  你的名字  {/* 改成你的真实姓名 */}
</span>

// 修改职业描述
全栈开发工程师 <span className="text-purple-400">|</span> 创造者
{/* 改成你的职业和标签 */}

// 修改简介
热爱编程，专注于打造优雅且高效的 Web 应用。
追求卓越的用户体验和简洁的代码设计。
{/* 改成你的个人简介，建议 2-3 行 */}
```

### 3. 修改渐变色

如果想改变主题色，修改以下类名：

```tsx
// 从紫色-粉色改为蓝色-青色
from-purple-500 to-pink-500  →  from-blue-500 to-cyan-500
from-purple-400 to-pink-400  →  from-blue-400 to-cyan-400
```

### 4. 调整动画速度

```tsx
// 加快动画
transition={{ duration: 0.6 }}  →  transition={{ duration: 0.3 }}

// 减慢动画
transition={{ duration: 0.6 }}  →  transition={{ duration: 1.0 }}

// 修改延迟
transition={{ duration: 0.6, delay: 0.4 }}
                                      ↑ 改这个数字
```

### 5. 修改按钮链接

```tsx
// 查看作品按钮
<a href="#projects">  {/* 链接到项目区块 */}

// 联系我按钮
<a href="#contact">   {/* 链接到联系区块 */}

// 也可以改成外部链接
<a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
```

## 使用的 Tailwind CSS 类

### 布局
- `min-h-screen` - 最小高度 100vh
- `flex items-center justify-center` - 居中对齐
- `relative` / `absolute` - 定位

### 间距
- `px-6` - 水平内边距 1.5rem
- `mb-8` - 下边距 2rem
- `gap-4` - 间隙 1rem

### 视觉效果
- `rounded-full` - 圆形
- `blur-3xl` - 强模糊
- `bg-gradient-to-r` - 从左到右渐变
- `bg-clip-text` - 文字渐变裁剪
- `text-transparent` - 文字透明
- `backdrop-blur-sm` - 背景模糊

### 颜色
- `bg-[#0a0a0a]` - 自定义背景色
- `text-purple-400` - 紫色文字
- `border-purple-500/50` - 50% 透明度紫色边框

### 交互
- `hover:scale-105` - 悬停放大
- `hover:shadow-lg` - 悬停阴影
- `transition-all duration-300` - 过渡动画

## 性能优化建议

1. **图片优化**
   - 头像使用 WebP 格式
   - 压缩到 100KB 以下
   - 使用 `loading="lazy"` 懒加载

2. **动画优化**
   - 使用 `transform` 和 `opacity` 属性（GPU 加速）
   - 避免动画 `width`、`height` 等触发重排的属性

3. **减少重绘**
   - 背景装饰使用 `will-change: transform`
   - 旋转动画使用 `transform: rotate()`

## 浏览器兼容性

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

需要注意：
- `backdrop-blur` 在某些浏览器可能不支持
- `bg-clip-text` 需要 `-webkit-` 前缀（Tailwind 已处理）

## 常见问题

**Q: 动画在移动端卡顿怎么办？**
A: 可以使用 `prefers-reduced-motion` 检测用户偏好，禁用动画：

```tsx
@media (prefers-reduced-motion: reduce) {
  /* 禁用所有动画 */
}
```

**Q: 如何更换背景色？**
A: 修改 section 的 className，或在 `index.css` 中全局设置

**Q: 能否添加粒子效果？**
A: 可以集成 `react-tsparticles` 库作为背景

---

享受你的个人作品集网站吧！🎉
