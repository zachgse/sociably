import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function Layout() {
    return (
        <>
            <Navbar/>
            <p>Shared layout!</p>

            <main>
                <Outlet/>
            </main>
        </>
    )

}

export default Layout;