import express from "express";
import bodyParser from "body-parser";
import { randomBytes } from 'crypto';
import axios from 'axios';
import cors from 'cors';

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
   res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments',  async (req, res) => {
    const id = randomBytes(4).toString('hex');
    const { content } = req.body;
    const comments = commentsByPostId[req.params.id] || [];
    comments.push({ id, content, status: 'pending' });

    commentsByPostId[req.params.id] = comments;

    await axios.post("http://event-bus-srv:6001/events", {
        type: "CommentCreated",
        data: {
            id,
            content,
            postId: req.params.id,
            status: 'pending',
        },
    });

    res.status(201).send(comments);
});

app.post('/events',  async (req, res) => {
    console.log('Received event comment', req.body.type);
    const { type, data } = req.body;

    if (type === "CommentModerated") {
        const { postId, id, status, content } = data;

        const comments = commentsByPostId[postId];
        const comment = comments.find(comment => {
            return comment.id === id;
        });
        comment.status === status;

        await axios.post('http://event-bus-srv:6001/events', {
           type: 'CommentUpdated',
           data: {
               id,
               status,
               postId,
               content,
           }
        });
    }

    res.send({});

})

app.listen(5001, () => {
    console.log('listening comments 5001');
});