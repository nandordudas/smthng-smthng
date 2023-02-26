import { useCallback, useEffect, useState } from 'react'
import { DefaultLayout } from '~/layouts/default'

const DataJson = ({ data }: { data: Record<string, any> | null }) => {
  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}

export const HomePage = () => {
  const [data, setData] = useState<null | Record<string, unknown>>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [ws, setWs] = useState<null | WebSocket>(null)

  const connect = useCallback(() => {
    if (ws)
      return

    const url = new URL('ws://192.168.0.6:3333/ws')

    if (data?.id)
      url.searchParams.append('id', data.id)

    const _ws = new WebSocket(url)

    const timer = setInterval(() => {
      if (_ws.readyState !== WebSocket.OPEN)
        return

      clearInterval(timer)
      setWs(_ => _ws)
    }, 10)
  }, [ws, setWs])

  const disconnect = useCallback((retry = false) => {
    if (!isOpen || !ws)
      return

    ws.close()

    if (!retry)
      return

    if (isOpen || ws.readyState !== 3)
      return

    setTimeout(() => connect, 1_000)
  }, [isOpen, ws])

  const onClick = useCallback(() => {
    if (!ws || ws.readyState === 3)
      return

    ws.send(JSON.stringify({ type: 'event', value: 'test' }))
  }, [ws])

  useEffect(() => {
    if (!ws) {
      connect()

      return
    }

    ws.addEventListener('open', () => setIsOpen(true))
    ws.addEventListener('close', () => {
      setTimeout(() => setWs(null), 3_000)
    })
    ws.addEventListener('error', (_event) => {
      setData(_state => 'error')
      disconnect(true)
    })

    ws.addEventListener('message', (event) => {
      setData(_state => JSON.parse(event.data))
    })

    return () => {
      ws?.close()
    }
  }, [ws])

  return (
    <DefaultLayout data-page="home">
      <div onClick={onClick}>home page</div>
      {/* <PollingToggles /> */}
      <DataJson data={data} />
    </DefaultLayout>
  )
}
