const express = require('express');
const bodyParser = require('body-parser');
const {randomBytes} = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());


//key = postId each key contain array of comments
const commentsByPostId = {}; 

app.post('/posts/:id/comments', async (req,res) => {

    const commentId = randomBytes(4).toString('hex');
    const {content} = req.body;
    // check if comments exist for given post if not then give empty array
    const comments = commentsByPostId[req.params.id] || [] ;
    const flag = 'pending';

    comments.push({id: commentId, content, flag});
    commentsByPostId[req.params.id] = comments;

    await axios.post('http://localhost:4005/events', {
        
        type:'commentCreated',
        data: {
            id: commentId,
            content,
            postId: req.params.id,
            flag
        }
    }).catch((err) => {
        console.log(err.message);
      });;

    res.status(201).send(comments);
    
});

app.get('/posts/:id/comments', (req,res) => {

    res.send(commentsByPostId[req.params.id] || [])

});

app.post('/events', async (req,res) => {
    console.log("event recieved", req.body.type);

    const {type, data} = req.body;

    if( type === 'commentModerated'){
        console.log("moderation recieved !!")
        const {id, postId,flag, content} = data;
        // the comment to be updated
        const comment = commentsByPostId[postId].find(comment =>{
            return comment.id === id;
        });

        comment.flag = flag;
        
        await axios.post('http://localhost:4005/events',{
            type: 'commentUpdated',
            data: {
                id,
                postId,
                flag,
                content
            }
        });

    }

    res.send({status: "OK"});
});

app.listen(4001, () =>{
    console.log("Comment service online on port 4001" );
});
