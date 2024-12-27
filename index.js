var express = require('express') //Importing express
var app = express();
var mysqlDAO = require('./mySqlDao');
var bodyParser = require('body-parser')// Parse incoming request bodies in a middleware before your handlers, 

let ejs = require('ejs');
app.set('view engine', 'ejs')
const { check, validationResult } = require('express-validator');
app.use(bodyParser.urlencoded({extended: false}))

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

//Calling addStudent page to add a student to student collection
app.get("/addStudent", (req, res) => {
    res.render("addStudent", {"errors": undefined})
 })

 //Handling when user hits add to add to students collection
 app.post("/addStudent", 
    [   //Checking request body
        check("sid").isLength({min:4, max:4}).withMessage("Student ID should be 4 characters")
        .custom(async (sid) => { //Validating duplicate student id
            var existingStudents = await mysqlDAO.getStudentByID(sid); 
            if (existingStudents.length > 0) {
                return Promise.reject("Student ID already exists. Please use a unique ID.");
            }
        }),
        check("name").isLength({min:2}).withMessage("Name should be a minimum of 4 characters"),
        check("age").isInt({min:18}).withMessage("Age should be 18 or older")
    ],
    
    async (req,res) => {
        const errors = validationResult(req)//validating request body        

        if (!errors.isEmpty()) {//If errors not empty
            res.render("addStudent",{errors:errors.errors})
        }
        else {
            await mysqlDAO.addStudent(req.body)
            res.redirect("students")
        }

})

//Calling edit page by student id
app.get("/students/edit/:sid", async (req, res) => {
        const sid = req.params.sid; 
        const student = await mysqlDAO.getStudentByID(sid);//Fetching details from db
        res.render("edit", { student: student[0], errors: undefined });
})

 //Handling student updates
 app.post("/students/edit/:sid", 
    [   //Checking request body
        check("name").isLength({min:2}).withMessage("Name should be a minimum of 4 characters"),
        check("age").isInt({min:18}).withMessage("Age should be 18 or older")
    ],
    
    async (req,res) => {
        const errors = validationResult(req)//validating request body        

        if (!errors.isEmpty()) {//If errors not empty
            
            const student = {
                sid: req.params.sid,
                name: req.body.name,
                age: req.body.age
            };
            res.render("edit",{student, errors:errors.errors})
        }
        else {
            await mysqlDAO.editStudent(req.params.sid, req.body)
            res.redirect("/students")
        }
})
