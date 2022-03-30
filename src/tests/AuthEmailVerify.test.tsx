// Third party
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { render, screen, act } from '@testing-library/react'

// Local
import AuthEmailVerify from '../routes/AuthEmailVerify'

test('renders email verify page elements', () => {
  act(() => {
    render(
      <MemoryRouter initialEntries={['/auth/email/verify']}>
        <Routes>
          <Route path='/auth/email/verify' element={<AuthEmailVerify />} />
        </Routes>
      </MemoryRouter>
    )
  })

  const homeLink = screen.getByRole('link', { name: 'Login' })
  expect(homeLink).toHaveAttribute('href', '/auth/login')
})
