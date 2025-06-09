"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Search, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { UIButton } from "../../components/ui/ui-button"
import { Select } from "../../components/ui/select"
import { FormSelect } from "../../components/ui/form-select"
import http from "@/app/lib/ApiService"
import { Pagination } from "./pagination"
import { CategorySelect } from "./category-select"
import { useRouter } from "next/navigation"
import { DeleteCategoryModal } from "./delete-category-modal"

export interface AdminArticle {
  id: number
  title: string
  category: string
  createdAt: string
  thumbnail: string
  status: "published" | "draft"
}



export function ArticlesTable() {
  const navigation = useRouter()
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedData, setSelectedData] = useState<any>(null)


  const handleDelete = (category: any) => {
    setSelectedData(category)
    setShowDeleteModal(true)
  }

  const handleDeleteArticle = async  (id: string) => {
    setLoading(true)
    try {
      const res = await http.delete(`/articles/${id}`)
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await http.get("/articles", {
        params: {
          title,
          category,
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
  }, [title, category, page, limit]);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="bg-gray-50 rounded-lg p-4">
        <span className="text-sm text-gray-600">Total Articles: {data.length}</span>
      </div>

      {/* Filters and Add Button */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex flex-col sm:flex-row gap-4">
           <CategorySelect value={category} setValue={setCategory}/>

           <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                value={title ?? ""}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                placeholder="Search articles"
                className="w-full h-10 pl-10 pr-4 rounded-md border border-blue-400 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
        </div>

        <UIButton onClick={() => navigation.push('/admin/articles/create')} className="bg-blue-600 hover:bg-blue-700 cursor-pointer">
          <Plus className="h-4 w-4 mr-2" />
          Add Articles
        </UIButton>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thumbnails
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-l-2 border-blue-500">
                Title
              </th>
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
            {data && data?.data?.map((article: any) => (
              <tr key={article.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-12 w-16 relative rounded overflow-hidden">
                    <Image
                      src={article.imageUrl || "/placeholder.svg"}
                      alt={article.title}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 max-w-xs">
                    <div className="line-clamp-2">{article.title}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {article?.category?.name}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{article.createdAt}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <button
                    onClick={() => navigation.push(`/admin/articles/preview/${article.id}`)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Preview
                  </button>
                  <button
                    onClick={() => navigation.push(`/admin/articles/edit/${article.id}`)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(article)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={data?.total / data?.limit}
        onPageChange={(page) => setPage(page)}

      />

            <DeleteCategoryModal
              isOpen={showDeleteModal}
              onClose={() => setShowDeleteModal(false)}
              onConfirm={() => handleDeleteArticle(selectedData?.id)}
              categoryName={selectedData?.name}
              categoryId={selectedData?.id}
            />
    </div>
  )
}
