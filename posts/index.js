import express from "express";
import bodyParser from "body-parser";
import { randomBytes } from 'crypto';
import axios from 'axios';
import cors from 'cors';

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
   res.send(posts); 
});

app.post('/posts', async (req, res) => {
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;
    posts[id] = { id, title };

    await axios.post("http://event-bus-srv:6001/events", {
        type: "PostCreated",
        data: { id, title },
    });
    
    res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
    console.log('Received event post', req.body.type);

    res.send({});

})

app.listen(4001, () => {
    console.log('listening post: 4001');
});