// Third party
import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Local
import './style/index.css'
import AuthDelete from './routes/AuthDelete'
import AuthEmailVerification from './routes/AuthEmailVerification'
import AuthLogin from './routes/AuthLogin'
import AuthPasswordReset from './routes/AuthPasswordReset'
import AuthPasswordResetRequest from './routes/AuthPasswordResetRequest'
import AuthRegister from './routes/AuthRegister'
import Home from './routes/Home'
import PostAdd from './routes/PostAdd'
import PostEdit from './routes/PostEdit'
import PostView from './routes/PostView'
import ProfileEdit from './routes/ProfileEdit'
import ProfileView from './routes/ProfileView'

render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/user/view/:userID' element={<ProfileView />} />
        <Route path='/user/edit/:userID' element={<ProfileEdit />} />
        <Route path='/post/add' element={<PostAdd />} />
        <Route path='/post/edit/:postID' element={<PostEdit />} />
        <Route path='/post/view/:postID' element={<PostView />} />
        <Route path='/auth/delete' element={<AuthDelete />} />
        <Route path='/auth/login' element={<AuthLogin />} />
        <Route path='/auth/register' element={<AuthRegister />} />
        <Route
          path='/auth/password/reset/request'
          element={<AuthPasswordResetRequest />}
        />
        <Route path='/auth/password/reset' element={<AuthPasswordReset />} />
        <Route
          path='/auth/email/verification'
          element={<AuthEmailVerification />}
        />
        <Route path='/health' element={'{"status":"ok"}'} />
        <Route path='*' element={'Route not found'} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)
