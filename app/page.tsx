import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import { Blob } from '../components/atoms'
import {
  MailAt24,
  GitHub24,
  Twitter24,
  Blog24,
  GoogleScholar24,
  LinkedIn24,
  News24,
  Papers24,
  Project24,
} from '../components/icons'
import { FileText } from 'lucide-react'
import PostList from 'components/postList'
import NewsList from 'components/newsList'
import PublicationList from 'components/publicationList'
import ProjectList from 'components/projectList'
import Introduction from '../components/introduction'
import avatar from '../public/images/profile-img.jpeg'
import { components as mdx } from '../components/mdxComponents'
import { wenKai } from './fonts'

export default async function Page() {
  return (
    <div>
      {/* Introduction Section */}
      <div className="">
        <div className="flex flex-col-reverse items-center lg:flex-row lg:justify-between lg:space-x-6">
          {/* Introduction  */}
          <div>
            <p className="max-w-3xl mt-12 mb-2 text-3xl font-semibold lg:mt-0 sm:text-4xl sm:text-left md:text-left lg:text-left">
              Hi there, I'm Zexin Xu (
              <span className={wenKai.className}>徐泽鑫</span>
              )! 👋
            </p>
            <div className="text-sm mb-4">
              <mdx.code showLineNumbers={false} fileName={''} id="">
                💡 My name is pronounced as "Zeh-Shin She", and I also go by{' '}
                <b>Jason</b>.
              </mdx.code>
            </div>
            <div className="relative text-primary">
              <Introduction />
            </div>
          </div>
          {/* Avatar  */}
          <div>
            <div className="relative">
              {/* <Blob /> */}
              <div className="flex items-center justify-center">
                <div className="relative">
                  {/* White border with shadow */}
                  <div className="w-36 h-36 md:w-44 md:h-44 lg:w-60 lg:h-60 bg-white rounded-full avatar-white-border"></div>
                  {/* Avatar image */}
                  <div className="absolute inset-1 w-34 h-34 overflow-hidden rounded-full md:h-42 md:w-42 lg:h-58 lg:w-58 pointer-events-none">
                    <Image
                      src={avatar}
                      alt="My avatar"
                      width={256}
                      height={256}
                      quality={100}
                      priority={true}
                      placeholder="blur"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Social Links  */}
            <div className="mt-5">
              <div className="flex flex-row items-center space-x-5 justify-center">
                <span className="scale-125">
                  <a
                    href="mailto:zexin.xu@utdallas.edu"
                    aria-label="Email zexin.xu@utdallas.edu"
                    title="Email"
                    className="focus:text-accent"
                  >
                    <MailAt24 className="transition-transform ease-in-out hover:-translate-y-1 hover:text-accent" />
                  </a>
                </span>
                <span className="scale-125">
                  <a
                    href="https://scholar.google.com/citations?user=NvnoD1kAAAAJ&hl=en"
                    aria-label="Visit Google Scholar Profile"
                    title="Visit Google Scholar Profile"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus:text-accent"
                  >
                    <GoogleScholar24 className="transition-transform ease-in-out hover:-translate-y-1 hover:text-accent" />
                  </a>
                </span>
                <span className="scale-125">
                  <a
                    href="https://github.com/asonjay"
                    aria-label="Visit GitHub profile"
                    title="Visit GitHub profile"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus:text-accent"
                  >
                    <GitHub24 className="transition-transform ease-in-out hover:-translate-y-1 hover:text-accent" />
                  </a>
                </span>
                <span className="scale-125">
                  <a
                    href="https://x.com/zexin_jason_xu"
                    aria-label="Visit Twitter profile"
                    title="Visit Twitter profile"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus:text-accent"
                  >
                    <Twitter24 className="transition-transform ease-in-out hover:-translate-y-1 hover:text-accent" />
                  </a>
                </span>
                <span className="scale-125">
                  <a
                    href="https://www.linkedin.com/in/zexin-xu/"
                    aria-label="Visit LinkedIn Profile"
                    title="Visit LinkedIn Profile"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus:text-accent"
                  >
                    <LinkedIn24 className="transition-transform ease-in-out hover:-translate-y-1 hover:text-accent" />
                  </a>
                </span>
              </div>
            </div>
            {/* CV  */}
            <div className="mx-1 mt-2 flex items-center justify-center">
              <Link
                href="https://docs.google.com/viewer?url=https://raw.githubusercontent.com/asonjay/asonjay.github.io/master/public/cv/Zexin_Xu_CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-2 px-4 py-2 transition-all duration-200"
              >
                <FileText
                  size={26}
                  className="text-fore-subtle transition-colors duration-200 group-hover:text-accent"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-fore-primary transition-colors duration-200 group-hover:text-accent mb-[-2px]">
                    Curriculum Vitae
                  </span>
                  <span className="text-xs text-fore-subtle">
                    Last Updated: 11/18/2025
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* News Section */}
      <div className="mt-12">
        <div className="flex items-center space-x-3">
          <span className="p-3 rounded-full bg-back-subtle">
            <News24 />
          </span>
          <span className="mt-3 mb-2 uppercase tracking-[.2em] text-accent">
            <span className="text-xl">N</span>EWS
          </span>
        </div>
        <NewsList />
      </div>

      {/* Publications Section */}
      <div className="mt-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="p-3 rounded-full bg-back-subtle">
              <Papers24 />
            </span>
            <span className="mt-3 mb-2 uppercase tracking-[.2em] text-accent">
              <span className="text-xl">S</span>ELECTED{' '}
              <span className="text-xl">P</span>UBLICATIONS
            </span>
          </div>
          <Link
            href="/publications"
            className="flex items-center space-x-2 text-fore-subtle hover:text-accent transition-transform ease-in-out hover:translate-x-1"
          >
            <span className="text-xs uppercase tracking-[.2em]">
              All Publications
            </span>
            <span>→</span>
          </Link>
        </div>
        <PublicationList selectedOnly={true} />
      </div>

      {/* Projects Section */}
      <div className="mt-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="p-3 rounded-full bg-back-subtle">
              <Project24 />
            </span>
            <span className="mt-3 mb-2 uppercase tracking-[.2em] text-accent">
              <span className="text-xl">S</span>ELECTED{' '}
              <span className="text-xl">P</span>ROJECTS
            </span>
          </div>
          <Link
            href="/projects"
            className="flex items-center space-x-2 text-fore-subtle hover:text-accent transition-transform ease-in-out hover:translate-x-1"
          >
            <span className="text-xs uppercase tracking-[.2em]">
              All Projects
            </span>
            <span>→</span>
          </Link>
        </div>
        <ProjectList selectedOnly={true} />
      </div>

      {/* Blogs Section */}
      <div className="mt-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="p-3 rounded-full bg-back-subtle">
              <Blog24 />
            </span>
            <span className="mt-3 mb-2 uppercase tracking-[.2em] text-accent">
              <span className="text-xl">B</span>LOGS
            </span>
          </div>
          <Link
            href="/blog"
            className="flex items-center space-x-2 text-fore-subtle hover:text-accent transition-transform ease-in-out hover:translate-x-1"
          >
            <span className="text-xs uppercase tracking-[.2em]">
              All Blog Posts
            </span>
            <span>→</span>
          </Link>
        </div>
        <PostList />
      </div>
      {/* <div className="flex items-center mt-32 mb-2 space-x-3">
        <span className="p-3 rounded-full bg-back-subtle">
          <Project24 />
        </span>
        <span className="mt-3 mb-2 uppercase tracking-[.2em] text-accent">
          PROJECTS
        </span>
      </div> */}
      {/* <ProjectList bOpenSourceOnly={true} /> */}
      {/* <Contact /> */}
    </div>
  )
}
