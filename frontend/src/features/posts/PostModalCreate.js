import { useEffect,useContext,useState,useRef } from "react";
import { FaImages } from "react-icons/fa"; 
import api from "../../utils/api";
import AuthContext from "../../utils/AuthContext";
import ModalContext from "../../utils/ModalContext";

export default function PostModalCreate({postInput,setPostInput,preview,setPreview,setFile,fileInputRef}){
    const [user] = useContext(AuthContext);
    const { action } = useContext(ModalContext);
    const [emojiArray,setEmojiArray] = useState([]);

    useEffect(() => {
        if (action == 'feeling'){
            const fetchEmoji = async () => {
                try {
                    const response = await api.get('/emojis');
                    setEmojiArray(response.data.data);
                } catch (error) {
                    console.error(error);
                }
            }

            fetchEmoji();
        }

    },[]); 

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        if (selectedFile) {
            const imageUrl = URL.createObjectURL(selectedFile);
            setPreview(imageUrl);
        }
    };

    const handleRemoveImage = () => {
        setPreview(null);
        setFile(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
    };

    if (action == 'post' || action == 'photo'){
        return (
            <>
                <textarea
                    value={postInput}
                    onChange={(e) => setPostInput(e.target.value)}
                    className="w-full border border-gray-300 p-2"
                    rows="14"
                    placeholder="What's on your mind"
                />
                {preview && (
                    <div className="relative mx-auto">
                        <img
                        src={preview}
                        alt="Preview"
                        className="w-48 h-48 object-cover border rounded"
                        />
                        <button className="absolute top-1 right-1 bg-white rounded-full px-2 py-1 text-xs shadow cursor-pointer" 
                            onClick={handleRemoveImage}>
                            ✕
                        </button>
                    </div>
                )}
                <div className="flex flex-1 items-center justify-center gap-1">
                    <FaImages className="h-6 w-6 text-green-500" />
                    <input type="file" accept="image/*" 
                        onChange={handleFileChange} ref={fileInputRef}/>
                </div>
            </>
        )
    } else if (action == 'feeling'){
        return (
            <>
                <p className="text-xl font-semi-bold">{user?.name} is feeling {postInput}</p>
                <div className="grid grid-cols-2 gap-2 p-2">
                    {emojiArray.slice(0, 20).map((emoji, index) => (
                        <button
                            key={index}
                            onClick={() => setPostInput(`${emoji.emoji} ${emoji.tags[0]}`)}
                            className="text-2xl hover:bg-gray-100 rounded p-2 transition text-left cursor-pointer"
                        >
                            {emoji.emoji} {emoji.tags[0]}
                        </button>
                    ))}
                </div>
            </>
        )
    } else if (action == 'location'){
        return (
            <>
                <input value={postInput}
                    onChange={(e) => setPostInput(e.target.value)} 
                type="text" 
                className="w-full border border-gray-300 rounded-full p-2"
                placeholder="Where are you?"/>
            </>
        )
    }
}

