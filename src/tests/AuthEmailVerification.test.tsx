// Third party
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { render, screen, act } from '@testing-library/react'

// Local
import AuthEmailVerification from '../routes/AuthEmailVerification'

test('renders email verify page elements', () => {
  act(() => {
    render(
      <MemoryRouter initialEntries={['/auth/email/verification']}>
        <Routes>
          <Route
            path='/auth/email/verification'
            element={<AuthEmailVerification />}
          />
        </Routes>
      </MemoryRouter>
    )
  })

  const homeLink = screen.getByRole('link', { name: 'Login' })
  expect(homeLink).toHaveAttribute('href', '/auth/login')
})
