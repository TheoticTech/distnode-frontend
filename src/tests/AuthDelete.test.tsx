// Third party
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { render, act } from '@testing-library/react'

// Local
import AuthDelete from '../routes/AuthDelete'

test('renders delete page elements', () => {
  act(() => {
    render(
      <MemoryRouter initialEntries={['/auth/delete']}>
        <Routes>
          <Route path='/auth/delete' element={<AuthDelete />} />
        </Routes>
      </MemoryRouter>
    )
  })

  const emailField = document.querySelector('#email')
  expect(emailField).toBeInTheDocument()

  const passwordField = document.querySelector('#password')
  expect(passwordField).toBeInTheDocument()
})
