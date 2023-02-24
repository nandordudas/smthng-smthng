import type { DetailedHTMLProps, HTMLAttributes } from 'react'

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

export const Container = ({ children, ...htmlProps }: Props) => (
  <div className="container mx-auto" {...htmlProps}>
    {children}
  </div>
)
