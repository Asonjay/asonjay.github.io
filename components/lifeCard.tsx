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
    <div className="panel-list-item p-5 h-full hover:!transform-none">
      <div
        className={`inline-flex p-3 rounded-full bg-gradient-to-r ${color} text-white mb-4`}
      >
        {icon}
      </div>
      <h3 className="text-base font-bold mb-2 text-fore-primary">
        {title}
      </h3>
      <p className="text-sm text-fore-subtle">{description}</p>
    </div>
  )

  if (link) {
    return (
      <a href={link} target="_blank" rel="noopener noreferrer" className="block h-full">
        <CardContent />
      </a>
    )
  }

  return <CardContent />
}
