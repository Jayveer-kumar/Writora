import PublicNavbar from "../../Components/Navbar/PublicNavbar"
import { Outlet } from "react-router-dom"
export default function GuestLayout(){
    return<div className="GuestLayout">
        <PublicNavbar />
        <main>
            <Outlet /> 
        </main>       
    </div>
}