import GameWorker from '~/features/game/game.worker?worker'

const gameWorker = new GameWorker()

export const useGameWorker = () => ({
  on: gameWorker.addEventListener.bind(gameWorker),
  send: gameWorker.postMessage.bind(gameWorker),
})
