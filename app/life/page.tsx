// app/life/page.tsx
import { Metadata } from 'next'
import { Heart, Book, Music, Coffee, Camera, Plane } from 'lucide-react'
import LifeCard from '../../components/lifeCard'

export const metadata: Metadata = {
  title: 'Life',
}

export default function Life() {
  const hobbies = [
    {
      icon: <Book size={24} />,
      title: 'Reading',
      description: 'I enjoy reading books on technology, philosophy, and science fiction.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <Music size={24} />,
      title: 'Music',
      description: 'Exploring different genres and discovering new artists.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: <Coffee size={24} />,
      title: 'Coffee',
      description: 'Coffee enthusiast, always looking for the perfect brew.',
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: <Camera size={24} />,
      title: 'Photography',
      description: 'Capturing moments and exploring the world through a lens.',
      color: 'from-green-500 to-teal-500',
    },
    {
      icon: <Plane size={24} />,
      title: 'Travel',
      description: 'Exploring new places and experiencing different cultures.',
      color: 'from-indigo-500 to-blue-500',
    },
  ]

  const resources = [
    {
      title: 'Favorite Tools',
      items: ['VS Code', 'Notion', 'Figma', 'Linear'],
      color: 'from-slate-500 to-gray-500',
    },
    {
      title: 'Currently Reading',
      items: ['Deep Learning', 'The Pragmatic Programmer', 'Thinking, Fast and Slow'],
      color: 'from-rose-500 to-red-500',
    },
  ]

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="glass-panel">
        <div className="section-label text-fore-subtle mb-2">Life.Log</div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-fore-primary mb-4">
          Life
        </h1>
        <p className="text-sm text-fore-subtle mb-6 max-w-3xl leading-relaxed">
          Beyond research and code, here&apos;s a glimpse into my interests, hobbies,
          and the things that inspire me.
        </p>
        <div className="h-px bg-[var(--color-border)] mb-8"></div>

        {/* Hobbies */}
        <div className="mb-10">
          <h2 className="font-heading text-xl font-bold mb-4 text-fore-primary">
            Hobbies &amp; Interests
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hobbies.map((hobby, index) => (
              <LifeCard
                key={index}
                icon={hobby.icon}
                title={hobby.title}
                description={hobby.description}
                color={hobby.color}
              />
            ))}
          </div>
        </div>

        {/* Resources */}
        <div className="mb-10">
          <h2 className="font-heading text-xl font-bold mb-4 text-fore-primary">
            Resources &amp; Favorites
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map((resource, index) => (
              <div
                key={index}
                className="panel-list-item p-5"
              >
                <h3 className={`text-base font-bold mb-3 bg-gradient-to-r ${resource.color} bg-clip-text text-transparent`}>
                  {resource.title}
                </h3>
                <ul className="space-y-2">
                  {resource.items.map((item, idx) => (
                    <li key={idx} className="text-sm text-fore-subtle flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Fun Facts */}
        <div>
          <h2 className="font-heading text-xl font-bold mb-4 text-fore-primary">
            Fun Facts
          </h2>
          <div className="panel-list-item p-5">
            <ul className="space-y-3 text-fore-subtle">
              <li className="flex items-start gap-3">
                <span className="text-accent font-bold">→</span>
                <span>I can solve a Rubik&apos;s cube in under 2 minutes</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent font-bold">→</span>
                <span>Coffee is my primary debugging tool</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent font-bold">→</span>
                <span>I&apos;ve visited 10+ countries and counting</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
