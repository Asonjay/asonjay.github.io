import { Fragment } from 'react'
import { SEO } from '@/components/seo'
import { Heading } from '@/components/atoms'
import { Contact } from '@/components/contact'
import { ProjectGrid } from '@/components/projectGrid'

function Projects() {
  return (
    <Fragment>
      <SEO title="Projects" />
      <Heading>Projects</Heading>
      <p className="mb-12 text-fore-subtle">
        Collection of web and game development side projects.
      </p>
      <ProjectGrid />
      <Contact />
    </Fragment>
  )
}

export default Projects
