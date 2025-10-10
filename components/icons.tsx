import classNames from 'classnames'

interface IconProps {
  className?: string
}

export const Sun20 = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      role="img"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  )
}

export const Moon20 = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      role="img"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  )
}

export const MailAt24 = ({ className }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={classNames('w-6 h-6', className)}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      role="img"
    >
      <title>Email Address</title>
      <path stroke="none" d="M0 0h24v24H0z"></path>
      <circle cx="12" cy="12" r="4"></circle>
      <path d="M16 12v1.5a2.5 2.5 0 005 0V12a9 9 0 10-5.5 8.28"></path>
    </svg>
  )
}

export const Twitter24 = ({ className }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={classNames('w-5 h-5', className)}
      fill="currentColor"
      viewBox="0 0 24 24"
      role="img"
      strokeWidth="1"
    >
      <title>X</title>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

export const GitHub24 = ({ className }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={classNames('w-6 h-6', className)}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      role="img"
    >
      <title>GitHub</title>
      <path stroke="none" d="M0 0h24v24H0z"></path>
      <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 00-1.3-3.2 4.2 4.2 0 00-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 00-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 00-.1 3.2A4.6 4.6 0 004 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"></path>
    </svg>
  )
}

export const GoogleScholar24 = ({ className }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={classNames('w-6 h-6', className)}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="0.3"
      viewBox="0 0 20 20"
      role="img"
    >
      <title>Google Scholar</title>
      <path stroke="none" d="M0 0h24v24H0z"></path>
      <path
        d="M8.5063 3.401C9.4313 2.86993 10.5687 2.86994 11.4937 3.401L18.749 7.56641C18.9042 7.65557 19 7.82096 19 8.00003C19 8.1791 18.9042 8.34449 18.7489 8.43365L16 10.0118V14.5C16 14.6326 15.9473 14.7598 15.8536 14.8536L15.852 14.8551L15.8496 14.8574L15.8428 14.8642L15.8201 14.8859C15.801 14.9039 15.7741 14.9288 15.7394 14.9596C15.6701 15.0213 15.5696 15.1067 15.4389 15.2079C15.1777 15.41 14.7948 15.6761 14.2978 15.9412C13.3033 16.4716 11.8479 17 10 17C8.15211 17 6.69675 16.4716 5.70221 15.9412C5.20518 15.6761 4.82226 15.41 4.5611 15.2079C4.43043 15.1067 4.32994 15.0213 4.26059 14.9596C4.22591 14.9288 4.19898 14.9039 4.17992 14.8859C4.07226 14.782 4 14.6538 4 14.5V10.0118L2 8.86363L2 13.5C2 13.7761 1.77614 14 1.5 14C1.22386 14 1 13.7761 1 13.5V8.00003C1 7.81065 1.10529 7.64583 1.26052 7.56098L8.5063 3.401ZM11.4937 12.599C10.5687 13.13 9.43131 13.13 8.50632 12.599L5 10.586V14.2772C5.04686 14.3168 5.10469 14.364 5.17327 14.4171C5.39649 14.59 5.73232 14.8239 6.17279 15.0588C7.05325 15.5284 8.34789 16 10 16C11.6521 16 12.9467 15.5284 13.8272 15.0588C14.2677 14.8239 14.6035 14.59 14.8267 14.4171C14.8953 14.364 14.9531 14.3168 15 14.2772V10.586L11.4937 12.599ZM10.9958 4.26823C10.3791 3.91419 9.62086 3.91419 9.0042 4.26823L2.50423 8.00002L9.00421 11.7317C9.62087 12.0858 10.3791 12.0858 10.9958 11.7317L17.4958 8.00002L10.9958 4.26823Z"
        fill="currentColor"
      />
    </svg>
  )
}

export const LinkedIn24 = ({ className }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={classNames('w-7 h-7', className)}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="0.6"
      viewBox="0 1 32 32"
      role="img"
    >
      <title>LinkedIn</title>
      <path stroke="none" d="M0 0h24v24H0z"></path>
      <path
        d="M0.92 11.32c-0.48 0-0.84 0.36-0.84 0.84v11.76c0 0.48 0.36 0.84 0.84 0.84s0.84-0.36 0.84-0.84v-11.76c0-0.48-0.36-0.84-0.84-0.84zM1.84 8.16c0 0.508-0.412 0.92-0.92 0.92s-0.92-0.412-0.92-0.92c0-0.508 0.412-0.92 0.92-0.92s0.92 0.412 0.92 0.92zM15.28 11.68c-1.8-0.96-4.44-0.28-8.040 2v-1.52c0-0.48-0.36-0.84-0.84-0.84s-0.84 0.36-0.84 0.84v11.76c0 0.48 0.36 0.84 0.84 0.84s0.84-0.36 0.84-0.84v-8.24c4.52-3.12 6.48-2.92 7.24-2.52 1.040 0.56 1.040 2.080 1.040 2.080v8.68c0 0.48 0.36 0.84 0.84 0.84s0.84-0.36 0.84-0.84v-8.64c0-0.12 0-2.56-1.92-3.6z"
        fill="currentColor"
      />
    </svg>
  )
}

