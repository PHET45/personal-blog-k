import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'

import React from 'react'

export const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-stone-100">
            <div className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white shadow-md p-8">
              <div className="text-center mb-8">
                <h1 className="text-4xl text-gray-800 mb-2">Log in</h1>
              </div>
    
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-600">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    className="bg-white border-gray-200 rounded-lg px-4 py-3 h-12"
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
                  />
                </div>
    
                <div className="pt-4">
                  <Button className="w-full bg-gray-800 hover:bg-gray-700 text-white rounded-full py-3 h-12">
                    Log up
                  </Button>
                </div>
    
                <div className="text-center pt-4">
                  <p className="text-gray-600">
                    Don't have any account?{' '}
                    <button className="text-gray-800 underline hover:no-underline">
                      Sign up
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
  )
}
