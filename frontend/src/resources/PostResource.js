import { createResource } from "../utils/CreateResource";
import api from "../api/api";

function fetchAllPosts() {
    return api.get('/post').then(res => res.data.data);
}

export const fetchPostsResource = createResource(fetchAllPosts());