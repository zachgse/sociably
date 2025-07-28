import CommentItem from "./CommentItem";

export default function CommentList({ comments }){
    if (!Array.isArray(comments) && comments.length === 0){
        return <p className="text-center text-gray-500">No comments yet.</p>
    }

    return (
        comments.map((comment) => {
            <CommentItem key={comment.id} comment={comment}/>
        })
    )
}