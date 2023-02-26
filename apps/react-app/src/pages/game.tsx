import { useEffect, useMemo, useState } from 'react'

import { DefaultLayout } from '~/layouts/default'
import { useGameWorker } from '~/features/game/hooks/use-game-worker'

export const GamePage = () => {
  const [data, setData] = useState(null)
  const { on, send } = useGameWorker()

  useEffect(() => {
    on('error', console.error)
    on('message', event => setData(_ => event.data))
  }, [])

  const JsonData = useMemo(() => () => (
    <pre>
      {JSON.stringify(data, null, 2)}
    </pre>
  ), [data])

  return (
    <DefaultLayout data-page="game">
      <div className="prose">
        <h1>game</h1>
        <button onClick={() => send('get memory usage')}>
          get memory usage
        </button>
        <JsonData />
      </div>
    </DefaultLayout>
  )
}
