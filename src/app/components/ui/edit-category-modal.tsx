"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Modal, ModalHeader, ModalBody, ModalFooter } from "./modal"
import { UIButton } from "./ui-button"
import { FormInput } from "./form-input"

interface EditCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (categoryData: { id: number; name: string }) => void
  category: any
}

export function EditCategoryModal({ isOpen, onClose, onConfirm, category }: EditCategoryModalProps) {
  const [categoryName, setCategoryName] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (category) {
      setCategoryName(category.name)
    }
  }, [category])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!categoryName.trim()) {
      setError("Category name is required")
      return
    }
    onConfirm({ id: category.id, name: categoryName.trim() })
    setError("")
  }

  const handleClose = () => {
    setError("")
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <ModalHeader>
          <h2 className="text-xl font-semibold text-gray-900">Edit Category</h2>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <label htmlFor="editCategoryName" className="block text-sm font-medium text-gray-700 mb-1">
                Category Name
              </label>
              <FormInput
                id="editCategoryName"
                placeholder="Enter category name"
                value={categoryName}
                onChange={(e) => {
                  setCategoryName(e.target.value)
                  setError("")
                }}
                className={error ? "border-red-300 focus:border-red-300 focus:ring-red-500" : ""}
              />
              {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <UIButton type="button" variant="outline" onClick={handleClose}>
            Cancel
          </UIButton>
          <UIButton type="submit" className="bg-blue-600 hover:bg-blue-700">
            Update Category
          </UIButton>
        </ModalFooter>
      </form>
    </Modal>
  )
}
