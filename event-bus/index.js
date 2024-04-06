import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import cors from 'cors';

const app = express();
app.use(bodyParser.json());
app.use(cors());

const events = [];

app.post('/events', (req, res) => {
    const event = req.body;

    events.push(event);

    axios.post('http://posts-clusterip-srv:4001/events', event).catch((err) => console.log(err.message));
    axios.post('http://comments-srv:5001/events', event).catch((err) => console.log(err.message));
    axios.post('http://query-srv:7001/events', event).catch((err) => console.log(err.message));
    axios.post('http://moderation-srv:8001/events', event).catch((err) => console.log(err.message));

    res.send({ status: 'OK'})
});

app.get('/events', (req, res) => {
    res.send(events);
})

app.listen(6001, () => {
    console.log('listening event - bus: 6001');
})
