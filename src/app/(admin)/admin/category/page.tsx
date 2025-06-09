import { AdminLayout } from "@/app/components/ui/admin-layouts";
import { CategoryTable } from "@/app/components/ui/category-table";


export default function AdminCategoryPage() {
  return (
    <AdminLayout>
      <CategoryTable />
    </AdminLayout>
  )
}
