import { useContext } from "react";
import moment from "moment";
import { AiFillLike } from "react-icons/ai";
import AuthContext from "../../utils/AuthContext";
import { useCommentLike } from "../../hooks/commentHooks";

export default function CommentItem({ comment }){
    const [user] = useContext(AuthContext);

    const createLikeComment = useCommentLike();

    const handleLikeComment = () => {
        createLikeComment.mutate({commentId:comment.id});
    }

    function IsUserLiked(){
        const isLiked = comment.likes.some((like) => like.user_id === user.id);
        return isLiked ? 'Unlike' : 'Like';
    }

    return (    
        <div key={comment.id} 
            className="flex gap-3">
            <img src={comment.user_picture} className="w-10 h-10 rounded-full"/>
            <div className="flex flex-col">
                <div className="border border-gray-300 flex flex-col p-2 rounded-lg">
                    <p className="text-xs font-bold">{comment.user}</p>
                    <p className="text-xs">{comment.comment}</p>
                </div>
                <div className="flex items-center gap-4 px-2 text-xs text-gray-500">
                    <p>{moment.utc(comment?.posted_at).local().fromNow()}</p>
                    <p onClick={handleLikeComment} className="cursor-pointer me-auto"> 
                        <IsUserLiked/>
                    </p>
                    {comment.number_of_likes > 0 && (
                    <div className="flex items-center gap-1">
                        <p>{comment.number_of_likes}</p>
                        <AiFillLike className="text-blue-500"/>
                    </div>
                    )}
                </div>
            </div>
        </div>
    )
}