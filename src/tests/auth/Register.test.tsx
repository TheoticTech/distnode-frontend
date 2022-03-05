// Third party
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { render, act } from '@testing-library/react'

// Local
import Register from '../../routes/auth/Register'

test('renders register page elements', () => {
  act(() => {
    render(
      <MemoryRouter initialEntries={['/auth/register']}>
        <Routes>
          <Route path='/auth/register' element={<Register />} />
        </Routes>
      </MemoryRouter>
    )
  })

  const firstNameField = document.querySelector('#firstName')
  expect(firstNameField).toBeInTheDocument()

  const lastNameField = document.querySelector('#lastName')
  expect(lastNameField).toBeInTheDocument()

  const usernameField = document.querySelector('#username')
  expect(usernameField).toBeInTheDocument()

  const emailField = document.querySelector('#email')
  expect(emailField).toBeInTheDocument()

  const passwordField = document.querySelector('#password')
  expect(passwordField).toBeInTheDocument()

  const passwordConfirmationField = document.querySelector(
    '#password-confirmation'
  )
  expect(passwordConfirmationField).toBeInTheDocument()
})
