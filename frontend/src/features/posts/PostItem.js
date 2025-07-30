import { useContext } from "react";
import moment from "moment";
import { AiFillLike,AiOutlineLike } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { usePostLike } from "../../hooks/postHooks";
import AuthContext from "../../utils/AuthContext";
import ModalContext from "../../utils/ModalContext";

export default function PostItem({post,type}){
    const [user] = useContext(AuthContext);
    const {toggleModal,setPostObject} = useContext(ModalContext);

    const createLikePost = usePostLike();

    const handleLikePost = () => {
        createLikePost.mutate({postId:post.id})
    }

    function IsUserLiked(){
        if (Array.isArray(post.likes) && post.likes.length > 0) {
            const isLiked = post.likes.some((like) => like.user_id === user.id);
            return isLiked ? (
                <>
                    <AiFillLike className="w-4 h-4 text-blue-500"/>
                    Unlike 
                </>

            ) : (
                <>
                    <AiOutlineLike className="w-4 h-4"/>
                    Like 
                </>        
            );
        } else {
            return (
                <>
                    <AiOutlineLike className="w-4 h-4"/>
                    Like 
                </>
            );
        }
    }

    if (type == 'modal') {
        return (
            <>
                <div className="flex gap-2">
                    <img src={post?.profile_picture} alt="User Profile picture"
                                className="w-12 h-12 rounded-full"/>
                    <div className="flex flex-col">
                        <p className="font-bold">{post?.posted_by}</p>
                        <p className="text-2xs text-gray-500">
                            {moment.utc(post?.posted_at).local().fromNow()}
                        </p>
                    </div>
                </div>
                <div className="border border-gray-300 rounded-lg w-full h-auto p-4">
                    {post?.description}
                </div>
                <div className="flex justify-between px-4 text-xs text-gray-500 px-4">
                    {post?.number_of_likes ? (
                        <div className="flex items-center gap-2">
                            <AiFillLike className="text-blue-500 w-4 h-4"/> 
                            <span className="text-2xs">{post?.number_of_likes}</span>
                        </div>
                    ) : ""}
                    <div className="ml-auto">
                        xx comments
                    </div>
                </div>
                <div className="flex items-center justify-around border-t border-b  border-gray-300">
                    <div onClick={handleLikePost}
                        className="flex items-center justify-center gap-2 w-full h-full 
                            hover:bg-gray-100 text-center cursor-pointer text-xs text-gray-500 p-4">
                        <IsUserLiked likes={post?.likes}/>
                    </div>
                    <div 
                        className="flex items-center justify-center gap-2 w-full h-full 
                            hover:bg-gray-100 text-center cursor-pointer text-xs text-gray-500 p-4">
                        <span><FaRegComment className="w-4 h-4"/> </span> Comment
                    </div>
                </div>
            </>
        )
    } else {
        return (
            <div key={post?.id}
                className="border border-gray-300 rounded-lg flex flex-col gap-4 my-4">
                <div className="flex items-center gap-4 px-4 mt-4">
                    <img src={post?.profile_picture} alt="User Profile picture"
                        className="w-16 h-16 rounded-full"/>
                    <div className="flex flex-col">
                        <p className="font-semi-bold">{post?.posted_by}</p>
                        <p className="text-xs text-gray-500">
                            {moment.utc(post?.posted_at).local().fromNow()}
                        </p>
                    </div>
                </div>
                <p className="flex-1 px-4">{post?.description}</p>
                <div className="flex justify-between px-4 text-xs text-gray-500 px-4">
                    {post?.number_of_likes ? (
                        <div className="flex items-center gap-2">
                            <AiFillLike className="text-blue-500 w-4 h-4"/> 
                            <span className="text-2xs">{post?.number_of_likes}</span>
                        </div>
                    ) : ""}
                    <div className="ml-auto">
                        xx comments
                    </div>
                </div>
                <div className="flex items-center justify-around border-t border-gray-300">
                    <div onClick={handleLikePost} 
                        className="flex items-center justify-center gap-2 w-full h-full hover:bg-gray-100 text-center cursor-pointer text-xs p-4">
                        <IsUserLiked/>
                    </div>
                    <div onClick={() => {
                        setPostObject(post)
                        toggleModal({type:'comment'});
                    }} 
                        className="flex items-center justify-center gap-2 w-full h-full hover:bg-gray-100 text-center cursor-pointer text-xs p-4">
                        <FaRegComment className="w-4 h-4"/>
                        Comment
                    </div>
                </div>  
            </div>
        )
    }


}