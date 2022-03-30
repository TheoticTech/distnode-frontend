// Third party
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { render, act } from '@testing-library/react'

// Local
import AuthLogin from '../routes/AuthLogin'

test('renders login page elements', () => {
  act(() => {
    render(
      <MemoryRouter initialEntries={['/auth/login']}>
        <Routes>
          <Route path='/auth/login' element={<AuthLogin />} />
        </Routes>
      </MemoryRouter>
    )
  })

  const emailField = document.querySelector('#email')
  expect(emailField).toBeInTheDocument()

  const passwordField = document.querySelector('#password')
  expect(passwordField).toBeInTheDocument()
})
