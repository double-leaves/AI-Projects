/**
 * Header 组件 - 导航栏
 */
function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-sm">
      <nav className="container mx-auto px-6 py-4">
        <ul className="flex justify-center space-x-8">
          <li><a href="#home" className="hover:text-purple-400 transition-colors">首页</a></li>
          <li><a href="#about" className="hover:text-purple-400 transition-colors">关于我</a></li>
          <li><a href="#projects" className="hover:text-purple-400 transition-colors">项目</a></li>
          <li><a href="#contact" className="hover:text-purple-400 transition-colors">联系</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
