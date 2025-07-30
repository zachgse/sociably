import { useEffect,useContext } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { usePostFetch } from '../../hooks/postHooks.js';
import socket  from '../../utils/Socket.js';
import PostItem from "./PostItem.js";
import ModalContext from '../../utils/ModalContext.js';

export default function PostList(){
    const queryClient = useQueryClient();
    const {postObject,setPostObject} = useContext(ModalContext);

    const { data: posts = [] , isLoading,error, isSuccess } = usePostFetch();

    useEffect(() => { //web socket for new posts
        socket.on('fetch_posts', data => {
            queryClient.setQueryData(['posts'], old => {
                return old ? [data,...old] : [data];
            });
        });

        return () => {
            socket.off('fetch_posts');
        }
    });

    useEffect(() => { //web socket for likes on posts
        socket.on('fetch_single_post', data => {
            queryClient.setQueryData(['posts'], old => {
                const index = old.findIndex((o) => o.id === data.id);
                if (index === -1) return old;

                const updated = [...old];
                updated[index] = data;

                if (postObject){
                    setPostObject(data);
                }

                return updated;
            });
        });

        return () => {
            socket.off('fetch_single_post');
        }
    });

    if (isLoading) return <p className='text-gray-500 text-center'>Loading posts ...</p>

    if (error) return <p className='text-gray-500 text-center'>Error!</p>

    if (isSuccess && posts.length === 0){
        return <p className='text-gray-500 text-center'>No posts yet ...</p>
    }

    return (
        <>
            {posts.map((post) => {
                return <PostItem key={post.id} post={post} type="home"/>
            })}
        </>
    )
}