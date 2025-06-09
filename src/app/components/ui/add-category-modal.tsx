"use client"

import type React from "react"
import { useState } from "react"
import { z } from "zod"
import { Modal, ModalHeader, ModalBody, ModalFooter } from "./modal"
import { UIButton } from "./ui-button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import http from "@/app/lib/ApiService"
import { useRouter } from "next/navigation"
import { FormInput } from "./form-input"
import { useToast } from "./toast"

interface AddCategoryModalProps {
  isOpen: boolean
  onClose: () => void
}

const createCategory = z.object({
  name: z.string().min(3, "Category field cannot be empty"),
})

type categoryFormData = z.infer<typeof createCategory>
export function AddCategoryModal({ isOpen, onClose }: AddCategoryModalProps) {
  const {error} = useToast()
  const [loading, setLoading] = useState(false)



  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<categoryFormData>({
    resolver: zodResolver(createCategory),
  })

  const handleClose = () => {
    onClose()
  }

  const onSubmit = async (data: categoryFormData) => {
    setLoading(true)
    try {
      const res = await http.post('/categories', data)
      setLoading(false)
      if (res.status === 200) {
        reset()
        onClose()
        // navigation.push('/admin/articles')
      }
    } catch (err: any) {
      setLoading(false)
      error(err.response.data.error || "Sistem Error. Please try again.")
    }
    // handle login logic here
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>
          <h2 className="text-xl font-semibold text-gray-900">Add Category</h2>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Category Name
              </label>
              <FormInput
                id="name"
                type="text"
                placeholder="input name"
                {...register("name")}
                className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.name && (
                <p className="text-sm mt-2 text-red-500">{errors.name.message}</p>
              )}            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <UIButton type="button" variant="outline" onClick={handleClose}>
            Cancel
          </UIButton>
          <UIButton type="submit" className="bg-blue-600 hover:bg-blue-700">
          {loading ? (
                <div className="gap-2 flex"> 
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
                </div>
              ) : (
                "Add Category"
              )}
          </UIButton>
        </ModalFooter>
      </form>
    </Modal>
  )
}
