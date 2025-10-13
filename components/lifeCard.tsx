// components/lifeCard.tsx
import React from 'react'

interface LifeCardProps {
  icon: React.ReactNode
  title: string
  description: string
  color: string
  link?: string
}

export default function LifeCard({
  icon,
  title,
  description,
  color,
  link,
}: LifeCardProps) {
  const CardContent = () => (
    <div className="group p-6 border border-back-subtle rounded-lg hover:border-accent transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-back-primary h-full">
      <div
        className={`inline-flex p-3 rounded-full bg-gradient-to-r ${color} text-white mb-4`}
      >
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2 text-fore-primary group-hover:text-accent transition-colors">
        {title}
      </h3>
      <p className="text-sm text-fore-subtle">{description}</p>
    </div>
  )

  if (link) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full"
      >
        <CardContent />
      </a>
    )
  }

  return <CardContent />
}
