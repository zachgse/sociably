import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function Layout() {
    return (
        <>
            <Navbar/>
            <main className="w-full mx-auto">
                <Outlet/>
            </main>
        </>
    )

}

export default Layout;