const express = require('express');
const cors = require('cors');
const app = express();
const sugestionsRoute = require('./routes/v1/suggestions');
const commentsRoute = require('./routes/v1/comments');
const repliesRoute = require('./routes/v1/replies');
app.use(cors());
app.use(express.json());

app.get('/', (req,res) => {
  res.send('server is running')
})

app.use('/v1/suggestions', sugestionsRoute);
app.use('/v1/replies', repliesRoute);
app.use('/v1/comments', commentsRoute);

app.get('/*', (req,res)=>{
    res.send('server is running');
});

app.listen(8080, ()=>{
    console.log('server is running on port 8080');
});