import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import { App } from './App'
import { store } from './app/store'

main()

async function main() {
  if (import.meta.env.MODE === '-development') {
    const { worker } = await import('./test/mocks/browser')

    await worker.start()
  }

  const rootNode = document.getElementById('root')!

  createRoot(rootNode).render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>,
  )
}
