import { Home } from '@renderer/screens/Home/Home'

import { HashRouter, Routes, Route } from 'react-router'

export function Router(): JSX.Element {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </HashRouter>
  )
}
