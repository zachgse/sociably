import { useContext } from "react"
import AuthContext from "../utils/AuthContext"

export default function Sidebar(){
    const [user] = useContext(AuthContext);
    
    return (
        <div>
            <div className="flex items-center gap-4">
                <img src={user?.picture} className="rounded-full w-12 h-12"/>
                <p>{user?.name}</p>
            </div>
        </div>
    )
}