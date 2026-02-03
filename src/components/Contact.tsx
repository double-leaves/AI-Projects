/**
 * Contact 组件 - 联系方式
 */
function Contact() {
  return (
    <section id="contact" className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-2xl w-full text-center">
        <h2 className="text-4xl font-bold mb-8">联系我</h2>
        <p className="text-gray-400 text-lg mb-12">
          有任何问题或合作机会？欢迎联系我！
        </p>
        
        <div className="flex justify-center gap-8 mb-12">
          <a href="mailto:your.email@example.com" className="text-gray-400 hover:text-purple-400 transition-colors">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                ✉️
              </div>
              <span>Email</span>
            </div>
          </a>
          
          <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition-colors">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                💻
              </div>
              <span>GitHub</span>
            </div>
          </a>
          
          <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition-colors">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                🐦
              </div>
              <span>Twitter</span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

export default Contact;