export const Spotify16 = () => {
  return (
    <svg
      className="w-4 h-4"
      viewBox="0 0 16 16"
      fill="#1ED760"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
    >
      <title>Spotify icon</title>
      <path d="M8 0C3.6 0 0 3.6 0 8C0 12.4 3.6 16 8 16C12.4 16 16 12.4 16 8C16 3.6 12.4 0 8 0ZM11.7 11.5C11.6 11.7 11.2 11.8 11 11.7C8.9 10.5 6.3 10.2 4 10.9C3.7 10.9 3.5 10.8 3.4 10.5C3.4 10.3 3.5 10 3.8 9.9C6.4 9.1 9.2 9.5 11.6 10.8C11.7 11 11.8 11.3 11.7 11.5ZM12.7 9.4C12.6 9.4 12.6 9.4 12.7 9.4C12.5 9.7 12.1 9.8 11.8 9.6C9.4 8.2 6.5 7.9 3.8 8.7C3.5 8.8 3.1 8.6 3 8.3C2.9 7.9 3.1 7.6 3.4 7.4C6.4 6.5 9.7 6.9 12.4 8.5C12.7 8.7 12.8 9.1 12.7 9.4ZM12.7 7.1C10.1 5.6 5.9 5.4 3.4 6.2C3 6.3 2.6 6.1 2.5 5.7C2.4 5.3 2.6 4.9 3 4.7C5.8 3.9 10.5 4 13.5 5.8C13.9 6 14 6.5 13.8 6.8C13.5 7.2 13.1 7.3 12.7 7.1Z" />
    </svg>
  )
}

export const Letterboxd16 = () => {
  return (
    <svg
      className="w-4 h-4"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 500 500"
      role="img"
    >
      <title>Letterboxd icon</title>
      <defs>
        <path
          id="path-1"
          d="M250 500C111.929 500 0 388.071 0 250S111.929 0 250 0s250 111.929 250 250-111.929 250-250 250z"
        ></path>
        <radialGradient
          id="radialGradient-3"
          cx="50%"
          cy="50%"
          r="50%"
          fx="50%"
          fy="50%"
        >
          <stop offset="0%" stopColor="#FF8000"></stop>
          <stop offset="37.691%" stopColor="#FF8000"></stop>
          <stop offset="100%" stopColor="#FF8000" stopOpacity="0"></stop>
        </radialGradient>
        <filter
          id="filter-4"
          width="139.2%"
          height="139.2%"
          x="-19.6%"
          y="-19.6%"
          filterUnits="objectBoundingBox"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="50"></feGaussianBlur>
        </filter>
        <radialGradient
          id="radialGradient-5"
          cx="50%"
          cy="50%"
          r="50%"
          fx="50%"
          fy="50%"
        >
          <stop offset="0%" stopColor="#40BCF4"></stop>
          <stop offset="49.309%" stopColor="#40BCF4"></stop>
          <stop offset="100%" stopColor="#40BCF4" stopOpacity="0"></stop>
        </radialGradient>
        <filter
          id="filter-6"
          width="139.2%"
          height="139.2%"
          x="-19.6%"
          y="-19.6%"
          filterUnits="objectBoundingBox"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation="50"></feGaussianBlur>
        </filter>
      </defs>
      <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <g>
          <mask id="mask-2" fill="#fff">
            <use xlinkHref="#path-1"></use>
          </mask>
          <use fill="#0EDF52" fillRule="nonzero" xlinkHref="#path-1"></use>
          <path
            fill="url(#radialGradient-3)"
            fillRule="nonzero"
            d="M26.5 752C-184.749 752-356 580.749-356 369.5S-184.749-13 26.5-13 409 158.251 409 369.5 237.749 752 26.5 752z"
            filter="url(#filter-4)"
            mask="url(#mask-2)"
          ></path>
          <path
            fill="url(#radialGradient-5)"
            fillRule="nonzero"
            d="M431.5 820C220.251 820 49 648.749 49 437.5S220.251 55 431.5 55 814 226.251 814 437.5 642.749 820 431.5 820z"
            filter="url(#filter-6)"
            mask="url(#mask-2)"
          ></path>
          <path
            fill="#FFF"
            fillRule="nonzero"
            d="M165 103L165 383 354.15639 383 354.15639 313.100855 237.72411 313.100855 237.72411 103z"
            mask="url(#mask-2)"
          ></path>
        </g>
      </g>
    </svg>
  )
}

