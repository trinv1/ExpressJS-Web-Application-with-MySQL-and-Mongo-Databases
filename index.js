var express = require('express') //Importing express
var app = express();
var mysqlDAO = require('./mySqlDao');
let ejs = require('ejs');
app.set('view engine', 'ejs')

//App listening on port 3004
app.listen(3004, ()=> {
    console.log("Application listening on port 3004")
})

//Home page with links to each page
app.get("/", (req, res) => {

   res.send(`    
    <h1>G00405393</h1>
    <a href="/students">Students</a><br>
    <a href="/grades">Grades</a><br>
    <a href="/lecturers">Lecturers</a>
    `);
})

//Calling get students
app.get("/students", (req, res) => {
    mysqlDAO.getStudents()
    .then((data) => {
        res.render("students", {studentsList: data})
        console.log(JSON.stringify(data))
    })
    .catch((error) => {
        res.send(error)
    })
})
