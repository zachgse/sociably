import { useQuery,useMutation } from "@tanstack/react-query";
import { fetchAllCommentsFromPost,createComment,likeComment } from "../api/commentMethods";
import socket from "../utils/Socket";

export const useCommentFetch = (postId) => {
    return useQuery({
        //queryKey is globally shared, therefore it can be accessed on other components as long as the queryKey is the same
        //it also acts as setState in a way 
        queryKey: ['comments',postId],
        queryFn: () => fetchAllCommentsFromPost(postId)
    });
}

export const useCommentCreate = () => {
    return useMutation({
        mutationFn: createComment,
        onSuccess: (newComment) => {
            socket.emit('create_comment',newComment);
        }
    })
}

export const useCommentLike = () => {
    return useMutation({
        mutationFn: likeComment,
        onSuccess: (updatedComment) => {
            socket.emit('like_comment',updatedComment);
        }
    });
}

