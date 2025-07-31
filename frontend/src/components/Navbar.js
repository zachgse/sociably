import { useContext } from "react";
import { Link,useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import swal  from "sweetalert2";
import api from "../utils/api";
import AuthContext from "../utils/AuthContext";

function Navbar() {
    const [user,setUser,setAccessToken] = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        const result = await swal.fire({
            text: 'Do you want to logout?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Logout',
            confirmButtonColor: '#ef4444',
            cancelButtonText: 'Cancel',
            cancelButtonColor: '#808080',
        });

        if (result.isConfirmed) {
            swal.fire({
                text: 'Logging out ...',
                allowOutsideClick: false,
                didOpen: () => {
                    swal.showLoading();
                }
            });

            await logout();

            swal.fire({
                text: "Logout successfully!",
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
            
            // navigate("/login");
        } else if (result.isDismissed) {
            return;
        }
    };

    async function logout() {
        return new Promise((resolve) => {
            setTimeout(async() => {
                try{
                    const response = await api.get('/auth/logout',{
                        withCredentials:true
                    });
                    googleLogout();
                    setUser(null);
                    setAccessToken(null);
                } catch (error){
                    console.error(error);
                } finally {
                    resolve();
                }
            },2000)
        });
    }

    return (
        <>
            <div className="w-full h-20 border-b border-gray-300">
                <div className="h-full flex items-center px-8 mx-auto">
                    <div className="me-auto">
                        <Link to={{pathname:"/"}} 
                            className="color-primary text-5xl uppercase font-bold tracking-wide">
                            {process.env.REACT_APP_NAME}
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div><img className="rounded-full w-12 h-12" src={user?.picture}/></div>
                            {/* add dropdown here */}
                            <div className="cursor-pointer" onClick={handleLogout}>Logout</div>
                        </div>
                    </div>
                </div>
            </div>        
        </>
    )
}

export default Navbar;