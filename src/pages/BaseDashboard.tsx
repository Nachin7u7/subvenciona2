import { getStorage } from "../helper/localStorage"
import Dashboard from "./AdminDashboard"

export default function BaseDashboard() {
  const user:{rol:string} = JSON.parse(getStorage("user"))
  return <>{if user.rol === "admin" (<Dashboard/>):}</>
}