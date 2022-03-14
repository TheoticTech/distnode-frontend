// Third party
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { render, act } from '@testing-library/react'

// Local
import PasswordReset from '../../routes/auth/PasswordReset'

test('renders password reset page elements', () => {
  act(() => {
    render(
      <MemoryRouter initialEntries={['/auth/password-reset']}>
        <Routes>
          <Route path='/auth/password-reset' element={<PasswordReset />} />
        </Routes>
      </MemoryRouter>
    )
  })
  const passwordField = document.querySelector('#password')
  expect(passwordField).toBeInTheDocument()

  const passwordConfirmationField = document.querySelector(
    '#password-confirmation'
  )
  expect(passwordConfirmationField).toBeInTheDocument()
})
