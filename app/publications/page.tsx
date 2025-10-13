// app/publications/page.tsx
import { Metadata } from 'next'
import { Fragment } from 'react'
import PublicationList from '../../components/publicationList'
import { Papers24 } from '../../components/icons'

export const metadata: Metadata = {
  title: 'Publications',
}

export default function Publications() {
  return (
    <Fragment>
      <span className="inline-flex p-3 rounded-full bg-back-subtle">
        <Papers24 />
      </span>
      <h1 className="mt-3 mb-2 text-2xl font-bold tracking-tight text-accent">
        Publications
      </h1>

      <p className="mb-2 text-fore-subtle">
        My research focuses on reinforcement learning for robotics and the
        capabilities and security of Large Language Models (LLMs). My current
        research directions include reinforcement learning algorithms for
        robotic manipulation, responsible AI, LLM post-training, development of
        reliable LLM-powered applications, and AI-enhanced educational
        technology.
      </p>
      <div className="border-t-2 border-dotted border-back-subtle"></div>
      <PublicationList selectedOnly={false} />
    </Fragment>
  )
}
