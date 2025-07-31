import api from "../utils/api";

export const fetchAllPost = async() => {
    try {
        const response = await api.get('/post');
        return response.data.data;
    } catch (error) {
        console.error(error);
    }
}

export const likePost = async({postId}) => {
    try {
        const response = await api.put(`/post/${postId}`);
        return response.data.data;
    } catch (error){
        console.error(error);
    }
}
