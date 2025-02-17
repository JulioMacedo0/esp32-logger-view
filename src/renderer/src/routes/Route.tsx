import { Home } from '@renderer/screens/Home/Home'

import { BrowserRouter, Routes, Route } from 'react-router'

export function Router(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}
