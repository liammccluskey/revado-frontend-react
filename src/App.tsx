import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthProvider } from './providers/AuthProvider'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Home } from './pages/Home'

const router = createBrowserRouter([
   {
    path: '',
    element: <Login />
  },
  {
    path: '/',
    element: <Login />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/home',
    element: <Home />
  },
])

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
