import Image from "next/image"
import Link from "next/link"



export function RelatedArticles({ articles }: any) {
  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Other articles</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article: any) => (
            <Link key={article.id} href={`/articles/${article.id}`} className="group">
              <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={article.imageUrl || "/placeholder.svg"}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>

                <div className="p-6">
                  <div className="text-sm text-gray-500 mb-2">{article.date}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>
                  {/* <p className="text-gray-600 text-sm mb-4 line-clamp-2">{article.excerpt}</p> */}
                  <div
        className="prose h-20 overflow-hidden"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
                  <div className="flex gap-2">
                    {/* {article.tags.map((tag: any) => ( */}
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          article.category.name === "Technology" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {article.category.name}
                      </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
