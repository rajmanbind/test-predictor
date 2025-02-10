import LoginForm from "@/components/admin-panel/LoginForm"
import { Loader } from "@/components/common/Loader"

export default function AdminLoginPage() {
  return (
    <div>
      <LoginForm />
      <Loader />
    </div>
  )
}
