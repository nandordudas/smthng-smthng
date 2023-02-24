import type { PropsWithChildren } from 'react'

import { Container } from '~/components/base/container'

export const DefaultLayout = ({ children, ...htmlProps }: PropsWithChildren) => {
  return (
    <Container data-layout="default" {...htmlProps}>
      {children}
    </Container>
  )
}
