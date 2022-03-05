// Third party
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { render, act } from '@testing-library/react'

// Local
import Delete from '../../routes/auth/Delete'

test('renders delete page elements', () => {
  act(() => {
    render(
      <MemoryRouter initialEntries={['/auth/delete-user']}>
        <Routes>
          <Route path='/auth/delete-user' element={<Delete />} />
        </Routes>
      </MemoryRouter>
    )
  })

  const emailField = document.querySelector('#email')
  expect(emailField).toBeInTheDocument()

  const passwordField = document.querySelector('#password')
  expect(passwordField).toBeInTheDocument()
})
