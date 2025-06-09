"use client"

import { useEffect, useState } from "react"
import { Search, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { AddCategoryModal } from "./add-category-modal"
import { EditCategoryModal } from "../ui/edit-category-modal"
import { DeleteCategoryModal } from "../ui/delete-category-modal"
import { UIButton } from "./ui-button"
import { Pagination } from "./pagination"
import http from "@/app/lib/ApiService"


  

export function CategoryTable() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [data, setData] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<any>(null)

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await http.get("/categories", {
        params: {
          name: title,
          sortOrder: "asc",
          page,
          limit,
        },
      });
      setData(res.data); // sesuaikan jika datanya nested
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchData();
  }, [title,  page, limit]);

  const handleEdit = (category: any) => {
    setSelectedCategory(category)
    setShowEditModal(true)
  }

  const handleDelete = (category: any) => {
    setSelectedCategory(category)
    setShowDeleteModal(true)
  }


  const handleEditCategory = async (categoryData: any) => { 
    try {
      const res = await http.put(`/categories/${categoryData.id}`, categoryData)
      setLoading(false)
      if (res.status === 200) {
        setShowEditModal(false)
        fetchData()
      }
    } catch (error) {
      setLoading(false)
      console.log(error);
    }
  }

  const handleDeleteCategory = async  (id: string) => {
    setLoading(true)
    try {
      const res = await http.delete(`/categories/${id}`)
      setLoading(false)
      if (res.status === 200) {
        setShowDeleteModal(false)
        fetchData()
      }
    } catch (error) {
      setLoading(false)
      console.log(error);
    }

    // Handle delete category logic here
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      {/* <div className="bg-gray-50 rounded-lg p-4">
        <span className="text-sm text-gray-600">Total Category: {data.length}</span>
      </div> */}

      {/* Search and Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
      <div className="relative flex-grow max-w-60">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                value={title ?? ""}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                placeholder="Search articles"
                className="w-full h-10 pl-10 pr-4 rounded-md border border-blue-400 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

        <UIButton onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </UIButton>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created at
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data && data?.data?.map((category: any) => (
              <tr key={category.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{category.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.createdAt}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <button onClick={() => handleEdit(category)} className="text-blue-600 hover:text-blue-900">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(category)} className="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
          {/* Pagination */}
          <Pagination
            currentPage={page}
            totalPages={data?.totalPages}
            onPageChange={(page) => setPage(page)}
    
          />

      {/* Modals */}
      <AddCategoryModal isOpen={showAddModal} onClose={() => setShowAddModal(false)}/>

      <EditCategoryModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onConfirm={handleEditCategory}
        category={selectedCategory}
      />

      <DeleteCategoryModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => handleDeleteCategory(selectedCategory?.id)}
        categoryName={selectedCategory?.name}
        categoryId={selectedCategory?.id}
      />
    </div>
  )
}
