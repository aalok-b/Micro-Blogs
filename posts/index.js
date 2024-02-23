const express = require('express');
const { randomBytes } = require('crypto'); 
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json()); // ?????
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/posts', async(req, res) => {
    //generate a random id to add to post
    const id = randomBytes(4).toString('hex');
    const {title} = req.body;
    // fetch title from request and add the item (id + title ) to posts
    posts[id] = {
        id,
        title
    };
    // post event creation data to event bus
    await axios.post('http://localhost:4005/events',{
        type: 'postCreated',
        data: {
            id,
            title
        }
    });
    //responce to user that req is sucess
    // setting a status indicate we created a resource
    res.status(201).send(posts[id]);

});

app.post('/events', (req,res) =>{
    console.log("event recieved", req.body.type);

    res.send({status: "OK"});
});

app.listen(4000, () => {
    console.log('Post service online on port 4000');
});
