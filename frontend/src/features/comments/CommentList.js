import { useEffect,useContext } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCommentFetch } from "../../hooks/commentHooks";
import socket from "../../utils/Socket";
import CommentItem from "./CommentItem";
import ModalContext from "../../utils/ModalContext";
    
export default function CommentList(){
    const queryClient = useQueryClient();
    const { postObject } = useContext(ModalContext);
    
    const postId = postObject.id;

    const { data: comments, isLoading, error, isSuccess } = useCommentFetch(postObject?.id);


    useEffect(() => { //web socket for new comments
        socket.on('fetch_comments', data => {
            queryClient.setQueryData(['comments',postId], old => {
                return old ? [...old,data] : [data];
            });
        });

        return () => {
            socket.off('fetch_comments');
        }
    });

    useEffect(() => { //web socket for likes on comments
        socket.on('fetch_single_comment', data => {
            queryClient.setQueryData(['comments', postId], old => {
                const index = old.findIndex((o) => o.id === data.id);
                if (index === -1) return old;

                const updated = [...old];
                updated[index] = data;
                return updated;
            });
        });

        return () => {
            socket.off('fetch_single_comment');
        }
    });

    if (isLoading) return <p className="text-gray-500 text-center">Loading comments ...</p>

    if (error) return <p className="text-gray-500 text-center">Error!</p>

    if (isSuccess && comments.length === 0){
        return <p className="text-center text-gray-500">No comments yet.</p>
    }

    return (
        comments.map((comment) => {
            return <CommentItem key={comment.id} comment={comment}/>
        })
    )
}