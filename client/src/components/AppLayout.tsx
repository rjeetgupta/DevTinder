import { Outlet } from "react-router"
import Navbar from "./Navbar"

const AppLayout = () => {
  return (
    <div>
        <Navbar />
        <Outlet />
    </div>
  )
}

export default AppLayout