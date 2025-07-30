import { useContext,useState,useRef } from "react";
//Icons
import { IoClose } from "react-icons/io5";
//Utils
import api from "../utils/api";
import socket from "../utils/Socket";
import ModalContext from "../utils/ModalContext";
//General Components
import Sidebar from "../components/Sidebar";
//Posts Components
import PostCreate from "../features/posts/PostCreate";
import PostModalCreate from "../features/posts/PostModalCreate";
import PostList from "../features/posts/PostList"; 
import PostItem from "../features/posts/PostItem"; 
import PostLoading from "../features/posts/PostLoading"; 
//Comments Components
import CommentList from "../features/comments/CommentList";
import CommentCreate from "../features/comments/CommentCreate";

function Home() {
    const { isModalOpen,setIsModalOpen, action, toggleModal, postObject } = useContext(ModalContext);

    //post create variables
    const [postInput,setPostInput] = useState(null);
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);
    const fileInputRef = useRef();
    const [IsPostLoading,setIsPostLoading] = useState(false);

    const createPost = async (e) => {
        e.preventDefault();
        setIsPostLoading(true);

        setTimeout(async () => {
            try {
                const formData = new FormData();
                formData.append("description", postInput);
                formData.append("type",action);
                if (file) {
                    formData.append("image", file);
                }
                const response = await api.post("/post/create", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                });
                socket.emit('create_post', response.data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsPostLoading(false);
                setIsModalOpen(false);
                setPostInput(null);
                setPreview(null);
                setFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = null;
                }
            }
        }, 2000);
    }

    return (
        <>  
            {IsPostLoading && (
                <PostLoading/>
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
                                onClick={() => {
                                    setPostInput(null);
                                    toggleModal({ type: 'close' })}
                                }/>
                        </div>

                        <hr className="border-gray-300" />

                        {/* CARD BODY */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="flex flex-col gap-4">
                                {action == 'comment' ? 
                                    <>
                                        <PostItem post={postObject} type="modal"/>
                                        <CommentList/>
                                    </>
                                    :
                                    <>
                                        <PostModalCreate 
                                            postInput={postInput}
                                            setPostInput={setPostInput}
                                            preview={preview}
                                            setPreview={setPreview}
                                            file={file}
                                            setFile={setFile}
                                            fileInputRef={fileInputRef}/>
                                    </>
                                }
                            </div>
                        </div>

                        {/* CARD FOOTER */}
                        <div className="sticky bottom-0 bg-white z-10 pt-2">
                            {action == 'comment' 
                                ? <CommentCreate/>
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
                <div className="grid md:col-span-2 col-span-0 md:block hidden mx-auto p-4">
                    <Sidebar/>
                </div>
                <div className="grid md:col-span-8 col-span-12 mx-auto md:w-4/5 w-full gap-4 p-4">
                    <PostCreate/> 
                    <PostList/>
                </div>
            </div>
        </>   
    )
}

export default Home;