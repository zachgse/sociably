import { useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { GoogleLogin,googleLogout } from "@react-oauth/google";
import api from "../api/api";
import AuthContext from "../utils/AuthContext";

function Login(){
    const [user,setUser] = useContext(AuthContext);
    const navigate = useNavigate();

    async function handleLoginSuccess(credentialResponse) {
        try {
            const response = await api.post('/auth/auth', 
                    {credential:credentialResponse.credential},
                    {withCredentials:true});
            setUser(response.data.user);
            navigate("/");
        } catch (error) {
            console.error(error); 
        }
    }
    
    function handleLoginError(){
        console.log("error!");
    }

    return(
        <>
            <body className="bg-[#8BD6C8] flex items-center justify-center h-screen ">
                <div className="bg-white border border-gray-300 shadow-lg w-96 h-60 rounded-lg flex flex-col items-center gap-6 py-8">
                    <p className="color-primary text-5xl uppercase font-bold tracking-wide">
                        {process.env.REACT_APP_NAME}
                    </p>
                    <p className="text-gray-500 font-bold text-xs">Please login to be able to use the system.</p>
                    <div>
                        <GoogleLogin text="signin_with" size="medium" shape="pill"
                            auto_select={false} prompt="select_account"
                            onSuccess={(credentialResponse) => handleLoginSuccess(credentialResponse)}
                            onError={() => handleLoginError()}/> 
                    </div>
                </div>
            </body>
        </>
    )
}

export default Login;