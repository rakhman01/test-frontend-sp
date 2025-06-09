"use client"
import { useEffect,useState } from "react";
import http from "@/app/lib/ApiService";
import { ChevronDown } from "lucide-react"

interface CategoryProps {

  value: string;
  setValue: (value: string) => void;
}

export function CategorySelect({value, setValue}: CategoryProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("Select category")
  const [listcategory, setListCategory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCategorySelect = ({name, id}: {name: string, id: string}) => {        
    setValue(id)
    setSelectedCategory(name)
    setIsOpen(false)
  }



  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await http.get("/categories");
      setListCategory(res.data.data); // sesuaikan jika datanya nested
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); 

  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-10 px-4 rounded-md border border-blue-400 bg-white text-gray-800 flex items-center justify-between min-w-[160px]"
      >
        <span className="text-sm">{selectedCategory}</span>
        <ChevronDown className="h-4 w-4 ml-2 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <ul className="py-1">
            {listcategory?.map((category: {name: string, id: string}, index) => (
              <li key={index}>
                <button
                  onClick={() => handleCategorySelect(category)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {category?.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
