import { createContext, useState,useEffect } from "react";
import api from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => { //i can use this since i exported this separately from auth context
    const [user,setUser] = useState(null);
    
    useEffect(() => {
        const checkAuth = async () => {
            try{
                const response = await api.get('/auth/checkAuth',{withCredentials:true});
                setUser(response.data.user);  
            } catch (error){
                console.error(error);
                setUser(null);
            }
        }

        checkAuth();
    }, []);


    return (
        <AuthContext.Provider value={[user,setUser]}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
