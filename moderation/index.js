import express from 'express';
import bodyParser from 'body-parser';
import axios from "axios";
// import cors from 'cors';

const app = express();
app.use(bodyParser.json());
// app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/events',  async(req, res) => {
    const { type, data } = req.body;

    if (type === 'PostCreated') {
        const { id, title } = data;

        posts[id] = { id, title, comments: [] };
    }

    if (type === 'CommentCreated') {
        const status = data.content.includes("orange") ? 'rejected' : 'approved';

        await axios.post('http://event-bus-srv:6001/events', {
            type: 'CommentModerated',
            data: {
                id: data.id,
                postId: data.postId,
                status,
                content: data.content
            },
        });
    }

    console.log(posts);

    res.send({});
});

app.listen(8001, () => {
    console.log('Listening moderation on 8001');
});