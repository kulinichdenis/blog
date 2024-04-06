import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import axios from "axios";

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
    if (type === 'PostCreated') {
        const { id, title } = data;

        posts[id] = { id, title, comments: [] };
    }

    if (type === 'CommentCreated') {
        const { id, content, postId, status } = data;

        const post = posts[postId];
        post.comments.push({ id, content, status });
    }

    if (type === 'CommentUpdated') {
        const { id, content, postId, status } = data;

        const post = posts[postId];
        const comment = post.comments.find((comment) => id === comment.id);

        comment.status = status;
        comment.content = content;
    }
}

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/events', (req, res) => {
    const { type, data } = req.body;

    handleEvent(type, data);
    res.send({});
});

app.listen(7001, async () => {
    console.log('Listening query on 7001');

    const res = await axios.get('http:event-bus-srv:6001/events');

    for (let event of res.data) {
        console.log('Processing event:');
        handleEvent(event.type, event.data);
    }
});