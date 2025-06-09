import { BlogFooter } from "@/app/components/ui/blog-footer";
import { ProfileHeader } from "@/app/components/ui/profile-header";
import { UserProfile } from "@/app/components/ui/user-profile";


export default function ProfilePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <ProfileHeader />
      <main className="flex-grow flex items-center justify-center">
        <UserProfile />
      </main>
      <BlogFooter />
    </div>
  )
}
