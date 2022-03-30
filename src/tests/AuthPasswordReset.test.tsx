// Third party
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { render, act } from '@testing-library/react'

// Local
import AuthPasswordReset from '../routes/AuthPasswordReset'

test('renders password reset page elements', () => {
  act(() => {
    render(
      <MemoryRouter initialEntries={['/auth/password/reset']}>
        <Routes>
          <Route path='/auth/password/reset' element={<AuthPasswordReset />} />
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
