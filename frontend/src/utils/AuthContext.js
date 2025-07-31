import { createContext, useState,useEffect, useLayoutEffect } from "react";
import api from "./api";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => { //i can use this since i exported this separately from auth context
    const [user,setUser] = useState(null);
    const [accessToken,setAccessToken] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try{
                //revamp this 
                const response = await api.get('/auth/checkAuth');
                setUser(response.data.user);  
                setAccessToken(response.data.accessToken);
            } catch (error){
                console.error(error);
                setUser(null);
                setAccessToken(null);
            }
        }

        checkAuth();
    }, []);

    //this one will run every request, it will intercept the requests 
    useLayoutEffect(() => { //it intercepts the requests and checks first for header
        //technically the config is the http request itself in axios, so you need the object/request config 
        const authInterceptor = api.interceptors.request.use((config) => {
            config.headers.Authorization = 
                !config._retry && accessToken
                    ? `Bearer ${accessToken}`
                    : config.headers.Authorization
            return config;
        });

        return(() => {
            api.interceptors.request.eject(authInterceptor);
        });
    }, [accessToken]);

    //this one will run every response receive from the server
    //however, to prevent infinite looping, it has depends on status, in this case 401 and if its a new request
    useLayoutEffect(() => { 
        const refreshInterceptor = api.interceptors.response.use(
            res => res,
            async (err) => {
            const originalRequest = err.config;

            if (err.response?.status === 403 && err.response?.data.message === 'Unauthorized'){
                try {
                    const response = await api.get('/auth/refresh', {withCredentials:true});
                      
                    setAccessToken(response.data.accessToken);
                    setUser(response.data.user);

                    originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
                    originalRequest._retry = true;

                    return axios(originalRequest);
                } catch (refreshErr){
                    //logout
                    setAccessToken(null);
                    setUser(null);
                    return Promise.reject(refreshErr);
                }
            }   
            return Promise.reject(err);
        })

        return (() => {
            api.interceptors.response.eject(refreshInterceptor);
        });
    }, []);
    
    return (
        <AuthContext.Provider value={[user,setUser,accessToken,setAccessToken]}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
