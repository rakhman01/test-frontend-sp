"use client"

import { useState, useEffect } from "react"
import { X, ExternalLink } from "lucide-react"

interface PreviewModalProps {
  isOpen: boolean
  onClose: () => void
  articleData: {
    title: string
    content: string
    imageUrl: string
    categoryId: string
  }
}

export function PreviewModal({ isOpen, onClose, articleData }: PreviewModalProps) {
  const [previewData, setPreviewData] = useState<any>(null)

  useEffect(() => {
    if (isOpen && articleData) {
      // Create a preview object that matches the Article interface
      setPreviewData({
        id: "preview",
        title: articleData.title,
        content: articleData.content,
        imageUrl: articleData.imageUrl,
        categoryId: articleData.categoryId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: "Admin",
      })
    }
  }, [isOpen, articleData])

  if (!isOpen || !previewData) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full h-full bg-white overflow-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Article Preview</h2>
            <div className="flex items-center space-x-3">
              <a
                href={`/admin/preview/preview`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800"
              >
                <ExternalLink className="h-4 w-4" />
                <span>Open in new tab</span>
              </a>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Preview Content */}
        <div className="min-h-screen">
          <InlinePreview article={previewData} />
        </div>
      </div>
    </div>
  )
}

interface InlinePreviewProps {
  article: any
}

function InlinePreview({ article }: InlinePreviewProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <svg className="h-8 w-8 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="12" fill="#2563EB" />
              <path
                d="M15.5 8.5L11.5 12.5L15.5 16.5M8.5 8.5L8.5 16.5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-xl font-semibold text-gray-900">LogoIpsum</span>
          </div>
          <div className="flex items-center bg-blue-700 rounded-full px-3 py-1">
            <div className="h-6 w-6 rounded-full bg-white text-blue-600 flex items-center justify-center mr-2 text-xs font-medium">
              J
            </div>
            <span className="text-sm text-white">James Dean</span>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <article className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center mb-8">
            <div className="text-sm text-gray-500 mb-4">
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              • Created by Admin
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-8">{article.title}</h1>
          </div>

          <div className="prose prose-lg max-w-none">
            {/* Featured Image */}
            {article.imageUrl && (
              <div className="relative h-96 mb-8 rounded-lg overflow-hidden">
                <img
                  src={article.imageUrl || "/placeholder.svg"}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Article Content */}
            <div
              className="space-y-6 text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </article>
      </main>

      <footer className="bg-blue-600 text-white py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-center items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <svg className="h-6 w-6 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="12" fill="white" />
              <path
                d="M15.5 8.5L11.5 12.5L15.5 16.5M8.5 8.5L8.5 16.5"
                stroke="#2563EB"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-lg font-semibold">LogoIpsum</span>
          </div>
          <div className="text-sm text-blue-200 ml-4">© 2025 Blog genzet. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}
