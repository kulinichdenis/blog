import express from "express";
import bodyParser from "body-parser";
import { randomBytes } from 'crypto';
import cors from 'cors';

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
   res.send(posts); 
});

// hello adasdasd
app.post('/posts', (req, res) => {
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;
    posts[id] = { id, title };
    
    res.status(201).send(posts[id]);
});

app.listen(4001, () => {
    console.log('listening 4001');
});