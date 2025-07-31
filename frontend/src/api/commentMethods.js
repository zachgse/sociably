import api from "../utils/api";

export const fetchAllCommentsFromPost = async(postId) => {
    try {
        const response = api.get(`/comment/${postId}`);
        return (await response).data.data;
    } catch (error) {
        console.error(error);
    }
}

export const createComment = async({postId,content}) => {
    try {
      const response = await api.post(`/comment/${postId}`,
          {
            content
          }
      )
      return response.data.data;
    } catch (error){
      console.error(error);
    }
}

export const likeComment = async({commentId}) => {
    try {
        const response = await api.post(`comment/like/${commentId}`);
        return response.data.data;
    } catch (error) {
        console.error(error);
    }
}