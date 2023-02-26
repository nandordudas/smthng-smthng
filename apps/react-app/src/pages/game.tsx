import { useEffect } from 'react'

import { DefaultLayout } from '~/layouts/default'
import GameWorker from '~/features/game/game.worker?worker'

const useGameWorker = () => {
  const { addEventListener, postMessage } = new GameWorker()

  return { on: addEventListener, send: postMessage }
}

export const GamePage = () => {
  const { on, send } = useGameWorker()

  useEffect(() => {
    on('error', console.error)

    on('message', (event) => {
      // eslint-disable-next-line no-console
      console.log('[GamePage]: message', event)
    })
  }, [])

  const onClick = () => {
    send('get memory usage')
  }

  return (
    <DefaultLayout data-page="game">
      <div>
        <h1>game</h1>
        <button onClick={onClick}>get memory usage</button>
      </div>
    </DefaultLayout>
  )
}
