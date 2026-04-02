import classNames from 'classnames'
import Link from 'next/link'
import {
  AnchorHTMLAttributes,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'

export const NavLink = ({ to, title = 'Link', selected = false, ...props }) => {
  return (
    <Link
      {...props}
      href={to}
      className={classNames(
        'font-mono-label text-xs tracking-widest uppercase transition-colors duration-200',
        {
          'text-accent': selected,
          'text-fore-subtle hover:text-fore-primary': !selected,
        }
      )}
    >
      {title}
    </Link>
  )
}

export const ExtLink = ({
  children,
  link,
}: {
  children: React.ReactNode
  link: string
}) => {
  return (
    <a
      href={link}
      className="text-accent hover:underline transition-colors"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  )
}

interface ButtonProps {
  children: React.ReactNode
  className?: string
  link?: string
}

export const Button = ({
  children,
  className,
  link,
  ...props
}: ButtonProps & AnchorHTMLAttributes<HTMLAnchorElement>) => {
  return (
    <a
      {...props}
      className={classNames(
        'inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-accent to-accent-secondary text-back-primary font-heading font-bold hover:opacity-90 transition-opacity',
        className
      )}
      href={link}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  )
}

export const Blob = () => {
  return null // Removed - replaced by ambient orb background
}

export const Input = ({
  labelText,
  name,
  ...props
}: { labelText: string } & InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <div className="group">
      <label
        className="font-mono-label text-xs uppercase tracking-wider text-fore-subtle group-hover:text-accent transition-colors"
        htmlFor={name}
      >
        {labelText}
      </label>
      <input
        className="block w-full p-3 mt-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-bg)] backdrop-blur-sm outline-none focus:border-accent text-fore-primary disabled:opacity-50 transition-colors"
        name={name}
        {...props}
      />
    </div>
  )
}

export const TextArea = ({
  labelText,
  name,
  ...props
}: { labelText: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  return (
    <div className="group">
      <label
        className="font-mono-label text-xs uppercase tracking-wider text-fore-subtle group-hover:text-accent transition-colors"
        htmlFor={name}
      >
        {labelText}
      </label>
      <textarea
        className="block w-full p-3 mt-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-panel-bg)] backdrop-blur-sm outline-none focus:border-accent text-fore-primary disabled:opacity-50 transition-colors"
        style={{ minHeight: '80px' }}
        name={name}
        {...props}
      />
    </div>
  )
}
