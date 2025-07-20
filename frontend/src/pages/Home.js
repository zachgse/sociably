import { useContext,useState,useEffect,Suspense } from "react";
import AuthContext from "../utils/AuthContext";
import { FaImages } from "react-icons/fa"; 
import { FaLocationDot } from "react-icons/fa6";
import { MdEmojiEmotions } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { AiFillLike } from "react-icons/ai";
import moment from "moment";
import api from "../api/api";
import { fetchPostsResource } from "../resources/PostResource";

function Home() {
    const [user] = useContext(AuthContext);
    const posts = fetchPostsResource.read();
    const [post,setPost] = useState(null);
    // ispostloading state
    const [isModalOpen,setIsModalOpen] = useState(false);

    const toggleModal = ({type}) => {
        switch(type){
            case 'post':
                setIsModalOpen(true);
                break;
            case 'close':
                setIsModalOpen(false);
                break;
            default:
                break;
        }
    }

    const handlePostValue = (e) => {
        setPost(e.target.value);
    }

    const createPost = async(e) => {
        e.preventDefault();
        try{
            const formData = new FormData();
            formData.append("description",post);
            const response = await api.post("/post/create",formData,{
                withCredentials:true
            });
        } catch (error){
            console.error(error);
        }
    }

    const likePost = async({postId}) => {
        try {
            console.log("post id: ", postId);
            const response = await api.put(`/post/${postId}`,{},{withCredentials:true});
            console.log("reponse: ", response);
        } catch (error){
            console.error(error);
        }
    }

    return (
        <>  
            {/* ADD MODAL HERE BOTH FOR POST AND COMMENT */}
            {isModalOpen && (
                <div>
                    <div className="fixed inset-0 bg-black opacity-70 z-40"></div> {/* INSET */}
                    <div className="fixed inset-0 flex justify-center items-center z-40"> {/* MAIN CARD MODAL */}
                        <div class="bg-white md:w-2/5 w-11/12 h-4/5 p-6 rounded-lg shadow-lg flex flex-col overflow-auto gap-4">
                            <div className="flex justify-center items-center">
                                <p className="text-center font-bold mx-auto">Create post</p>
                                <IoClose className="text-gray-500 w-4 h-4 cursor-pointer" 
                                    onClick={() => toggleModal({ type: 'close' })}/>
                            </div>
                            <hr className="border-gray-300"/>
                            <div className="">
                                <textarea value={post} onChange={handlePostValue}
                                    className="w-full border border-gray-300 p-2" rows="14">
                                    What's on your mind {/*  POST STATE HERE */}
                                </textarea>
                            </div>
                            <div className="flex flex-1 items-center justify-center gap-1">
                                <FaImages className="h-6 w-6 text-green-500"/>
                                <p className="text-xs">Add Photo</p>
                            </div>
                            <button onClick={(e) => createPost(e)}
                                className={"rounded-full text-white p-2 " + 
                                    (post ? 'btn-primary-dark cursor-pointer' : 'btn-primary cursor-not-allowed')}>
                                Post
                            </button>
                        </div>
                    </div> 
                </div>
            )}
            <div className="grid grid-cols-12">
                {/* LEFT SIDE COLUMN FIXED */}
                <div className="grid md:col-span-2 col-span-0 md:block hidden mx-auto p-4">
                    <div>
                        <div className="flex items-center gap-4">
                            <img src={user?.picture} className="rounded-full w-12 h-12"/>
                            <p>{user?.name}</p>
                        </div>
                    </div>
                </div>
                {/* RIGHT SIDE */}
                <div className="grid md:col-span-8 col-span-12 mx-auto md:w-4/5 w-full p-4">
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
                            <div className="flex items-center gap-1 justify-center">
                                <FaLocationDot className="h-6 w-6 text-red-500"/>
                                <p className="text-xs">Location</p>
                            </div>
                            <div className="flex items-center gap-1 justify-center">
                                <FaImages className="h-6 w-6 text-green-500"/>
                                <p className="text-xs">Photo</p>
                            </div>
                            <div className="flex items-center gap-1 justify-center">
                                <MdEmojiEmotions className="h-6 w-6 text-yellow-500"/>
                                <p className="text-xs">Feeling</p>
                            </div>
                        </div>
                        
                        
                        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
                        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
                        <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
                    </div>   

                    {/* LIST OF POSTS */}
                    <div className="mt-4">
                        <Suspense fallback={<p>Loading posts...</p>}>
                            {posts.map((postItem) => (
                                <div key={postItem?.id}
                                    className="border border-gray-300 rounded-lg flex flex-col gap-4">
                                    <div className="flex items-center gap-4 px-4 mt-4">
                                        <img src={postItem?.profile_picture} alt="User Profile picture"
                                            className="w-16 h-16 rounded-full"/>
                                        <div className="flex flex-col">
                                            <p>{postItem?.posted_by}</p>
                                            <p className="text-2xs text-gray-500">
                                                {moment.utc(postItem?.posted_at).local().fromNow()}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="flex-1 px-4">{postItem?.description}</p>
                                    <div className="flex items-center gap-2 px-4  mt-4">
                                        <AiFillLike className="text-blue-500 w-4 h-4"/> 
                                        <span className="text-2xs">{postItem?.number_of_likes}</span>
                                    </div>
                                    <div className="flex items-center justify-around border-t border-gray-300">
                                        <div onClick={() => likePost({postId: postItem?.id})} 
                                            className="w-full h-full hover:bg-gray-100 text-center cursor-pointer text-xs p-4">
                                            Like
                                        </div>
                                        <div className="w-full h-full hover:bg-gray-100 text-center cursor-pointer text-xs p-4">
                                            Comment
                                        </div>
                                    </div>  
                                </div>
                                
                            ))}
                        </Suspense>
                    </div>                 
                </div>
            </div>
        </>   
    )
}

export default Home;