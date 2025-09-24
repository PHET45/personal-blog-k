import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Link, useNavigate } from 'react-router-dom'
import React, { useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthContextObject'
import * as yup from 'yup'
import { toast } from 'react-toast'

export const Login = () => {
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const loginSchema = yup.object().shape({
    email: yup.string().email('Email is invalid').required('Email is required'),
    password: yup
      .string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  })

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})
  
    // 1️⃣ Validate form
    try {
      await loginSchema.validate({ email, password }, { abortEarly: false })
    } catch (validationError) {
      if (validationError?.name === 'ValidationError') {
        const newErrors = {}
        validationError.inner?.forEach((ve) => {
          if (ve.path && !newErrors[ve.path]) newErrors[ve.path] = ve.message
        })
        setFieldErrors(newErrors)
      }
      return
    }
  
    // 2️⃣ Try login
    try {
      const res = await login(email, password)
      if (res?.user) {
        // 3️⃣ Success toast
        toast.success('Login successful')
  
        // 4️⃣ Check role and navigate
        const role = res.user.app_metadata?.role || res.user.role
        if (role === 'admin') {
          navigate('/admin/article-management', { replace: true })
        } else {
          navigate('/', { replace: true })
        }
      } else {
        throw new Error('Login failed')
      }
    } catch (err) {
      // 5️⃣ Handle error
      setError(err.message || "Login failed")
      toast.error("Your password is incorrect or this email doesn't exist")
    }
  }
  

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-stone-100">
      <div className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl text-gray-800 mb-2">Log in</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-600">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              className={`bg-white rounded-lg px-4 py-3 h-12 ${
                fieldErrors.email || error
                  ? 'border-red-500 focus-visible:ring-red-500'
                  : 'border-gray-200'
              }`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (fieldErrors.email)
                  setFieldErrors({ ...fieldErrors, email: '' })
              }}
              required
            />
            {fieldErrors.email ? (
              <p className="text-red-500 text-sm">{fieldErrors.email}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-600">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              className={`bg-white rounded-lg px-4 py-3 h-12 ${
                fieldErrors.password || error
                  ? 'border-red-500 focus-visible:ring-red-500'
                  : 'border-gray-200'
              }`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (fieldErrors.password)
                  setFieldErrors({ ...fieldErrors, password: '' })
              }}
              required
            />
            {fieldErrors.password ? (
              <p className="text-red-500 text-sm">{fieldErrors.password}</p>
            ) : null}
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
