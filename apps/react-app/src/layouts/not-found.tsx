import type { PropsWithChildren } from 'react'

import { Container } from '~/components/base/container'

export const NotFoundLayout = ({ children, ...htmlProps }: PropsWithChildren) => {
  return (
    <Container data-layout="not-found" {...htmlProps}>
      {children}
    </Container>
  )
}
