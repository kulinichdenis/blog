import React, { useState } from 'react';
import axios from 'axios';

const CommentCreate = ({ postId }) => {
    const [content, setContent] = useState('');

    const onSubmit = async (event) => {
        event.preventDefault();
        await axios.post(`http://localhost:5001/posts/${postId}/comments`, {
            content
        })

        setContent('');
    }
    return (
        <div>
            <form onSubmit={onSubmit}>
                <div>
                    <label htmlFor="comment">New Commnet</label>
                    <input
                        name="comment"
                        value={content}
                        type="text"
                        onChange={(event) => setContent(event.target.value)}
                    />
                </div>
                <button>Submit</button>
            </form>
        </div>
    );
};

export default CommentCreate;