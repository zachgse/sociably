import { useContext } from "react";
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
            <div className="w-full h-20 border-b border-gray-300 flex items-center px-8">
                <div className="me-auto">
                    <p className="color-primary text-5xl uppercase font-bold tracking-wide">{process.env.REACT_APP_NAME}</p>
                </div>
                <div className="flex items-center gap-4">
                    <div>
                        <Link to={{pathname: "/about"}}>About</Link>
                    </div>
                    {user
                    ? (
                        <div className="flex items-center gap-4">
                            <div><img className="rounded-full w-12 h-12" src={user?.picture}/></div>
                            {/* add dropdown here */}
                            <div className="cursor-pointer" onClick={logout}>Logout</div>
                        </div>
                    )
                    : (
                        <div>
                            <GoogleLogin text="signin_with" size="medium" shape="pill"
                                auto_select={false} prompt="select_account"
                                onSuccess={(credentialResponse) => handleLoginSuccess(credentialResponse)}
                                onError={() => handleLoginError()}/> 
                        </div>
                    )}
                </div>
            </div>        
        </>
    )
}

export default Navbar;