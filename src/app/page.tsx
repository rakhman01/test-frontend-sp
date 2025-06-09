'use client'
import { ArticleGrid } from "@/app/components/ui/article-grid";
import { BlogFooter } from "@/app/components/ui/blog-footer";
import { BlogHeader } from "@/app/components/ui/blog-header";
import http from "@/app/lib/ApiService";
import { useEffect, useState } from "react";



export default function BlogPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await http.get("/articles", {
        params: {
          title,
          category,
          sortOrder: "asc",
          page,
          limit,
        },
      });
      setData(res.data); // sesuaikan jika datanya nested
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [title, category, page, limit]); 
  
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <BlogHeader title={title} setTitle={setTitle} category={category} setCategory={setCategory} />
      <main className="flex-grow">
        <ArticleGrid data={data} page={page} setPage={setPage} />
      </main>
      <BlogFooter />
    </div>
  )
}
