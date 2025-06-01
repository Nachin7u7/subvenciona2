import { Navigate } from "react-router";

const ProtectedRoutes = ({children,}:{children:React.ReactNode;})=> {
  const token = localStorage.getItem("token");
  const isAuthenticated = token !==null
  return <>{isAuthenticated ? children:<Navigate to="/login"/> }</>
}

export default ProtectedRoutes