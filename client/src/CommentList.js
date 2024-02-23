import React from "react";

const CommentList = (props) => {

    const comments = props.comments;
    // console.log(posts);
    const renderedComments = comments.map(comment => {

        let content;

        if(comment.flag === 'approved'){ 
            content = comment.content;
        }
        if(comment.flag === 'rejected'){ 
            content = 'This comment has been rejected';
  
        }
        if(comment.flag === 'pending'){ 
            content = 'This comment is awaiting moderation';
        }

        return(
            <>
                <li key = {comment.id}>{content}</li>
            </>
        )
    });

    return(
        <ul>
            {renderedComments}
        </ul>
    );
}

export default CommentList;