'use client'

import { useAnalyticsEvent } from '../hooks/useAnalytics'
import { ExtLink, Button } from './atoms'
import { Top24 } from '../components/icons'

export function Contact() {
  const { trackCustomEvent } = useAnalyticsEvent()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="mt-32 full-width-container bg-back-secondary">
      {/* Gradient overlay - full width */}
      <div className="w-full">
        <div
          className="h-16 pointer-events-none noise-bg"
          style={{
            background:
              'linear-gradient(to bottom, var(--color-back-primary), var(--color-back-secondary))',
          }}
        ></div>
      </div>

      <div className="container max-w-screen-lg pt-8 mx-auto px-5 md:px-20">
        {/* <h1 className="text-3xl font-semibold text-center">
          Get in touch{' '}
          <span role="img" aria-label="wave">
            🤝
          </span>
        </h1> */}
        {/* Get in touch */}
        <div className="flex justify-center mx-auto">
          <Button
            className="px-8"
            link="mailto:zexin.xu@utdallas.edu"
            onClick={() => {
              trackCustomEvent({ eventName: 'click-contact' })
            }}
          >
            <span className="text-2xl font-semibold text-back-secondary">
              Get in touch{' '}
              <span role="img" aria-label="wave">
                🤝
              </span>
            </span>
          </Button>
        </div>
        <p className="text-md mt-4 text-center text-fore-secondary">
          Feel free to email me about anything. I am happy to chat and discuss
          potential collaborations!
        </p>
        {/* <script
          type="text/javascript"
          id="clstr_globe"
          src="//clustrmaps.com/globe.js?d=zs9DWuttPHf4Vx0N4W8aSfy9VR-bDC44GUKCEWvhVrE"
        ></script> */}
        {/* <p className="text-md px-4 mt-1 text-center text-fore-secondary">
          You can also reach me around the web:{' '}
          <ExtLink link="https://github.com/asonjay">GitHub</ExtLink>,{' '}
          <ExtLink link="https://twitter.com/zexin_jason_xu">Twitter</ExtLink>,{' '}
          <ExtLink link="https://www.linkedin.com/in/zexin-xu/">
            LinkedIn
          </ExtLink>
        </p> */}

        {/* Back to top */}
        <div className="flex justify-center mt-6">
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 text-md font-medium group"
            aria-label="Scroll to top"
          >
            <Top24 className="animate-bounce-slow mt-2" />
            <span className="text-lg text-fore-subtle hover:text-accent transition-colors">
              Back to top
            </span>
            <Top24 className="animate-bounce-slow mt-2" />
          </button>
        </div>
      </div>
    </div>
  )
}