export const Steam16 = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4 text-fore-subtle"
      fill="currentColor"
      viewBox="0 0 16 16"
      role="img"
    >
      <title>Steam icon</title>
      <g clipPath="url(#clip0)">
        <path d="M7.987 0C3.787 0 .341 3.24.016 7.357L4.302 9.13a2.26 2.26 0 011.276-.393c.042 0 .083.003.125.003l1.906-2.76v-.04a3.017 3.017 0 013.016-3.015 3.022 3.022 0 013.018 3.018 3.02 3.02 0 01-3.018 3.016h-.068l-2.719 1.94c0 .036.003.07.003.107a2.26 2.26 0 01-2.26 2.262 2.277 2.277 0 01-2.222-1.817L.292 10.18A7.998 7.998 0 0015.985 8c0-4.419-3.581-8-7.998-8zM5.026 12.14l-.982-.406c.18.376.493.672.878.834a1.702 1.702 0 002.352-1.566 1.69 1.69 0 00-.128-.65 1.68 1.68 0 00-.92-.922 1.69 1.69 0 00-1.25-.021l1.013.419a1.254 1.254 0 01-.963 2.313zm7.61-6.203a2.012 2.012 0 00-2.008-2.01 2.01 2.01 0 101.42 3.431 2.01 2.01 0 00.588-1.42zm-3.513-.002c0-.836.674-1.51 1.508-1.51.833 0 1.512.674 1.512 1.51a1.51 1.51 0 11-3.021 0z"></path>
      </g>
    </svg>
  )
}

export const Notion16 = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4 text-primary"
      fill="currentColor"
      viewBox="0 0 16 16"
      role="img"
    >
      <title>Notion icon</title>
      <g clipPath="url(#clip0)">
        <path d="M2.974 2.805c.495.403.683.375 1.617.312l8.81-.528c.188 0 .031-.188-.031-.22l-1.464-1.057c-.279-.219-.654-.466-1.37-.406l-8.528.625c-.313.028-.375.185-.25.31l1.216.964zm.529 2.055v9.268c0 .497.247.685.807.653l9.683-.56c.56-.031.624-.372.624-.778V4.237c0-.406-.156-.622-.5-.59l-10.116.59c-.375.032-.498.216-.498.62v.003zm9.557.494c.063.282 0 .56-.282.594l-.466.094v6.841c-.406.22-.778.344-1.088.344-.5 0-.625-.156-.998-.622L7.175 7.813v4.636l.966.219s0 .56-.779.56l-2.148.125c-.063-.125 0-.438.219-.498l.56-.156V6.57l-.779-.062c-.062-.282.094-.685.529-.716l2.304-.157 3.177 4.854V6.196l-.81-.094c-.063-.341.185-.591.498-.62l2.148-.128zM1.292.69l8.872-.653c1.088-.094 1.37-.032 2.055.466l2.833 1.992c.466.34.623.435.623.807v10.92c0 .685-.25 1.088-1.12 1.15l-10.308.623c-.651.032-.963-.062-1.307-.497L.854 12.789c-.373-.497-.529-.87-.529-1.304V1.779c0-.56.25-1.026.966-1.088z"></path>
      </g>
    </svg>
  )
}

export const Project24 = ({ className }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={classNames('w-6 h-6 text-accent', className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
      />
    </svg>
  )
}

export const Blog24 = ({ className }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={classNames('w-6 h-6 text-accent', className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
      />
    </svg>
  )
}

export const About24 = ({ className }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={classNames('w-6 h-6 text-accent', className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}

export const News24 = ({ className }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={classNames('w-6 h-6 text-accent', className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      role="img"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13,13H11a1,1,0,0,1-1-1V4a1,1,0,0,1,1-1h2a1,1,0,0,1,1,1v8A1,1,0,0,1,13,13Zm1,6a2,2,0,1,0-2,2A2,2,0,0,0,14,19Z"
      />
    </svg>
  )
}

export const Papers24 = ({ className }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={classNames('w-6 h-6 text-accent', className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      role="img"
    >
      <g
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={0.75}
        fill="currentColor"
      >
        <path d="M18 6H7V5h11zm0 2H7v1h11zm0 3H7v1h11zm-4 4h4v-1h-4zm0 3h3v-1h-3zm-2 2H7v-6h5zm-1-5H8v4h3zm10 8H4V2h17zM20 3H5v19h15z" />
      </g>
    </svg>
  )
}

export const Top24 = ({ className }: IconProps) => {
  return (
    <svg
      className={classNames('w-6 h-6 text-accent', className)}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 15l7-7 7 7"
      />
    </svg>
  )
}

export const External24 = ({ className }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={classNames('w-6 h-6', className)}
      fill="none"
      viewBox="0 0 24 24"
      role="img"
    >
      <g
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      >
        <path d="M10.0002 5H8.2002C7.08009 5 6.51962 5 6.0918 5.21799C5.71547 5.40973 5.40973 5.71547 5.21799 6.0918C5 6.51962 5 7.08009 5 8.2002V15.8002C5 16.9203 5 17.4801 5.21799 17.9079C5.40973 18.2842 5.71547 18.5905 6.0918 18.7822C6.5192 19 7.07899 19 8.19691 19H15.8031C16.921 19 17.48 19 17.9074 18.7822C18.2837 18.5905 18.5905 18.2839 18.7822 17.9076C19 17.4802 19 16.921 19 15.8031V14M20 9V4M20 4H15M20 4L13 11" />
      </g>
    </svg>
  )
}
