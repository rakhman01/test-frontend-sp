import Image from "next/image"
import { useRouter } from "next/navigation"

export interface Article {
  id: number
  title: string
  excerpt: string
  createdAt: string
  imageUrl: string
  tags: string[]
  category: any,
  content: string
}


interface ArticleCardProps {
  article: Article
}

export function ArticleCard({ article }: ArticleCardProps) {
  const navigation = useRouter()
  return (
    <div onClick={() => navigation.push(`/articles/${article.id}`)} className="flex flex-col h-full cursor-pointer">
      <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
        <Image
          src={article?.imageUrl || "/placeholder.svg"}
          alt={article.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div className="text-sm text-gray-500 mb-2">{article.createdAt}</div>

      <h3 className="text-xl font-bold mb-2 line-clamp-2 text-black">{article.title}</h3>

      {/* <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p> */}
      <div
        className="prose max-h-20 overflow-hidden"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />



      <div className="mt-auto flex gap-2">
        {/* {article?.tags?.map((tag) => ( */}
        <span
          className={`text-xs px-3 py-1 rounded-full ${article.category.name === "Technology" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
            }`}
        >
          {article.category.name}
        </span>
        {/* ))} */}
      </div>
    </div>
  )
}
