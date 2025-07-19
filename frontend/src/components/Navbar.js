import { useContext} from "react";
import { Link } from "react-router-dom";
import { GoogleLogin,googleLogout } from "@react-oauth/google";
import api from "../api/api";
import AuthContext from "../utils/AuthContext";

function Navbar() {
    const [user,setUser] = useContext(AuthContext);

    async function handleLoginSuccess(credentialResponse) {
        try {
            const response = await api.post('/auth/auth', 
                    {credential:credentialResponse.credential},
                    {withCredentials:true});
            setUser(response.data.user);
        } catch (error) {
            console.error(error); 
        }
    }
    
    function handleLoginError(){
        console.log("error!");
    }

    const logout = async() => {
        try{
            const response = await api.get('/auth/logout',{
                withCredentials:true
            });
            googleLogout();
            setUser(null);
        } catch (error){
            console.error(error);
        }
    }

    return (
        <>
            {user
                ? (
                    <div className="flex items-center gap-4">
                        <div>Hello {user?.name}</div>
                        <div className="cursor-pointer" onClick={logout}>Logout</div>
                    </div>
                )
                : (
                    <div>
                        <GoogleLogin auto_select={false}
                            onSuccess={(credentialResponse) => handleLoginSuccess(credentialResponse)}
                            onError={() => handleLoginError()}/> 
                    </div>
            )}

            <div className="flex items-center w-full gap-4 my-24 cursor-pointer">
                <Link to={{pathname: "/"}}>Home</Link>
                <Link to={{pathname: "/about"}}>About</Link>
            </div>
        
        </>
    )
}

export default Navbar;