// Third party
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { render, screen, act } from '@testing-library/react'

// Local
import Home from '../routes/Home'

test('renders home page elements', () => {
  act(() => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path='/' element={<Home />} />
        </Routes>
      </MemoryRouter>
    )
  })

  const navbar = screen.getByTestId('navbar')
  expect(navbar).toBeInTheDocument()
})
