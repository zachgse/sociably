import { useContext,useState,useEffect,Suspense } from "react";
import AuthContext from "../utils/AuthContext";
import { FaImages } from "react-icons/fa"; 
import { FaLocationDot,FaRegComment } from "react-icons/fa6";
import { MdEmojiEmotions } from "react-icons/md";
import { IoClose,IoSend } from "react-icons/io5";
import { AiFillLike,AiOutlineLike } from "react-icons/ai";
import moment from "moment";
import api from "../api/api";
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

function Home() {
    const [user] = useContext(AuthContext);
    const [posts,setPosts] = useState([]);

    //for modal
    const [action,setAction] = useState(null);
    const [isModalOpen,setIsModalOpen] = useState(false);
    const [postInput,setPostInput] = useState(null);
    const [IsPostLoading,setIsPostLoading] = useState(false);

    // for comments
    const [postId,setpostId] = useState(null);
    const [postObject,setPostObject] = useState(null);
    const [comments,setComments] = useState([]);
    const [commentInput,setCommentInput] = useState(null);

    useEffect(() => { //fetching posts initially
        const fetchPosts = async() => {
            try {
                const response = await api.get('/post');
                setPosts(response.data.data);
            } catch (error){
                console.error(error);
            }
        }
        fetchPosts();
    }, [])

    useEffect(() => { //fetching new posts via websocket
        const handleFetchPosts = (data) => {
            // ... IS SPREAD OPERATOR all the existing/past data
            // then the data is the new one
            setPosts((prev) => [data,...prev]);
        };

        socket.on('fetch_posts', handleFetchPosts);

        return () => {
            socket.off('fetch_posts', handleFetchPosts); // 🔥 cleanup
        };
    }, []);

    useEffect(() => { //fetching likes on posts via websocket
        const handleLikePost = (data) => {
            setPosts((prevPosts) => {
                const index = prevPosts.findIndex((p) => p.id === data?.id); //post index
                if (index === -1) return prevPosts;

                const updated = [...prevPosts]; //inherits all the data from prevPosts
                updated[index] = data; //re-assigns data from updated to the indexed one

                if (postId){
                    setPostObject(data);
                }
                return updated; //return the updated list 
            });
        }

        socket.on('fetch_single_post',handleLikePost);

        return () => {
            socket.off('fetch_single_post',handleLikePost);
        }
    }, [postId]);

    useEffect(() => { //assigns post id/object associated with comments
        if (postId) {
            const fetchPost = async () => {
                try {
                    const response = await api.get(`/post/${postId}`);
                    setPostObject(response.data.data);
                } catch (error) {
                    console.error(error);
                }
            }

            const fetchComments = async () => {
                try {
                    const response = await api.get(`/comment/${postId}`);
                    setComments(response.data.data);
                } catch (error) {
                    console.error(error);
                }
            };

            fetchPost();
            fetchComments();
        }
    }, [postId]);

    useEffect(() => { //fetching new comments via websocket
        const handleFetchComments = (data) => {
            setComments((prevComments) => [...prevComments,data]);
        }

        socket.on('fetch_comments',handleFetchComments);

        return () => {
            socket.off('fetch_comments',handleFetchComments);
        }
    }, []);

    useEffect(() => {
        const handleLikeComment = (data) => {
            setComments((prevComments) => {
                const index = prevComments.findIndex((p) => p.id === data.id);
                if (index === -1) return prevComments;

                const updated = [...prevComments];
                updated[index] = data;
                return updated;
            });
        }

        socket.on('fetch_single_comment',handleLikeComment);

        return () => {
            socket.off('fetch_single_comment',handleLikeComment);
        }
    }, []);

    const toggleModal = ({type}) => {
        switch(type){
            case 'post':
                setIsModalOpen(true);
                setAction('post');
                break;
            case 'photo':
                setIsModalOpen(true);
                setAction('photo');
                break;
            case 'location':
                setIsModalOpen(true);
                setAction('location');
                break;
            case 'feeling':
                setIsModalOpen(true);
                setAction('feeling');
                break;
            case 'comment':
                setIsModalOpen(true);
                setAction('comment');
                break;
            case 'close':
            default:
                setIsModalOpen(false);
                setAction(null);
                setPostInput(null);
                setpostId(null);
                setPostObject(null);
                setComments([]);
                setCommentInput(null);
                break;
        }
    }

    const openPost = ({id}) => {
        setpostId(id);
    }

    const createPost = async (e) => {
        e.preventDefault();

        setIsPostLoading(true);

        setPostInput(null);

        setTimeout(async () => {
            try {
                const formData = new FormData();
                formData.append("description", postInput);

                const response = await api.post("/post/create", formData, {
                    withCredentials: true,
                });

                socket.emit('create_post', response.data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsPostLoading(false);
                setIsModalOpen(false);
            }
        }, 2000);
    }

    const likePost = async({postId}) => {
        try {
            const response = await api.put(`/post/${postId}`,{},{withCredentials:true});
            socket.emit('like_post',response.data.data);
        } catch (error){
            console.error(error);
        }
    }

    const createComment = async(e) => {
        setCommentInput(null);
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('content',commentInput);
            const response = await api.post(`/comment/${postId}`, formData, {withCredentials:true});
            socket.emit('create_comment',response.data.data);
        } catch (error){
            console.error(error);
        }
    }

    const likeComment = async({commentId}) => {
        try {
            const response = await api.post(`comment/like/${commentId}`, {withCredentials:true});
            socket.emit('like_comment',response.data.data);
        } catch (error){    
            console.error(error);
        }
    }

    function CreatePostModalDisplay({action}){ //refactor
        if (action == 'post' || action == 'photo'){
            return (
                <>
                    {/* <textarea value={postInput} onChange={handlePostValue}
                        className="w-full border border-gray-300 p-2" rows="14">
                        What's on your mind
                    </textarea> */}
                    {/* <input value={postInput} onChange={handlePostValue}
                        className="w-full border border-gray-300 p-2"/> */}
                    <div className="flex flex-1 items-center justify-center gap-1">
                        <FaImages className="h-6 w-6 text-green-500"/>
                        <p className="text-xs">Add Photo</p>
                    </div>
                </>
            );
        } else if (action == 'location') {
            return (
                <div className="flex items-center gap-4">
                    <div className="text-lg flex-1 w-full text-center">User is at</div>
                    <input type="text" className="border border-gray-300 w-4/5 h-8 rounded-full"/>
                </div>
            );
        } else if (action == 'feeling') {
            return (
                <div className="flex items-center gap-4">
                    <div className="text-lg flex-1 w-full text-center">User is feeling</div>
                    <input type="text" className="border border-gray-300 w-3/5 h-8 rounded-full"/>
                </div>
            );
        } else {
            return <div>Error.</div>;
        }

    }

    function IsUserLiked({ likes }) {
        if (Array.isArray(likes) && likes.length > 0) {
            const isLiked = likes.findIndex((like) => like.user_id === user?.id);
            return isLiked === -1 ? (
                <>
                    <AiOutlineLike className="w-4 h-4"/>
                    Like 
                </>
            ) : (
                <>
                    <AiFillLike className="w-4 h-4 text-blue-500"/>
                    Unlike 
                </>
            );
        }

        return (
            <>
                <AiOutlineLike className="w-4 h-4"/>
                Like 
            </>
        );
    }

    return (
        <>  
            {IsPostLoading && (
                <div className="fixed inset-0 bg-black opacity-70 z-50 flex flex-col items-center justify-center">
                    <div className="loading">
                        <svg viewBox="25 25 50 50" width="50" height="50">
                            <circle cx="50" cy="50" r="20" />
                        </svg>
                        
                    </div>
                    <p className="text-white text-lg">Posting</p>
                </div>
            )}

            {isModalOpen && (
            <>
                <div className="fixed inset-0 bg-black opacity-70 z-30"></div>
                <div className="fixed inset-0 flex justify-center items-center z-40">
                    <div className="bg-white md:w-2/5 w-11/12 h-5/6 p-6 rounded-lg shadow-lg flex flex-col gap-4 relative">
                        {/* CARD HEADER */}
                        <div className="sticky top-0 bg-white z-10 flex justify-between items-center pb-2">
                            <p className="text-center font-bold mx-auto text-xl">
                                {action == 'comment' ? 'View post' : 'Create post'}
                            </p> 
                            <IoClose className="text-gray-500 w-4 h-4 cursor-pointer" 
                                onClick={() => toggleModal({ type: 'close' })}/>
                        </div>

                        <hr className="border-gray-300" />

                        {/* CARD BODY */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="flex flex-col gap-4">
                                {action == 'comment' ? 
                                    <>
                                        <div className="flex gap-2">
                                            <img src={postObject?.profile_picture} alt="User Profile picture"
                                                        className="w-12 h-12 rounded-full"/>
                                            <div className="flex flex-col">
                                                <p className="font-bold">{postObject?.posted_by}</p>
                                                <p className="text-2xs text-gray-500">
                                                    {moment.utc(postObject?.posted_at).local().fromNow()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="border border-gray-300 rounded-lg w-full h-auto p-4">
                                            {postObject?.description}
                                        </div>
                                        {postObject?.number_of_likes ? (
                                            <div className="flex items-center gap-2">
                                                <AiFillLike className="text-blue-500 w-4 h-4"/> 
                                                <span className="text-2xs">{postObject?.number_of_likes}</span>
                                            </div>
                                        ) : ""}
                                        <div className="flex items-center justify-around border-t border-b  border-gray-300">
                                            <div onClick={() => likePost({postId:postObject?.id})}
                                                className="flex items-center justify-center gap-2 w-full h-full 
                                                    hover:bg-gray-100 text-center cursor-pointer text-xs text-gray-500 p-4">
                                                <IsUserLiked likes={postObject?.likes}/>
                                            </div>
                                            <div 
                                                className="flex items-center justify-center gap-2 w-full h-full 
                                                    hover:bg-gray-100 text-center cursor-pointer text-xs text-gray-500 p-4">
                                                <span><FaRegComment className="w-4 h-4"/> </span> Comment
                                            </div>
                                        </div> 
                                        {
                                        Array.isArray(comments) && comments.length > 0 ?  
                                            comments.map((comment) => {
                                                return (
                                                    <div key={comment?.id} 
                                                        className="flex gap-3">
                                                        <img src={comment?.user_picture} className="w-10 h-10 rounded-full"/>
                                                        <div className="flex flex-col">
                                                            <div className="border border-gray-300 flex flex-col p-2 rounded-lg">
                                                                <p className="text-xs font-bold">{comment?.user}</p>
                                                                <p className="text-xs">{comment?.comment}</p>
                                                            </div>
                                                            <div className="flex items-center gap-4 px-2 text-xs text-gray-500">
                                                                <p className="">{moment.utc(comment?.posted_at).local().fromNow()}</p>
                                                                {/*  */}
                                                                <p className="me-auto">Like</p>
                                                                <div className="flex items-center gap-1">1<AiFillLike className="text-blue-500"/></div>
                                                                {/* <p onClick={() => {likeComment({commentId:comment?.id})}}
                                                                    className="text-xs text-gray-500 cursor-pointer me-auto">
                                                                        <IsUserLiked likes={comment?.likes}/>
                                                                </p>
                                                                {comment?.number_of_likes ?
                                                                    <div className="flex items-center gap-1">
                                                                        <p className="text-xs text-gray-500">
                                                                            {comment?.number_of_likes}
                                                                        </p>
                                                                        <AiFillLike className="text-blue-500 w-4 h-4"/> 
                                                                    </div> : ""
                                                                }    */}
                                                                {/*  */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }) : (
                                                <p className="text-center text-gray-500">No comments yet.</p>
                                            )
                                        }
                                    </>
                                    :
                                    <>
                                        {/* <CreatePostModalDisplay action={action}/> */}
                                         <textarea value={postInput} onChange={(e)=>setPostInput(e.target.value)}
                                            className="w-full border border-gray-300 p-2" rows="14">
                                            What's on your mind
                                        </textarea>
                                        {/* <input value={postInput} onChange={handlePostValue}
                                            className="w-full border border-gray-300 p-2"/> */}
                                        <div className="flex flex-1 items-center justify-center gap-1">
                                            <FaImages className="h-6 w-6 text-green-500"/>
                                            <p className="text-xs">Add Photo</p>
                                        </div>
                                    </>
                                }
                            </div>
                        </div>

                        {/* CARD FOOTER */}
                        <div className="sticky bottom-0 bg-white z-10 pt-2">
                            {action == 'comment' 
                                ? 
                                <div className="flex gap-2">
                                    <img src={user?.picture} alt="User Profile picture"
                                        className="w-8 h-8 rounded-full"/>
                                    <div className="relative w-full">
                                        <form onSubmit={createComment}>
                                            <textarea value={commentInput} onChange={(e) => setCommentInput(e.target.value)}
                                                className="border border-gray-300 rounded-lg w-full h-24 text-sm p-2" rows="10">
                                                Comment ...
                                            </textarea>
                                            <div className="absolute bottom-4 right-2">
                                                <button type="submit">
                                                    <IoSend className="text-gray-500 cursor-pointer"/>
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                :
                                <>  
                                    <button onClick={(e) => createPost(e)}
                                        className={"rounded-full text-white p-2 w-full " + 
                                            (postInput ? 'btn-primary-dark cursor-pointer' : 'btn-primary cursor-not-allowed')}>
                                        Post
                                    </button>
                                </>
                            }
                        </div>
                    </div>
                </div>
            </>
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

                    {/* LIST OF POSTS */}
                    <div className="mt-4">
                        <Suspense fallback={<p>Loading posts...</p>}>
                            {posts.length > 0 ? posts.map((postItem) => (
                                <div key={postItem?.id}
                                    className="border border-gray-300 rounded-lg flex flex-col gap-4 my-4">
                                    <div className="flex items-center gap-4 px-4 mt-4">
                                        <img src={postItem?.profile_picture} alt="User Profile picture"
                                            className="w-16 h-16 rounded-full"/>
                                        <div className="flex flex-col">
                                            <p className="font-semi-bold">{postItem?.posted_by}</p>
                                            <p className="text-xs text-gray-500">
                                                {moment.utc(postItem?.posted_at).local().fromNow()}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="flex-1 px-4">{postItem?.description}</p>
                                    {postItem?.number_of_likes ? (
                                        <div className="flex items-center gap-2 px-4">
                                            <AiFillLike className="text-blue-500 w-4 h-4"/> 
                                            <span className="text-2xs">{postItem?.number_of_likes}</span>
                                        </div>
                                    ) : ""}
                                    <div className="flex items-center justify-around border-t border-gray-300">
                                        <div onClick={() => likePost({postId: postItem?.id})} 
                                            className="flex items-center justify-center gap-2 w-full h-full hover:bg-gray-100 text-center cursor-pointer text-xs p-4">
                                            {/* <AiOutlineLike className="w-4 h-4"/>    */}
                                            <IsUserLiked likes={postItem?.likes}/>
                                        </div>
                                        <div onClick={() => {
                                            toggleModal({type:'comment'});
                                            openPost({id:postItem?.id})
                                        }} 
                                            className="flex items-center justify-center gap-2 w-full h-full hover:bg-gray-100 text-center cursor-pointer text-xs p-4">
                                            <FaRegComment className="w-4 h-4"/>
                                            Comment
                                        </div>
                                    </div>  
                                </div>
                            )) : 
                                <>
                                    <p className="text-gray-500 text-center mt-24">No posts available yet.</p>
                                </>
                            }
                        </Suspense>
                    </div>                 
                </div>
            </div>
        </>   
    )
}

export default Home;