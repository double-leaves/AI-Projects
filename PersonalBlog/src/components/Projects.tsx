import { projects } from '../data/projects';

/**
 * Projects 组件 - 项目展示
 */
function Projects() {
  return (
    <section id="projects" className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-6xl w-full">
        <h2 className="text-4xl font-bold mb-12 text-center">我的项目</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div key={project.id} className="bg-zinc-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform">
              <div className="h-48 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                <p className="text-gray-400 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech, index) => (
                    <span key={index} className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  <a href={project.link} className="text-purple-400 hover:text-purple-300" target="_blank" rel="noopener noreferrer">
                    查看项目 →
                  </a>
                  {project.github && (
                    <a href={project.github} className="text-gray-400 hover:text-gray-300" target="_blank" rel="noopener noreferrer">
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;
