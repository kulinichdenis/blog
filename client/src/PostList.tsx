import React, { useState, useEffect} from 'react';
import axios from 'axios';
import CommentCreate from "./CommentCreate";
import CommentList from "./CommentList";

const PostList = () => {
    const [posts, setPosts] = useState({});

    const fetchPosts = async () => {
        const res = await axios.get('http://localhost:7001/posts')
        setPosts(res.data);
    }

    useEffect(() => {
        fetchPosts();
    }, [])

    const renderPosts = Object.values(posts).map((post) => {
        console.log(post, "post")
        return <div key={post.id}>
            <div>
                <h3>{post.title}</h3>
                <CommentList comments={post.comments} />
                <CommentCreate postId={post.id} />
            </div>
            <hr />
        </div>
    })

    return (<div>{renderPosts}</div>);
};

export default PostList;