import { AdminLayout } from "@/app/components/ui/admin-layouts";
import { ArticlesTable } from "@/app/components/ui/article-table";


export default function AdminPage() {
  return (
    <AdminLayout>
      <ArticlesTable />
    </AdminLayout>
  )
}
