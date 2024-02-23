const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const axios = require('axios');
const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts ={};

const handelEvent = (type,data) =>{

    if(type === 'postCreated'){
        const {id, title} = data;

        posts[id] = {id, title, comments: []};
    }
    if(type === 'commentCreated'){
        const {id, content, postId, flag} = data;

        posts[postId].comments.push({id, content, flag})

    }
    if(type ==='commentUpdated'){
        const {id, content, postId, flag} = data;

        const comment = posts[postId].comments.find(comment => {
            return comment.id === id;
        });

        comment.flag = flag;
        comment.content = content;

    }
}

app.get('/posts', (req,res) =>{
    res.send(posts);
});

app.post('/events', (req,res) =>{

    const {type, data} = req.body;

    handelEvent(type,data);

    res.send({flag: 'OK'});
    
});

app.listen(4002, async () => {
    console.log("query service online at post 4002");

    const res = await axios.get('http://localhost:4005/events');

    for(let event of res.data){
        console.log('procressing event:', event.type);

        handelEvent(event.type, event.data);
    }
});