import { AdminLayout } from "@/app/components/ui/admin-layouts"
import { EditArticleForm } from "@/app/components/ui/edit-article-form"



export default function EditArticlePage({ params }: any) {
  return (
    <AdminLayout>
      <EditArticleForm articleId={params.id} />
    </AdminLayout>
  )
}
