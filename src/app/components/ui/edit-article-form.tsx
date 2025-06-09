"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { AlignCenter, AlignLeft, AlignRight, ArrowLeft, Bold, ImageIcon, Italic, Redo, Undo } from "lucide-react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import TextAlign from "@tiptap/extension-text-align"
import { UIButton } from "./ui-button"
import http from "@/app/lib/ApiService"
import { useRouter } from "next/navigation"

// Define interfaces for better type safety
interface Category {
  id: string
  name: string
}

interface Article {
  id: string
  title: string
  content: string
  categoryId: string
  imageUrl: string
  createdAt: string
  updatedAt: string
}

// Define Zod schema for validation
const articleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  categoryId: z.string().min(1, "Category is required"),
  content: z.string().min(1, "Content is required"),
  imageUrl: z.string().url("Thumbnail URL is required"),
})

type ArticleFormData = z.infer<typeof articleSchema>

interface EditArticleFormProps {
  articleId: string
}

export function EditArticleForm({ articleId }: EditArticleFormProps) {
  const router = useRouter()
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [wordCount, setWordCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [listCategory, setListCategory] = useState<Category[]>([])
  const [fetchingCategories, setFetchingCategories] = useState(false)
  const [article, setArticle] = useState<Article | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      categoryId: "",
      content: "",
      imageUrl: "",
    },
  })

  // Initialize Tiptap editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right"],
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      setValue("content", html, { shouldValidate: true })
      const text = editor.getText()
      setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0)
    },
    editorProps: {
      attributes: {
        class: "w-full p-3 min-h-[400px] focus:outline-none prose prose-sm sm:prose lg:prose-lg mx-auto",
      },
    },
  })

  // Fetch categories
  const fetchCategories = async () => {
    setFetchingCategories(true)
    try {
      const res = await http.get("/categories")
      setListCategory(res.data.data || [])
    } catch (err) {
      console.error("Failed to fetch categories:", err)
      setListCategory([])
    } finally {
      setFetchingCategories(false)
    }
  }

  // Fetch article data
  const fetchArticle = async () => {
    setInitialLoading(true)
    try {
      const res = await http.get(`/articles/${articleId}`)
      const articleData = res.data.data || res.data

      setArticle(articleData)

      // Populate form with article data
      reset({
        title: articleData.title,
        categoryId: articleData.categoryId,
        content: articleData.content,
        imageUrl: articleData.imageUrl,
      })

      // Set thumbnail preview
      if (articleData.imageUrl) {
        setThumbnailPreview(articleData.imageUrl)
      }

      // Set editor content
      if (editor && articleData.content) {
        editor.commands.setContent(articleData.content)
      }
    } catch (err) {
      console.error("Failed to fetch article:", err)
      router.push("/admin/articles")
    } finally {
      setInitialLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (articleId) {
      fetchArticle()
    }
  }, [articleId])

  // Update editor content when article data is loaded
  useEffect(() => {
    if (editor && article?.content) {
      editor.commands.setContent(article.content)
    }
  }, [editor, article])

  const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Validate file type
      if (!file.type.match(/^image\/(jpeg|jpg|png)$/)) {
        setUploadError("Please select a valid image file (.jpg, .jpeg, or .png)")
        return
      }

      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("File size must be less than 5MB")
        return
      }

      setThumbnailPreview(URL.createObjectURL(file))
      setUploadError(null)

      try {
        const formData = new FormData()
        formData.append("image", file)

        const response = await http.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })

        if (response.data?.imageUrl) {
            setValue("imageUrl", response.data.imageUrl, { shouldValidate: true })
          } else {
            throw new Error("Invalid response from server")
          }
      } catch (error) {
        console.error("Upload error:", error)
        setUploadError("Failed to upload image. Please try again.")
        setValue("imageUrl", article?.imageUrl || "", { shouldValidate: true })
        setThumbnailPreview(article?.imageUrl || null)
      }
    }
  }

  const handleAddImage = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".jpg,.jpeg,.png"
    input.onchange = async (e) => {
      const target = e.target as HTMLInputElement
      if (target.files && target.files[0]) {
        const file = target.files[0]
        try {
          const formData = new FormData()
          formData.append("image", file)

          const response = await http.post("/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })

       
          if (response.data?.imageUrl) {
            setValue("imageUrl", response.data.imageUrl, { shouldValidate: true })
          } else {
            throw new Error("Invalid response from server")
          }
        } catch (error) {
          console.error("Editor image upload error:", error)
          alert("Failed to upload image. Please try again.")
        }
      }
    }
    input.click()
  }

  const onSubmit = async (data: ArticleFormData) => {
    setLoading(true)
    try {
      const res = await http.put(`/articles/${articleId}`, data)

      if (res.status === 200) {
        router.push("/admin/articles")
      } else {
        throw new Error("Failed to update article")
      }
    } catch (error) {
      console.error("Update error:", error)
      alert("Failed to update article. Please try again.")
    } finally {
      setLoading(false)
    }
  }


  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <svg
            className="animate-spin h-8 w-8 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="text-lg text-gray-600">Loading article...</span>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Article not found</h2>
          <p className="text-gray-600 mb-4">The article you're looking for doesn't exist.</p>
          <Link href="/admin" className="text-blue-600 hover:text-blue-800">
            Back to Articles
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-black">
      <div className="flex items-center justify-between mb-6">
        <Link href="/admin/articles" className="flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span>Edit Article</span>
        </Link>
        <div className="text-sm text-gray-500">Last updated: {new Date(article.updatedAt).toLocaleDateString()}</div>
      </div>

      {/* Thumbnails */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Thumbnails</label>
        <div
          className={`border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer max-w-96 ${
            errors.imageUrl || uploadError ? "border-red-300" : "border-gray-300"
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          {thumbnailPreview ? (
            <div className="relative w-full h-40">
              <img
                src={thumbnailPreview || "/placeholder.svg"}
                alt="Thumbnail preview"
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <>
              <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">Click to select files</p>
              <p className="text-xs text-gray-400 mt-1">Support File Type: .jpg or .png (Max 5MB)</p>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png"
            className="hidden"
            onChange={handleThumbnailChange}
          />
        </div>
        {errors.imageUrl && <p className="text-sm text-red-500">{errors.imageUrl.message}</p>}
        {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}
      </div>

      {/* Title */}
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          id="title"
          placeholder="Input title"
          {...register("title")}
          className={`block w-full rounded-md border ${
            errors.title ? "border-red-300 focus:border-red-300 focus:ring-red-500" : "border-gray-300"
          } bg-white py-2 px-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm`}
        />
        {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <div className="relative">
          <select
            id="categoryId"
            {...register("categoryId")}
            disabled={fetchingCategories}
            className={`block w-full rounded-md border ${
              errors.categoryId ? "border-red-300" : "border-gray-300"
            } bg-white py-2 pl-3 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm disabled:opacity-50`}
          >
            <option value="">{fetchingCategories ? "Loading categories..." : "Select category"}</option>
            {listCategory.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {errors.categoryId && <p className="text-sm text-red-500">{errors.categoryId.message}</p>}
      </div>

      {/* Rich Text Editor */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Content</label>
        <div className={`border rounded-md overflow-hidden ${errors.content ? "border-red-300" : "border-gray-300"}`}>
          {/* Toolbar */}
          <div className="flex items-center gap-1 p-2 border-b border-gray-300 bg-gray-50">
            <button
              type="button"
              onClick={() => editor?.chain().focus().undo().run()}
              disabled={!editor?.can().undo()}
              className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
              title="Undo"
            >
              <Undo className="h-4 w-4 text-gray-600" />
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().redo().run()}
              disabled={!editor?.can().redo()}
              className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
              title="Redo"
            >
              <Redo className="h-4 w-4 text-gray-600" />
            </button>
            <div className="w-px h-5 bg-gray-300 mx-1"></div>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={`p-1 rounded hover:bg-gray-200 ${editor?.isActive("bold") ? "bg-gray-200" : ""}`}
              title="Bold"
            >
              <Bold className="h-4 w-4 text-gray-600" />
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={`p-1 rounded hover:bg-gray-200 ${editor?.isActive("italic") ? "bg-gray-200" : ""}`}
              title="Italic"
            >
              <Italic className="h-4 w-4 text-gray-600" />
            </button>
            <div className="w-px h-5 bg-gray-300 mx-1"></div>
            <button type="button" onClick={handleAddImage} className="p-1 rounded hover:bg-gray-200" title="Add Image">
              <ImageIcon className="h-4 w-4 text-gray-600" />
            </button>
            <div className="w-px h-5 bg-gray-300 mx-1"></div>
            <button
              type="button"
              onClick={() => editor?.chain().focus().setTextAlign("left").run()}
              className={`p-1 rounded hover:bg-gray-200 ${
                editor?.isActive({ textAlign: "left" }) ? "bg-gray-200" : ""
              }`}
              title="Align Left"
            >
              <AlignLeft className="h-4 w-4 text-gray-600" />
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().setTextAlign("center").run()}
              className={`p-1 rounded hover:bg-gray-200 ${
                editor?.isActive({ textAlign: "center" }) ? "bg-gray-200" : ""
              }`}
              title="Align Center"
            >
              <AlignCenter className="h-4 w-4 text-gray-600" />
            </button>
            <button
              type="button"
              onClick={() => editor?.chain().focus().setTextAlign("right").run()}
              className={`p-1 rounded hover:bg-gray-200 ${
                editor?.isActive({ textAlign: "right" }) ? "bg-gray-200" : ""
              }`}
              title="Align Right"
            >
              <AlignRight className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          {/* Content Area */}
          <div className="min-h-[400px]">
            <EditorContent editor={editor} />
          </div>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">{wordCount} Words</span>
          {errors.content && <p className="text-red-500">{errors.content.message}</p>}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <UIButton type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </UIButton>
        <UIButton type="button" variant="outline" onClick={() => router.push(`/admin/articles/preview/${articleId}`)}>
          Preview
        </UIButton>
        <UIButton
          type="submit"
          disabled={loading}
          className={`flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Updating...
            </>
          ) : (
            "Update Article"
          )}
        </UIButton>
      </div>
    </form>
  )
}
