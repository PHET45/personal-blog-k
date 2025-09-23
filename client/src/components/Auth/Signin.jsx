import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Link, useNavigate } from 'react-router-dom'
import React, { useState } from 'react'
import { AuthService } from '../../services/auth'
import * as yup from 'yup'
import { toast } from 'react-toast'

export const Signup = () => {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const signupSchema = yup.object().shape({
    name: yup
      .string()
      .min(2, 'Name must be at least 2 characters')
      .required('Name is required'),
    username: yup
      .string()
      .min(3, 'Username must be at least 3 characters')
      .required('Username is required'),
    email: yup.string().email('Email is invalid').required('Email is required'),
    password: yup
      .string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  })

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
  
    // 1️⃣ Validate ด้วย Yup
    try {
      await signupSchema.validate(
        { name, username, email, password },
        { abortEarly: false }
      );
    } catch (validationError) {
      if (validationError?.name === 'ValidationError') {
        const newErrors = {};
        validationError.inner?.forEach((ve) => {
          if (ve.path && !newErrors[ve.path]) newErrors[ve.path] = ve.message;
        });
        setFieldErrors(newErrors);
        return;
      }
    }
  
    // 2️⃣ ส่งข้อมูลไป server ผ่าน service
    try {
      const res = await AuthService.register({ name, username, email, password });
  
      // 3️⃣ ถ้า register สำเร็จ
      if (res.user) {
        toast.success('Sign up successful');
        navigate('/login');
        return;
      }
  
      // 4️⃣ ถ้า service return error
      if (res.error) {
        const message = res.error.message || res.error;
        if (message.toLowerCase().includes('already') || message.toLowerCase().includes('duplicate') || message.toLowerCase().includes('email')) {
          const emailError = 'Email is already taken, Please try another email.';
          setFieldErrors({ email: emailError });
          toast.error(emailError);
        } else {
          setError(message);
          toast.error(message);
        }
        return;
      }
  
    } catch (err) {
      // 5️⃣ fallback error
      const message = err.response?.data?.error || err.message || 'Sign up failed';
  
      if (message.toLowerCase().includes('already') || message.toLowerCase().includes('duplicate') || message.toLowerCase().includes('email')) {
        const emailError = 'Email is already taken, Please try another email.';
        setFieldErrors({ email: emailError });
        toast.error(emailError);
      } else {
        setError(message);
        toast.error(message);
      }
    }
  };
  
  

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-stone-100">
      <div className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl text-gray-800 mb-2">Sign up</h1>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          {error && <p className="text-red-500 text-center">{error}</p>}

          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-600">
              Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Name"
              className={`bg-white rounded-lg px-4 py-3 h-12 ${
                fieldErrors.name
                  ? 'border-red-500 focus-visible:ring-red-500'
                  : 'border-gray-200'
              }`}
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                if (fieldErrors.name)
                  setFieldErrors({ ...fieldErrors, name: '' })
              }}
              required
            />
            {fieldErrors.name ? (
              <p className="text-red-500 text-sm">{fieldErrors.name}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="username" className="text-gray-600">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="Username"
              className={`bg-white rounded-lg px-4 py-3 h-12 ${
                fieldErrors.username
                  ? 'border-red-500 focus-visible:ring-red-500'
                  : 'border-gray-200'
              }`}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                if (fieldErrors.username)
                  setFieldErrors({ ...fieldErrors, username: '' })
              }}
              required
            />
            {fieldErrors.username ? (
              <p className="text-red-500 text-sm">{fieldErrors.username}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-600">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              className={`bg-white rounded-lg px-4 py-3 h-12 ${
                fieldErrors.email
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
                fieldErrors.password
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
              Sign up
            </Button>
          </div>

          <div className="text-center pt-4">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link
                className="text-gray-800 underline hover:no-underline"
                to="/login"
              >
                Log in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
