import Image from "next/image"

interface ArticleContentProps {
  article: any
}

export function ArticleContent({ article }: ArticleContentProps) {
  return (
    <div className="prose prose-lg max-w-none">
      {/* Featured Image */}
      <div className="relative h-96 mb-8 rounded-lg overflow-hidden">
        <Image
          src={article?.imageUrl || "/placeholder.svg"}
          alt={article?.title || ''}
          fill
          className="object-cover"
          priority
        />
      </div>


      <div className="space-y-6 text-black"   dangerouslySetInnerHTML={{ __html: article?.content }}></div>
    </div>
  )
}
