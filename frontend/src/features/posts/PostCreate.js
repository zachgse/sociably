import { useContext } from "react";
import { FaImages } from "react-icons/fa"; 
import { FaLocationDot } from "react-icons/fa6";
import { MdEmojiEmotions } from "react-icons/md";
import AuthContext from "../../utils/AuthContext";
import ModalContext from "../../utils/ModalContext";

export default function PostCreate(){
    const [user] = useContext(AuthContext);
    const {toggleModal} = useContext(ModalContext);

    return (
        <div className="border border-gray-300 w-full h-40 rounded-lg flex flex-col gap-4 p-4"> 
            <div className="flex items-center gap-2 mt-2">
                <img src={user?.picture} className="rounded-full w-12 h-12"/>
                <div className="flex items-center border border-gray-300 w-full h-12 rounded-full px-4 cursor-pointer" 
                    onClick={() => toggleModal({type:'post'})}>
                    <p className="text-gray-500">What's on your mind, {user?.name}</p>
                </div>
            </div>          
            <hr className="border-gray-300"/>
            <div className="flex items-center gap-4 justify-center">
                <div onClick={() => toggleModal({type:'location'})} 
                    className="flex items-center gap-1 justify-center cursor-pointer">
                    <FaLocationDot className="h-6 w-6 text-red-500"/>
                    <p className="text-xs">Location</p>
                </div>
                <div onClick={() => toggleModal({type:'photo'})}
                    className="flex items-center gap-1 justify-center cursor-pointer">
                    <FaImages className="h-6 w-6 text-green-500"/>
                    <p className="text-xs">Photo</p>
                </div>
                <div onClick={() => toggleModal({type:'feeling'})}
                    className="flex items-center gap-1 justify-center cursor-pointer">
                    <MdEmojiEmotions className="h-6 w-6 text-yellow-500"/>
                    <p className="text-xs">Feeling</p>
                </div>
            </div>
        </div>   
    )
}