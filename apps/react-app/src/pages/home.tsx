import { useState } from 'react'
import { DefaultLayout } from '~/layouts/default'

const DataJson = ({ data }: { data: Record<string, any> }) => {
  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}

const ws: WebSocket = new WebSocket('ws://localhost:3333/ws')

export const HomePage = () => {
  const [data, setData] = useState({})

  ws.onmessage = function (event) {
    setData(_state => JSON.parse(event.data))
  }

  return (
    <DefaultLayout data-page="home">
      <div>home page</div>
      {/* <PollingToggles /> */}
      <DataJson data={data} />
    </DefaultLayout>
  )
}
