import { createResource } from "../utils/CreateResource";
import api from "../api/api";

function fetchCommentsAndPost(id){
    return api.get(`/comment/${id}/comments`).then(res => res.data.data);
}

export const fetchCommentsAndPostResource = (id) => createResource(fetchCommentsAndPost(id));