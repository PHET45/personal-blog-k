import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Link, useNavigate } from 'react-router-dom'
import React, { useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthContextObject'

export const Login = () => {
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await login(email, password)
      if (res.token) {
        navigate('/profile')
      }
    } catch (err) {
      setError(err.message || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-stone-100">
      <div className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl text-gray-800 mb-2">Log in</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && <p className="text-red-500 text-center">{error}</p>}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-600">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              className="bg-white border-gray-200 rounded-lg px-4 py-3 h-12"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-600">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              className="bg-white border-gray-200 rounded-lg px-4 py-3 h-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full bg-gray-800 hover:bg-gray-700 text-white rounded-full py-3 h-12"
            >
              Log in
            </Button>
          </div>

          <div className="text-center pt-4">
            <p className="text-gray-600">
              Don't have any account?{' '}
              <Link
                className="text-gray-800 underline hover:no-underline"
                to="/register"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
