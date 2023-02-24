import { Route, Routes } from 'react-router-dom'
import { Suspense } from 'react'

import 'virtual:uno.css'
import './styles/main.css'

import { HomePage } from './pages/home'
import { NotFoundPage } from './pages/not-found'
import PostsManager from './features/posts/PostsManager'

export const App = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/posts/*" element={<PostsManager />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
