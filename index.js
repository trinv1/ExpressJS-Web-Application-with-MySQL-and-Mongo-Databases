var express = require('express') //Importing express
var app = express();
var mysqlDAO = require('./mySqlDao');
const mongoDBDao = require('./mongoDBDao');
var bodyParser = require('body-parser')

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

//Calling get students to show students collection
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

//Calling get grades to show grades collection
app.get("/grades", (req, res) => {
    mysqlDAO.getGrades()
    .then((data) => {
        res.render("grades", {gradesList: data})
        console.log(JSON.stringify(data))
    })
    .catch((error) => {
        res.send(error)
    })
})

//Calling get lecturers to show lecturers collection
app.get('/lecturers', (req, res) => {
    mongoDBDao.findAll()
    .then((data) => {
        res.render("lecturers", {lecturersList: data})
    })
    .catch((error) => {
        res.status(500).send("Error fetching data: " + error.message);
    })
    })

//Handling deleting lecturers
app.get("/lecturers/delete/:lid", async (req, res) => {
    const lecturerID = req.params.lid; 

        const lecturersModules = await mysqlDAO.checkIfLecturerHasModule(lecturerID);

        if (lecturersModules.length > 0) {//If lecturer has modules
            return res.send(`
                 <a href="/">Home</a>
                <h1>Error Message</h1>
                <h2>Cannot delete Lecturer ${lecturerID}. He/She has associated modules.</h2>
                <a href="/lecturers">Back to Lecturers</a>
            `);
        }
        else{//Else delete lecturer
            await mongoDBDao.deleteLecturer(lecturerID);
            res.redirect('/lecturers');
        } 
});

