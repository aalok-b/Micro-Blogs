const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

app.post('/events',async (req,res) => {

    const {type, data} = req.body;

    if(type === 'commentCreated'){

        console.log('comment recievd');
        const flag = data.content.includes('hate')? 'rejected' : 'approved';
        console.log('comment filtered');

        await axios.post('http://localhost:4005/events',{
            type: 'commentModerated',
            data: {
                id : data.id,
                postId: data.postId,
                flag,
                content: data.content
            }
        });
    }

    res.send({status:'OK'});
});

app.listen(4003, () => {
    console.log("moderation service online at port 4003");
});