import { useQuery,useMutation } from "@tanstack/react-query";
import { fetchAllPost,likePost } from "../api/postMethods";
import socket from "../utils/Socket";

export const usePostFetch = () => {
    return useQuery({
        queryKey: ['posts'],
        queryFn: () => fetchAllPost()
    });
}

export const usePostLike = () => {
    return useMutation({
        mutationFn: likePost,
        onSuccess: (updatedPost) => {
            socket.emit('like_post',updatedPost);
        }
    });
}

