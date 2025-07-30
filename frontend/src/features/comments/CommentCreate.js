import { useContext } from "react";
import { useForm } from "react-hook-form";
import { IoSend } from "react-icons/io5";
import { useCommentCreate } from "../../hooks/commentHooks";
import AuthContext from "../../utils/AuthContext";
import ModalContext from "../../utils/ModalContext";

export default function CommentCreate(){
    const {
        register, 
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const [user] = useContext(AuthContext);
    const {postObject} = useContext(ModalContext);

    const createComment = useCommentCreate();

    const onSubmit = (data) => {  
        createComment.mutate({postId:postObject.id,content:data.comment});
        reset();
    }

    return (
        <div className="flex gap-2">
            <img src={user?.picture} alt="User Profile picture"
                className="w-8 h-8 rounded-full"/>
            <div className="relative w-full">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <textarea 
                        {...register("comment", { required : "Comment is required" })}
                        autoFocus
                        placeholder="Comment ..."
                        className={'rounded-lg w-full h-24 text-sm p-2 ' + 
                        (errors?.comment?.message ? 'border border-red-300' : 'border border-gray-300')}
                        rows="10"/>
                    {errors.comment && (
                        <p className="text-red-500 text-center text-xs">{errors.comment.message}</p>
                    )}
                    <div className="absolute bottom-4 right-2">
                        <button type="submit" disabled={createComment.isPending}>
                            <IoSend className="text-gray-500 cursor-pointer"/>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}