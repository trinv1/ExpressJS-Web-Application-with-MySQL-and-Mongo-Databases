var express = require('express') //Importing express
var app = express();

//App listening on port 3004
app.listen(3004, ()=> {
    console.log("Application listening on port 3004")
})