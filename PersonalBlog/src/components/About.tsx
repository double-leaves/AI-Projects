import { skills } from '../data/skills';

/**
 * About 组件 - 关于我部分
 */
function About() {
  return (
    <section id="about" className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-4xl">
        <h2 className="text-4xl font-bold mb-8 text-center">关于我</h2>
        <p className="text-gray-400 text-lg mb-12 text-center">
          这里是你的个人介绍，可以描述你的背景、经验和热情。
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {skills.map((category, index) => (
            <div key={index} className="bg-zinc-900 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-purple-400">{category.category}</h3>
              <ul className="space-y-2">
                {category.skills.map((skill, skillIndex) => (
                  <li key={skillIndex} className="text-gray-400">{skill}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default About;
