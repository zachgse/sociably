import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function Layout() {
    return (
        <>
            <Navbar/>
            <main className="max-w-[1300px] w-full mx-auto px-12">
                <Outlet/>
            </main>
        </>
    )

}

export default Layout;