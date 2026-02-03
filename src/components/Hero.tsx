import { motion } from 'framer-motion';

/**
 * Hero 组件 - 首页主视觉区域
 * 包含头像、大标题、简介和交互动画
 */
function Hero() {
  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center justify-center px-6 pt-20 overflow-hidden"
    >
      {/* 背景装饰 - 渐变圆圈 */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>

      <motion.div
        className="relative z-10 text-center max-w-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* 头像 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative inline-block mb-4"
        >
          <div className="relative">
            {/* 头像外圈动画边框 */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              style={{ padding: '4px' }}
            />
            
            {/* 头像容器 */}
            <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-1">
              <div className="w-full h-full rounded-full bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
                {/* 可以替换为真实图片：<img src="/avatar.jpg" alt="头像" className="w-full h-full object-cover" /> */}
                <div className="w-full h-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 flex items-center justify-center">
                  <span className="text-4xl">👨‍💻</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 主标题 */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3"
        >
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            你的名字
          </span>
        </motion.h1>

        {/* 副标题 */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-base md:text-lg lg:text-xl text-gray-400 mb-4"
        >
          全栈开发工程师 <span className="text-purple-400">|</span> 创造者
        </motion.p>

        {/* 简介 */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-sm md:text-base text-gray-500 max-w-xl mx-auto mb-6 leading-relaxed"
        >
          热爱编程，专注于打造优雅且高效的 Web 应用。
          <br className="hidden md:block" />
          追求卓越的用户体验和简洁的代码设计。
        </motion.p>

        {/* CTA 按钮组 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center"
        >
          <a
            href="#projects"
            className="group px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-semibold text-white text-sm hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
          >
            查看作品
            <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">
              →
            </span>
          </a>
          
          <a
            href="#contact"
            className="px-6 py-2.5 border-2 border-purple-500/50 rounded-full font-semibold text-white text-sm hover:bg-purple-500/10 hover:border-purple-400 transition-all duration-300"
          >
            联系我
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default Hero;
