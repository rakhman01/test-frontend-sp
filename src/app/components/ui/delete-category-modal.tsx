"use client"
import { Modal, ModalHeader, ModalBody, ModalFooter } from "./modal"
import { UIButton } from "./ui-button"

interface DeleteCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: any // ⬅ ubah di sini
  categoryName?: string
  categoryId?: string
}

export function DeleteCategoryModal({ isOpen, onClose, onConfirm, categoryName, categoryId }: DeleteCategoryModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        <h2 className="text-xl font-semibold text-gray-900">Delete Category</h2>
      </ModalHeader>
      <ModalBody>
        <p className="text-gray-600">
          Are you sure you want to delete the category "{categoryName}"? This action cannot be undone.
        </p>
      </ModalBody>
      <ModalFooter>
        <UIButton variant="outline" onClick={onClose}>
          Cancel
        </UIButton>
        <UIButton onClick={() => onConfirm(categoryId || '')} className="bg-red-600 hover:bg-red-700">
          Delete
        </UIButton>
      </ModalFooter>
    </Modal>
  )
}
