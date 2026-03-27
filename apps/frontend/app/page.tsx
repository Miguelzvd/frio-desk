import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function RootPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get("accessToken")?.value
  const role = cookieStore.get("auth-role")?.value

  if (!token) {
    redirect("/login")
  } else if (role === "admin") {
    redirect("/admin/dashboard")
  } else {
    redirect("/dashboard")
  }
}
