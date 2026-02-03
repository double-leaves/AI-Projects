/**
 * Footer 组件 - 页脚
 */
function Footer() {
  return (
    <footer className="bg-zinc-900 py-8 px-6">
      <div className="max-w-6xl mx-auto text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} 你的名字. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
