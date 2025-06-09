import { Search } from "lucide-react"
import { CategorySelect } from "./category-select"
import { UserDropdown } from "./user-dropdown";


interface BlogHeaderProps {
  title: string;
  setTitle: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
}


export function BlogHeader({ title, setTitle, category, setCategory }: BlogHeaderProps) {

  return (
    <header className="w-full">
      <div className="bg-blue-600 text-white">
        {/* Top navigation */}
         {/* Top navigation */}
         <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <svg className="h-8 w-8 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="12" fill="white" />
              <path
                d="M15.5 8.5L11.5 12.5L15.5 16.5M8.5 8.5L8.5 16.5"
                stroke="#2563EB"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-xl font-semibold">LogoIpsum</span>
          </div>

          <UserDropdown userName="James Dean" userInitial="J" />
        </div>

        {/* Blog header */}
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="mb-2 text-blue-200">Blog parent</div>
          <h1 className="text-4xl font-bold mb-2">
            The Journal : Design Resources,
            <br />
            Interviews, and Industry News
          </h1>
          <p className="text-xl text-blue-100">Your daily dose of design insights!</p>

          {/* Search and filter */}
          <div className="max-w-2xl mx-auto mt-8 flex gap-4">
            <CategorySelect value={category} setValue={setCategory}/>
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                value={title ?? ""}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                placeholder="Search articles"
                className="w-full h-10 pl-10 pr-4 rounded-md border border-blue-400 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
