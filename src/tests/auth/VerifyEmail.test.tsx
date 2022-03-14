// Third party
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { render, screen, act } from '@testing-library/react'

// Local
import VerifyEmail from '../../routes/auth/VerifyEmail'

test('renders verify email page elements', () => {
  act(() => {
    render(
      <MemoryRouter initialEntries={['/auth/verify-email']}>
        <Routes>
          <Route path='/auth/verify-email' element={<VerifyEmail />} />
        </Routes>
      </MemoryRouter>
    )
  })

  const homeLink = screen.getByRole('link', { name: 'Home' })
  expect(homeLink).toHaveAttribute('href', '/')
})
