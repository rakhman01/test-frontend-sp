"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Card, CardContent, CardHeader } from "../ui/card"
import { FormInput } from "../ui/form-input"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import http from "@/app/lib/ApiService"
import JwtService from "@/app/lib/JwtService"
import { useRouter } from "next/navigation"
import { useToast } from "../ui/toast"



const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

// ✅ Infer type from schema
type LoginFormData = z.infer<typeof loginSchema>

export default function LoginForm() {
  const navigation = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const {error} = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }
  const onSubmit = async (data: LoginFormData) => {
    setLoading(true)
    try {
      const res = await http.post('/auth/login', data)
      setLoading(false)      
      if (res.status === 200) {
        let data = res.data
        JwtService.saveToken(data.token)
        JwtService.saveAuth(data.role)        
        if (data.role === "User") {
          navigation.push('/')
        } else if (data.role === "Admin") {
          navigation.push('/admin/articles')
        }
      }
    } catch (err: any) {
      setLoading(false)
      console.log(err);
      
      error(err.response.data.error || "Sistem Error. Please try again.")
      console.log(error);
    }
    // handle login logic here
  }


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-sm border-0">
        <CardHeader className="text-center pb-8 pt-12">
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <span className="text-xl font-semibold text-gray-900">LogoIpsum</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-8 pb-12">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-gray-700">
                Username
              </label>
              <FormInput
                id="username"
                type="text"
                placeholder="input username"
                {...register("username")}
                className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username.message}</p>
              )}

            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <FormInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="input password"
                  {...register("password")}
                  className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-12"
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}

                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Loading...
                </>
              ) : (
                "Login"
              )}
            </button>

            <div className="text-center">
              <span className="text-sm text-gray-600">
                {"Don't have an account? "}
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                  onClick={() => navigation.push('/register')}
                >
                  Register
                </button>
              </span>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
