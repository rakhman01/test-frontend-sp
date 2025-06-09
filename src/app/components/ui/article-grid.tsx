"use client"

import { useState } from "react"
import { ArticleCard } from "./article-card"
import { Pagination } from "./pagination"

export function ArticleGrid({data, page, setPage}: any) {

  



  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-sm text-gray-500 mb-6">
        Showing:{" "}
        <span className="font-medium">
          {data.limit} of {data.total} articles
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data && data?.data?.map((article: any) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      <div className="mt-12">
        <Pagination
          currentPage={page}
          totalPages={data.total/data.limit}
          onPageChange={(page) => setPage(page)}
  
        />
      </div>
    </div>
  )
}
