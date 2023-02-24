import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

import { store } from '~/app/store'

export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'

interface RenderOptions {
  route: string
  path?: string
}

export const renderWithProvider = (
  children: ReactElement,
  { route = '/', path = '' }: RenderOptions,
) => {
  if (path) {
    return render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route path={path}>{children}</Route>
          </Routes>
        </MemoryRouter>
      </Provider>,
    )
  }

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        {children}
      </MemoryRouter >
    </Provider>,
  )
}
