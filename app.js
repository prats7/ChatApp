const express = require('express');

const http = require('http');

const path = require('path');

const app = express();

const port = 8000;

const server = http.createServer(app);

//Set public folder for front-end
app.use(express.static(path.join(__dirname,'public')));


server.listen(port, function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});