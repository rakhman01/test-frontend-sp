"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ArticleContent } from "@/app/components/ui/article-content"
import { ArticleHeader } from "@/app/components/ui/article-header"
import { BlogFooter } from "@/app/components/ui/blog-footer"
import { RelatedArticles } from "@/app/components/ui/related-articles"
import http from "@/app/lib/ApiService"

export interface User {
  id: string
  username: string
  role: string
  password: string
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  userId: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface Article {
  id: string
  userId: string
  categoryId: string
  title: string
  content: string
  imageUrl: string
  createdAt: string
  updatedAt: string
  user: User
  category: Category
}

export default function ArticlePage() {
  const params = useParams() as { id: string }
  const { id } = params

  const [data, setData] = useState<Article | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<Article[] | null>(null)
  const [loading, setLoading] = useState(false)

  // Get main article
  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await http.get(`/articles/${id}`)
      setData(res.data)
    } catch (err) {
      console.error("Failed to fetch article:", err)
    } finally {
      setLoading(false)
    }
  }

  // Get related articles after main article is loaded
  const fetchDataRelate = async (categoryId: string) => {
    try {
      const res = await http.get("/articles", {
        params: {
          category: categoryId,
          limit: 5,
        },
      })
      setRelatedArticles(res.data.data) // tergantung struktur response
    } catch (err) {
      console.error("Failed to fetch related articles:", err)
    }
  }

  useEffect(() => {
    fetchData()
  }, [id])

  useEffect(() => {
    if (data?.category?.id) {
      fetchDataRelate(data.category.id)
    }
  }, [data])

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <ArticleHeader />
      <main className="flex-grow">
        <article className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center mb-8">
            <div className="text-sm text-gray-500 mb-4">
              {data?.createdAt} • Created by {data?.user?.username}
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-8">{data?.title}</h1>
          </div>

          <ArticleContent article={data} />
        </article>

        <RelatedArticles articles={relatedArticles?.slice(0,3) || []} />
      </main>
      <BlogFooter />
    </div>
  )
}
